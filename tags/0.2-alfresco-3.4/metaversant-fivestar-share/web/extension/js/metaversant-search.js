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
            Dom.setStyle(elCell, "height", oColumn.height + "px");
            Dom.addClass(elCell, "thumbnail-cell");
            
            var url = me._getBrowseUrlForRecord(oRecord);
            var imageUrl = Alfresco.constants.URL_RESCONTEXT + 'components/search/images/generic-result.png';
            
            // use the preview image for a document type
            var dataType = oRecord.getData("type");
            switch (dataType)
            {
                case "document":
                    imageUrl = Alfresco.constants.PROXY_URI_RELATIVE + "api/node/" + oRecord.getData("nodeRef").replace(":/", "");
                    imageUrl += "/content/thumbnails/doclib?c=queue&ph=true";
                    break;
               
                case "folder":
                    imageUrl = Alfresco.constants.URL_RESCONTEXT + 'components/search/images/folder.png';
                    break;
               
                case "blogpost":
                    imageUrl = Alfresco.constants.URL_RESCONTEXT + 'components/search/images/blog-post.png';
                    break;
               
                case "forumpost":
                    imageUrl = Alfresco.constants.URL_RESCONTEXT + 'components/search/images/topic-post.png';
                    break;
               
                case "calendarevent":
                    imageUrl = Alfresco.constants.URL_RESCONTEXT + 'components/search/images/calendar-event.png';
                    break;
               
                case "wikipage":
                    imageUrl = Alfresco.constants.URL_RESCONTEXT + 'components/search/images/wiki-page.png';
                    break;
                  
                case "link":
                    imageUrl = Alfresco.constants.URL_RESCONTEXT + 'components/search/images/link.png';
                    break;
               
                case "datalist":
                    imageUrl = Alfresco.constants.URL_RESCONTEXT + 'components/search/images/datalist.png';
                    break;
               
                case "datalistitem":
                    imageUrl = Alfresco.constants.URL_RESCONTEXT + 'components/search/images/datalistitem.png';
                    break;
            }
            
            // Render the cell
            var name = oRecord.getData("displayName");
            var htmlName = $html(name);
            var html = '<span><a href="' + url + '"><img src="' + imageUrl + '" alt="' + htmlName + '" title="' + htmlName + '" /></a></span>';
            if (dataType === "document")
            {
                var viewUrl = Alfresco.constants.PROXY_URI_RELATIVE + "api/node/content/" + oRecord.getData("nodeRef").replace(":/", "") + "/" + oRecord.getData("name");
                html = '<div class="action-overlay">' + 
                      '<a href="' + encodeURI(viewUrl) + '" target="_blank"><img title="' + $html(me.msg("label.viewinbrowser")) +
                      '" src="' + Alfresco.constants.URL_RESCONTEXT + 'components/documentlibrary/images/view-in-browser-16.png" width="16" height="16"/></a>' +
                      '<a href="' + encodeURI(viewUrl + "?a=true") + '" style="padding-left:4px" target="_blank"><img title="' + $html(me.msg("label.download")) +
                      '" src="' + Alfresco.constants.URL_RESCONTEXT + 'components/documentlibrary/images/download-16.png" width="16" height="16"/></a>' + 
                      '</div>' + html;
            }
            elCell.innerHTML = html;
        };

        /**
         * Description/detail custom cell formatter
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
            
            // site and repository items render with different information available
            var site = oRecord.getData("site");
            var url = me._getBrowseUrlForRecord(oRecord);
            
            // displayname and link to details page
            var displayName = oRecord.getData("displayName");
            var desc = '<h3 class="itemname"><a href="' + url + '" class="theme-color-1">' + $html(displayName) + '</a>';
            // add title (if any) to displayname area
            var title = oRecord.getData("title");
            if (title && title !== displayName)
            {
                desc += '<span class="title">(' + $html(title) + ')</span>';
            }
            desc += '</h3>';

	    // Metaversant Ratings
            desc += me.generateRatingsWidget(me, oRecord);
            
            // description (if any)
            var txt = oRecord.getData("description");
            if (txt)
            {
                desc += '<div class="details meta">' + $html(txt) + '</div>';
            }
            
            // detailed information, includes site etc. type specific
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
                case "datalist":
                case "datalistitem":
                case "link":
                    desc += me.msg("label." + type);
                    break;
               
                default:
                    desc += me.msg("label.unknown");
                    break;
            }
            
            // link to the site and other meta-data details
            if (site)
            {
                desc += ' ' + me.msg("message.insite");
                desc += ' <a href="' + Alfresco.constants.URL_PAGECONTEXT + 'site/' + $html(site.shortName) + '/dashboard">' + $html(site.title) + '</a>';
            }
            if (oRecord.getData("size") !== -1)
            {
                desc += ' ' + me.msg("message.ofsize");
                desc += ' <span class="meta">' + Alfresco.util.formatFileSize(oRecord.getData("size")) + '</span>';
            }
            if (oRecord.getData("modifiedBy"))
            {
                desc += ' ' + me.msg("message.modifiedby");
                desc += ' <a href="' + Alfresco.constants.URL_PAGECONTEXT + 'user/' + encodeURI(oRecord.getData("modifiedByUser")) + '/profile">' + $html(oRecord.getData("modifiedBy")) + '</a>';
            }
            desc += ' ' + me.msg("message.modifiedon") + ' <span class="meta">' + Alfresco.util.formatDate(oRecord.getData("modifiedOn")) + '</span>';
            desc += '</div>';
            
            // folder path (if any)
            if (type === "document" || type === "folder")
            {
                var path = oRecord.getData("path");
                if (site)
                {
                    if (path === null || path === undefined)
                    {
                        path = "";
                    }
                    desc += '<div class="details">' + me.msg("message.infolderpath") +
                          ': <a href="' + me._getBrowseUrlForFolderPath(path, site) + '">' + $html('/' + path) + '</a></div>';
                }
                else
                {
                    if (path)
                    {
                        desc += '<div class="details">' + me.msg("message.infolderpath") +
                          ': <a href="' + me._getBrowseUrlForFolderPath(path) + '">' + $html(path) + '</a></div>';
                    }
                }
            }
            
            // tags (if any)
            var tags = oRecord.getData("tags");
            if (tags.length !== 0)
            {
                var i, j;
                desc += '<div class="details"><span class="tags">' + me.msg("label.tags") + ': ';
                for (i = 0, j = tags.length; i < j; i++)
                {
                    desc += '<span id="' + me.id + '-' + $html(tags[i]) + '" class="searchByTag"><a class="search-tag" href="#">' + $html(tags[i]) + '</a> </span>';
                }
                desc += '</span></div>';
            }
            
            elCell.innerHTML = desc;
        };

        // DataTable column defintions
        var columnDefinitions = [
        {
            key: "image", label: me.msg("message.preview"), sortable: false, formatter: renderCellThumbnail, width: 100
        },
        {
            key: "summary", label: me.msg("label.description"), sortable: false, formatter: renderCellDescription
        }];

        // DataTable definition
        this.widgets.dataTable = new YAHOO.widget.DataTable(this.id + "-results", columnDefinitions, this.widgets.dataSource,
        {
            renderLoopSize: Alfresco.util.RENDERLOOPSIZE,
            initialLoad: false,
            paginator: this.widgets.paginator,
            MSG_LOADING: ""
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
               
                if (me.resultsCount > me.options.pageSize)
                {
                    Dom.removeClass(me.id + "-paginator-top", "hidden");
                    Dom.removeClass(me.id + "-search-bar-bottom", "hidden");
                }
            }
            // Must return true to have the "Loading..." message replaced by the error message
            return true;
        };
         
        // Rendering complete event handler
        me.widgets.dataTable.subscribe("renderEvent", function()
        {
            // Update the paginator
            me.widgets.paginator.setState(
            {
                page: me.currentPage,
                totalRecords: me.resultsCount
            });
            me.widgets.paginator.render();
        });
    };
       
})();
