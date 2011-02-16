/**
 * Metaversant five star ratings component
 * 
 * @namespace Metaversant
 * @class Metaversant.Search
 */
(function()
{
   /**
    * YUI Library aliases
    */
   var Dom = YAHOO.util.Dom,
      Event = YAHOO.util.Event;
      
    /**
     * Alfresco Slingshot aliases
     */
    var $html = Alfresco.util.encodeHTML,
      $links = Alfresco.util.activateLinks,
      $combine = Alfresco.util.combinePaths;

    /**
     * Generate ratings widget
     *
     * @method generateRatingsWidget
     * @param scope {object} DocumentLibrary instance
     * @param record {object} DataTable record
     * @return {string} HTML mark-up for ratings widget
     */
    Alfresco.Search.prototype.generateRatingsWidget = function Search_generateRatingsWidget(scope, record)
    {
        var id = scope.id + "_mrating_" + record.getData("nodeRef").replace("workspace://SpacesStore/", ""),
            type = record.getData("isFolder") ? "folder" : "document",
            isRateable = record.getData("custom").isRateable,
            rating = record.getData("custom").averageRating,
            ratingsCount = record.getData("custom").ratingsCount;

        if (type == 'document' && isRateable)
        {
            scope.widgets.dataTable.subscribe("renderEvent", mratings.onMetadataRefresh, id, mratings);
            // <div>&nbsp;(' + ratingsCount + (ratingsCount == 1 ? ' rating' : ' ratings') + ')</div>
            return '<div class="details"><div class="rating-label">Rating:</div><div id="' + id + '" class="rating">' + rating + '</div><div style="clear:left;"></div></div>';            
        }
        else
        {
            return '';
        }
    };

    /**
     * Fired by YUI when parent element is available for scripting.
     * Component initialisation, including instantiation of YUI widgets and event listener binding.
     *
     * @method onReady
     */        
    Alfresco.Search.prototype.onReady = function Search_onReady()
    {
         // Toggle scope link
         var toggleScopeLink = Dom.get(this.id + "-scope-toggle-link");
         Event.addListener(toggleScopeLink, "click", this.onToggleSearchScope, this, true);

         // DataSource definition
         var uriSearchResults = Alfresco.constants.PROXY_URI + "slingshot/search?";
         this.widgets.dataSource = new YAHOO.util.DataSource(uriSearchResults);
         this.widgets.dataSource.responseType = YAHOO.util.DataSource.TYPE_JSON;
         this.widgets.dataSource.connXhrMode = "queueRequests";
         
         // Metaversant Ratings adds "custom" to the fields returned
         this.widgets.dataSource.responseSchema =
         {
             resultsList: "items",
             fields: ["nodeRef", "type", "name", "displayName", "description",
                      "modifiedOn", "modifiedByUser", "modifiedBy", "size",
                      "title", "browseUrl", "site", "tags", "custom"]
         };
         
         // setup of the datatable.
         this._setupDataTable();
         
         // trigger the initial search
         YAHOO.Bubbling.fire("onSearch",
         {
            searchTerm: this.options.initialSearchTerm,
            searchTag: this.options.initialSearchTag,
            searchAll: (this.options.initialSearchAll == 'true')
         });
         
         // Hook action events
         Alfresco.util.registerDefaultActionHandler(this.id, "search-tag", "span", this);
         Alfresco.util.registerDefaultActionHandler(this.id, "search-scope-toggle", "a", this);
         
         // Finally show the component body here to prevent UI artifacts on YUI button decoration
         Dom.setStyle(this.id + "-body", "visibility", "visible");    
    };
    
    Alfresco.Search.prototype._setupDataTable = function Search_setupDataTable()
    {
         /**
          * DataTable Cell Renderers
          *
          * Each cell has a custom renderer defined as a custom function. See YUI documentation for details.
          * These MUST be inline in order to have access to the Alfresco.Search class (via the "me" variable).
          */
         var me = this;
         
         /**
          * Thumbnail custom datacell formatter
          *
          * @method renderCellThumbnail
          * @param elCell {object}
          * @param oRecord {object}
          * @param oColumn {object}
          * @param oData {object|string}
          */
         renderCellThumbnail = function Search_renderCellThumbnail(elCell, oRecord, oColumn, oData)
         {
            oColumn.width = 100;
            oColumn.height = 100;
            Dom.setStyle(elCell.parentNode, "width", oColumn.width + "px");
            Dom.setStyle(elCell.parentNode, "height", oColumn.height + "px");
            Dom.setStyle(elCell.parentNode, "text-align", "center");
            
            var url = me._getBrowseUrlForRecord(oRecord);
            var imageUrl = Alfresco.constants.URL_CONTEXT + 'components/search/images/generic-result.png';
            
            // use the preview image for a document type
            switch (oRecord.getData("type"))
            {
               case "document":
                  imageUrl = Alfresco.constants.PROXY_URI + "api/node/" + oRecord.getData("nodeRef").replace(":/", "");
                  imageUrl += "/content/thumbnails/doclib?c=queue&ph=true";
                  break;
               
               case "folder":
                  imageUrl = Alfresco.constants.URL_CONTEXT + 'components/search/images/folder.png';
                  break;
               
               case "blogpost":
                  imageUrl = Alfresco.constants.URL_CONTEXT + 'components/search/images/blog-post.png';
                  break;
               
               case "forumpost":
                  imageUrl = Alfresco.constants.URL_CONTEXT + 'components/search/images/topic-post.png';
                  break;
               
               case "calendarevent":
                  imageUrl = Alfresco.constants.URL_CONTEXT + 'components/search/images/calendar-event.png';
                  break;
               
               case "wikipage":
                  imageUrl = Alfresco.constants.URL_CONTEXT + 'components/search/images/wiki-page.png';
                  break;
                  
               case "link":
                  imageUrl = Alfresco.constants.URL_CONTEXT + 'components/search/images/link.png';
                  break;
            }
            
            // Render the cell
            var name = oRecord.getData("displayName");
            var htmlName = $html(name);
            elCell.innerHTML = '<span><a href="' + encodeURI(url) + '"><img src="' + imageUrl + '" alt="' + htmlName + '" title="' + htmlName + '" /></a></span>';
         };

         /**
          * Description/detail custom datacell formatter
          *
          * @method renderCellDescription
          * @param elCell {object}
          * @param oRecord {object}
          * @param oColumn {object}
          * @param oData {object|string}
          */
         renderCellDescription = function Search_renderCellDescription(elCell, oRecord, oColumn, oData)
         {
            // apply styles
            Dom.setStyle(elCell.parentNode, "line-height", "1.5em");
            
            // we currently render all results the same way
            var site = oRecord.getData("site");
            var url = me._getBrowseUrlForRecord(oRecord);
            
            // title/link to view page
            var desc = '<h3 class="itemname"><a href="' + encodeURI(url) + '" class="theme-color-1">' + $html(oRecord.getData("displayName")) + '</a></h3>';
            // Metaversant Ratings
            desc += me.generateRatingsWidget(me, oRecord);


            // description (if any)
            var txt = oRecord.getData("description");
            if (txt !== undefined && txt !== "")
            {
               desc += '<div class="details">' + $html(txt) + '</div>';
            }
            
            // type information
            desc += '<div class="details">';
            var type = oRecord.getData("type");
            switch (type)
            {
               case "document":
               case "folder":
               case "blogpost":
               case "forumpost":
               case "calendarevent":
               case "wikipage":
               case "link":
                  desc += me._msg("label." + type);
                  break;

               default:
                  desc += me._msg("label.unknown");
                  break;
            }
            
            // link to the site and other meta-data details
            desc += ' ' + me._msg("message.insite");
            desc += ' <a href="' + Alfresco.constants.URL_PAGECONTEXT + 'site/' + $html(site.shortName) + '/dashboard">' + $html(site.title) + '</a>';
            if (oRecord.getData("size") !== -1)
            {
               desc += ' ' + me._msg("message.ofsize");
               desc += ' ' + Alfresco.util.formatFileSize(oRecord.getData("size"));
            }
            desc += ' ' + me._msg("message.modifiedby");
            desc += ' <a href="' + Alfresco.constants.URL_PAGECONTEXT + 'user/' + encodeURI(oRecord.getData("modifiedByUser")) + '/profile">' + $html(oRecord.getData("modifiedBy")) + '</a> ';
            desc += me._msg("message.modifiedon");
            desc += ' ' + Alfresco.util.formatDate(oRecord.getData("modifiedOn"));
            desc += '</div>';
            
            // tags (if any)
            var tags = oRecord.getData("tags");
            if (tags.length !== 0)
            {
               var i, j;
               desc += '<div class="details"><span class="tags">' + me._msg("message.tags") + ': ';
               for (i = 0, j = tags.length; i < j; i++)
               {
                   desc += '<span id="' + me.id + '-searchByTag-' + $html(tags[i]) + '"><a class="search-tag" href="#">' + $html(tags[i]) + '</a> </span>';
               }
               desc += '</span></div>';
            }
            
            elCell.innerHTML = desc;
         };

         // DataTable column defintions
         var columnDefinitions = [
         {
            key: "image", label: me._msg("message.preview"), sortable: false, formatter: renderCellThumbnail, width: 100
         },
         {
            key: "summary", label: me._msg("message.desc"), sortable: false, formatter: renderCellDescription
         }];

         // DataTable definition
         this.widgets.dataTable = new YAHOO.widget.DataTable(this.id + "-results", columnDefinitions, this.widgets.dataSource,
         {
            renderLoopSize: 32,
            initialLoad: false
         });

         // show initial message
         this._setDefaultDataTableErrors(this.widgets.dataTable);
         if (this.options.initialSearchTerm.length === 0 && this.options.initialSearchTag.length === 0)
         {
            this.widgets.dataTable.set("MSG_EMPTY", "");
         }
         
         // Override abstract function within DataTable to set custom error message
         this.widgets.dataTable.doBeforeLoadData = function Search_doBeforeLoadData(sRequest, oResponse, oPayload)
         {
            if (oResponse.error)
            {
               try
               {
                  var response = YAHOO.lang.JSON.parse(oResponse.responseText);
                  me.widgets.dataTable.set("MSG_ERROR", response.message);
               }
               catch(e)
               {
                  me._setDefaultDataTableErrors(me.widgets.dataTable);
               }
            }
            else if (oResponse.results)
            {
               // clear the empty error message
               me.widgets.dataTable.set("MSG_EMPTY", "");
               
               // update the results count, update hasMoreResults.
               me.hasMoreResults = (oResponse.results.length > me.options.maxSearchResults);
               if (me.hasMoreResults)
               {
                  oResponse.results = oResponse.results.slice(0, me.options.maxSearchResults);
               }
               me.resultsCount = oResponse.results.length;
               me.renderLoopSize = Alfresco.util.RENDERLOOPSIZE;
            }
            // Must return true to have the "Loading..." message replaced by the error message
            return true;
         };
      };
       
})();
