/**
 * Metaversant five star ratings component
 * 
 * @namespace Metaversant
 * @class Metaversant.DocumentList
 */
(function()
{
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
    Alfresco.dashlet.MyDocuments.prototype.generateRatingsWidget = function MyDocuments_generateRatingsWidget(scope, record)
    {
        var id = scope.id + "_md_mrating_" + record.getData("nodeRef").replace("workspace://SpacesStore/", ""),
            type = record.getData("isFolder") ? "folder" : "document",
            isRateable = record.getData("custom").isRateable,
            rating = record.getData("custom").averageRating,
            ratingsCount = record.getData("custom").ratingsCount;

        if (type == 'document' && isRateable)
        {
            scope.widgets.dataTable.subscribe("renderEvent", md_mratings.onMetadataRefresh, id, md_mratings);
            return '<div class="detail"><div id="' + id + '" class="rating">' + rating + '</div></div><div style="clear: left;"></div>';            
        }
        else
        {
            return '';
        }
    };
    
    /**
     * Fired by YUI when parent element is available for scripting
     * @method onReady
     */
    Alfresco.dashlet.MyDocuments.prototype.onReady = function MyDocuments_onReady()
    {
         var me = this;
         
         // Filter buttons
         this.widgets.filterGroup = new YAHOO.widget.ButtonGroup(this.id + "-filters");
         this.widgets.filterGroup.on("checkedButtonChange", this.onFilterChange, this.widgets.filterGroup, this);

         // Preferences service
         this.services.preferences = new Alfresco.service.Preferences();

         // Tooltip for thumbnail on mouse hover
         this.widgets.previewTooltip = new YAHOO.widget.Tooltip(this.id + "-previewTooltip",
         {
            width: "108px"
         });
         this.widgets.previewTooltip.contextTriggerEvent.subscribe(function(type, args)
         {
            var context = args[0],
               record = me.widgets.dataTable.getRecord(context.id),
               thumbnailUrl = Alfresco.constants.PROXY_URI + "api/node/" + record.getData("nodeRef").replace(":/", "") + "/content/thumbnails/doclib?c=queue&ph=true";
            
            this.cfg.setProperty("text", '<img src="' + thumbnailUrl + '" />');
         });

         // Tooltip for metadata on mouse hover
         this.widgets.metadataTooltip = new YAHOO.widget.Tooltip(this.id + "-metadataTooltip");
         this.widgets.metadataTooltip.contextTriggerEvent.subscribe(function(type, args)
         {
            var context = args[0],
               record = me.widgets.dataTable.getRecord(context.id),
               locn = record.getData("location");
            
            var text = '<em>' + me.msg("label.site") + ':</em> ' + $html(locn.siteTitle) + '<br />';
            text += '<em>' + me.msg("label.path") + ':</em> ' + $html(locn.path);
            
            this.cfg.setProperty("text", text);
         });

         // DataSource definition
         var uriDocList = Alfresco.constants.PROXY_URI + "slingshot/doclib/doclist/documents/node/alfresco/sites/home?max=50&filter=";
         // Metaversant Ratings adds "custom" to this list
         this.widgets.dataSource = new YAHOO.util.DataSource(uriDocList,
         {
            responseType: YAHOO.util.DataSource.TYPE_JSON,
            responseSchema:
            {
               resultsList: "items",
               fields:
               [
                  "index", "nodeRef", "type", "isLink", "mimetype", "fileName", "displayName", "status", "lockedBy", "lockedByUser", "title", "description",
                  "createdOn", "createdBy", "createdByUser", "modifiedOn", "modifiedBy", "modifiedByUser", "version", "size", "contentUrl", "actionSet", "tags",
                  "activeWorkflows", "isFavourite", "location", "permissions", "onlineEditUrl", "custom"
               ],
               metaFields:
               {
                  paginationRecordOffset: "startIndex",
                  totalRecords: "totalRecords"
               }
            }
         });

         /**
          * Favourite Documents custom datacell formatter
          */
         var favEventClass = Alfresco.util.generateDomId(null, "fav-doc");
         var renderCellFavourite = function MD_renderCellFavourite(elCell, oRecord, oColumn, oData)
         {
            var nodeRef = oRecord.getData("nodeRef"),
               isFavourite = oRecord.getData("isFavourite");

            Dom.setStyle(elCell, "width", oColumn.width + "px");
            Dom.setStyle(elCell.parentNode, "width", oColumn.width + "px");

            elCell.innerHTML = '<a class="favourite-document ' + favEventClass + (isFavourite ? ' enabled' : '') + '" title="' + me.msg("tip.favourite-document." + (isFavourite ? 'remove' : 'add')) + '">&nbsp;</a>';
         };

         /**
          * Thumbnail custom datacell formatter
          */
         var renderCellThumbnail = function MD_renderCellThumbnail(elCell, oRecord, oColumn, oData)
         {
            var name = oRecord.getData("fileName"),
               title = oRecord.getData("title"),
               type = oRecord.getData("type"),
               locn = oRecord.getData("location"),
               extn = name.substring(name.lastIndexOf("."));

            Dom.setStyle(elCell, "width", oColumn.width + "px");
            Dom.setStyle(elCell.parentNode, "width", oColumn.width + "px");

            var id = me.id + '-preview-' + oRecord.getId(),
               docDetailsUrl = Alfresco.constants.URL_PAGECONTEXT + "site/" + locn.site + "/document-details?nodeRef=" + oRecord.getData("nodeRef");
            
            elCell.innerHTML = '<span id="' + id + '" class="icon32"><a href="' + docDetailsUrl + '"><img src="' + Alfresco.constants.URL_CONTEXT + 'components/images/filetypes/' + Alfresco.util.getFileIcon(name) + '" alt="' + extn + '" title="' + $html(title) + '" /></a></span>';
                  
            // Preview tooltip
            me.previewTooltips.push(id);
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
         var renderCellDescription = function MD_renderCellDescription(elCell, oRecord, oColumn, oData)
         {
            var type = oRecord.getData("type"),
               locn = oRecord.getData("location");
            
            var id = me.id + '-metadata-' + oRecord.getId(),
               docDetailsUrl = Alfresco.constants.URL_PAGECONTEXT + "site/" + locn.site + "/document-details?nodeRef=" + oRecord.getData("nodeRef");
            
            // Metaversant Ratings adds an enclosing div, below
            var desc = '<div style="float: left;"><span id="' + id + '"><a class="theme-color-1" href="' + docDetailsUrl + '">' + $html(oRecord.getData("displayName")) + '</a></span></div>';

            // Metaversant Ratings
            desc += me.generateRatingsWidget(me, oRecord);

            desc += '<div class="detail">' + $links($html(oRecord.getData("description"))) + '</div>';

            elCell.innerHTML = desc;

            // Metadata tooltip
            me.metadataTooltips.push(id);
         };

         // DataTable column defintions
         var columnDefinitions =
         [
            { key: "favourite", label: "Favourite", sortable: false, formatter: renderCellFavourite, width: 16 },
            { key: "thumbnail", label: "Thumbnail", sortable: false, formatter: renderCellThumbnail, width: 32 },
            { key: "description", label: "Description", sortable: false, formatter: renderCellDescription }
         ];

         // DataTable definition
         this.widgets.dataTable = new YAHOO.widget.DataTable(this.id + "-documents", columnDefinitions, this.widgets.dataSource,
         {
            initialLoad: true,
            initialRequest: this.currentFilter,
            dynamicData: true,
            MSG_EMPTY: this.msg("label.loading")
         });

         // Add animation to row delete
         this.widgets.dataTable._deleteTrEl = function(row)
         { 
            var scope = this,
               trEl = this.getTrEl(row);

            var changeColor = new YAHOO.util.ColorAnim(trEl,
            {
               opacity:
               {
                  to: 0
               }
            }, 0.25);
            changeColor.onComplete.subscribe(function()
            {
               YAHOO.widget.DataTable.prototype._deleteTrEl.call(scope, row);
            });
            changeColor.animate();
         };
         
         // Override abstract function within DataTable to set custom error message
         this.widgets.dataTable.doBeforeLoadData = function MD_doBeforeLoadData(sRequest, oResponse, oPayload)
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
                  me.widgets.dataTable.set("MSG_EMPTY", this.msg("label.empty"));
                  me.widgets.dataTable.set("MSG_ERROR", this.msg("label.error"));
               }
            }
            
            // We don't get an renderEvent for an empty recordSet, but we'd like one anyway
            if (oResponse.results.length === 0)
            {
               this.fireEvent("renderEvent",
               {
                  type: "renderEvent"
               });
            }
            
            // Must return true to have the "Loading..." message replaced by the error message
            return true;
         };

         // Rendering complete event handler
         this.widgets.dataTable.subscribe("renderEvent", function()
         {
            // Register tooltip contexts
            this.widgets.previewTooltip.cfg.setProperty("context", this.previewTooltips);
            this.widgets.metadataTooltip.cfg.setProperty("context", this.metadataTooltips);
            
            this.widgets.dataTable.set("MSG_EMPTY", this.msg("label.empty"));
         }, this, true);
         
         // Hook favourite document events
         var fnFavouriteHandler = function MD_fnFavouriteHandler(layer, args)
         {
            var owner = YAHOO.Bubbling.getOwnerByTagName(args[1].anchor, "div");
            if (owner !== null)
            {
               me.onFavouriteDocument.call(me, args[1].target.offsetParent, owner);
            }
      		 
            return true;
         };
         YAHOO.Bubbling.addDefaultAction(favEventClass, fnFavouriteHandler);
    };

})();    