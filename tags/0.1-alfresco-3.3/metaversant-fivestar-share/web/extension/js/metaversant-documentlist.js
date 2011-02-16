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
    Alfresco.DocumentList.prototype.generateRatingsWidget = function DL_generateRatingsWidget(scope, record)
    {
        var id = scope.id + "_mrating_" + record.getData("nodeRef").replace("workspace://SpacesStore/", ""),
            type = record.getData("isFolder") ? "folder" : "document",
            isRateable = record.getData("custom").isRateable,
            rating = record.getData("custom").averageRating,
            ratingsCount = record.getData("custom").ratingsCount;

        if (type == 'document' && isRateable)
        {
            scope.widgets.dataTable.subscribe("renderEvent", mratings.onMetadataRefresh, id, mratings);
            // <div class="rating-count"><em>(' + ratingsCount + (ratingsCount == 1 ? ' rating' : ' ratings') + ')</em></div>
            return '<div class="detail"><span class="item"><div class="rating-label"><em>Rating:</em></div><div id="' + id + '" class="rating">' + rating + '</div></span></div>';            
        }
        else
        {
            return '';
        }
    };

    /**
     * Returns description/detail custom datacell formatter
     *
     * @method fnRenderCellDescription
     */
    Alfresco.DocumentList.prototype.fnRenderCellDescription = function DL_fnRenderCellDescription()
    {
         var scope = this;
         
         /**
          * Description/detail custom datacell formatter
          *
          * @method renderCellDescription
          * @param elCell {object}
          * @param oRecord {object}
          * @param oColumn {object}
          * @param oData {object|string}
          */
         return function DL_renderCellDescription(elCell, oRecord, oColumn, oData)
         {
            var desc = "", docDetailsUrl, tags, tag, i, j;
            var record = oRecord.getData(),
               type = record.type,
               isLink = record.isLink,
               locn = record.location,
               title = "",
               description = record.description || scope.msg("details.description.none");
            
            // Use title property if it's available
            if (record.title && record.title !== record.displayName)
            {
               title = '<span class="title">(' + $html(record.title) + ')</span>';
            }

            // Link handling
            if (isLink)
            {
               oRecord.setData("displayName", scope.msg("details.link-to", record.displayName));
            }
            
            if (type == "folder")
            {
               /**
                * Folders
                */
               desc += '<h3 class="filename">' + Alfresco.DocumentList.generateFavourite(scope, oRecord) + '<a href="#" class="filter-change" rel="' + Alfresco.DocumentList.generatePathMarkup(locn) + '">';
               desc += $html(record.displayName) + '</a>' + title + '</h3>';

               if (scope.options.simpleView)
               {
                  /**
                   * Simple View
                   */
                  desc += '<div class="detail"><span class="item-simple"><em>' + scope.msg("details.modified.on") + '</em> ' + Alfresco.util.formatDate(record.modifiedOn, "dd mmmm yyyy") + '</span>';
                  desc += '<span class="item-simple"><em>' + scope.msg("details.by") + '</em> <a href="' + Alfresco.DocumentList.generateUserProfileUrl(record.modifiedByUser) + '">' + $html(record.modifiedBy) + '</a></span></div>';
               }
               else
               {
                  /**
                   * Detailed View
                   */
                  desc += '<div class="detail"><span class="item"><em>' + scope.msg("details.modified.on") + '</em> ' + Alfresco.util.formatDate(record.modifiedOn) + '</span>';
                  desc += '<span class="item"><em>' + scope.msg("details.modified.by") + '</em> <a href="' + Alfresco.DocumentList.generateUserProfileUrl(record.modifiedByUser) + '">' + $html(record.modifiedBy) + '</a></span></div>';
                  desc += '<div class="detail"><span class="item"><em>' + scope.msg("details.description") + '</em> ' + $links($html(description)) + '</span></div>';
                  /* Tags */
                  tags = record.tags;
                  desc += '<div class="detail"><span class="item tag-item"><em>' + scope.msg("details.tags") + '</em> ';
                  if (tags.length > 0)
                  {
                     for (i = 0, j = tags.length; i < j; i++)
                     {
                        tag = $html(tags[i]);
                        desc += '<span class="tag"><a href="#" class="tag-link" rel="' + tag + '" title="' + tags[i] + '">' + tag + '</a></span>' + (j - i > 1 ? ", " : "");
                     }
                  }
                  else
                  {
                     desc += scope.msg("details.tags.none");
                  }
                  desc += '</span></div>';
               }
            }
            else
            {Alfresco.DocumentList
               /**
                * Documents and Links
                */
               docDetailsUrl = scope.getActionUrls(oRecord).documentDetailsUrl;

               // Locked / Working Copy handling
               if (record.lockedByUser && record.lockedByUser !== "")
               {
                  var lockedByLink = '<a href="' + Alfresco.DocumentList.generateUserProfileUrl(record.lockedByUser) + '">' + $html(record.lockedBy) + '</a>';

                  /* Google Docs Integration */
                  if (record.custom.googleDocUrl && record.custom.googleDocUrl !== "")
                  {
                     if (record.lockedByUser === Alfresco.constants.USERNAME)
                     {
                        desc += '<div class="info-banner">' + scope.msg("details.banner.google-docs-owner", '<a href="' + record.custom.googleDocUrl + '" target="_blank">' + scope.msg("details.banner.google-docs.link") + '</a>') + '</div>';
                     }
                     else
                     {
                        desc += '<div class="info-banner">' + scope.msg("details.banner.google-docs-locked", lockedByLink, '<a href="' + record.custom.googleDocUrl + '" target="_blank">' + scope.msg("details.banner.google-docs.link") + '</a>') + '</div>';
                     }
                  }
                  /* Regular Working Copy handling */
                  else
                  {
                     if (record.lockedByUser === Alfresco.constants.USERNAME)
                     {
                        desc += '<div class="info-banner">' + scope.msg("details.banner." + (record.actionSet === "lockOwner" ? "lock-owner" : "editing")) + '</div>';
                     }
                     else
                     {
                        desc += '<div class="info-banner">' + scope.msg("details.banner.locked", lockedByLink) + '</div>';
                     }
                  }
               }
                
               desc += '<h3 class="filename">' + Alfresco.DocumentList.generateFavourite(scope, oRecord) + '<span id="' + scope.id + '-preview-' + oRecord.getId() + '"><a href="' + docDetailsUrl + '">';
               desc += $html(record.displayName) + '</a></span>' + title + '</h3>';

               // Metaversant Ratings
               desc += scope.generateRatingsWidget(scope, oRecord);

               if (scope.options.simpleView)
               {
                  /**
                   * Simple View
                   */
                  desc += '<div class="detail"><span class="item-simple"><em>' + scope.msg("details.modified.on") + '</em> ' + Alfresco.util.formatDate(record.modifiedOn, "dd mmmm yyyy") + '</span>';
                  desc += '<span class="item-simple"><em>' + scope.msg("details.by") + '</em> <a href="' + Alfresco.DocumentList.generateUserProfileUrl(record.modifiedByUser) + '">' + $html(record.modifiedBy) + '</a></span></div>';
               }
               else
               {
                  /**
                   * Detailed View
                   */
                  if (record.custom && record.custom.isWorkingCopy)
                  {
                     /**
                      * Working Copy
                      */
                     desc += '<div class="detail">';
                     desc += '<span class="item"><em>' + scope.msg("details.editing-started.on") + '</em> ' + Alfresco.util.formatDate(record.modifiedOn) + '</span>';
                     desc += '<span class="item"><em>' + scope.msg("details.editing-started.by") + '</em> <a href="' + Alfresco.DocumentList.generateUserProfileUrl(record.modifiedByUser) + '">' + $html(record.modifiedBy) + '</a></span>';
                     desc += '<span class="item"><em>' + scope.msg("details.size") + '</em> ' + Alfresco.util.formatFileSize(record.size) + '</span>';
                     desc += '</div><div class="detail">';
                     desc += '<span class="item"><em>' + scope.msg("details.description") + '</em> ' + $links($html(description)) + '</span>';
                     desc += '</div>';
                  }
                  else
                  {
                     /**
                      * Non-Working Copy
                      */
                     desc += '<div class="detail">';
                     desc += '<span class="item"><em>' + scope.msg("details.modified.on") + '</em> ' + Alfresco.util.formatDate(record.modifiedOn) + '</span>';
                     desc += '<span class="item"><em>' + scope.msg("details.modified.by") + '</em> <a href="' + Alfresco.DocumentList.generateUserProfileUrl(record.modifiedByUser) + '">' + $html(record.modifiedBy) + '</a></span>';
                     desc += '<span class="item"><em>' + scope.msg("details.version") + '</em> ' + record.version + '</span>';
                     desc += '<span class="item"><em>' + scope.msg("details.size") + '</em> ' + Alfresco.util.formatFileSize(record.size) + '</span>';
                     desc += '</div><div class="detail">';
                     desc += '<span class="item"><em>' + scope.msg("details.description") + '</em> ' + $links($html(description)) + '</span>';
                     desc += '</div>';

                     /* Tags */
                     tags = record.tags;
                     desc += '<div class="detail"><span class="item tag-item"><em>' + scope.msg("details.tags") + '</em> ';
                     if (tags.length > 0)
                     {
                        for (i = 0, j = tags.length; i < j; i++)
                        {
                           tag = $html(tags[i]);
                           desc += '<span class="tag"><a href="#" class="tag-link" rel="' + tag + '" title="' + tags[i] + '">' + tag + '</a></span>' + (j - i > 1 ? ", " : "");
                        }
                     }
                     else
                     {
                        desc += scope.msg("details.tags.none");
                     }
                     desc += '</span></div>';
                  } // end if record
               } // end if scope
            } // end if type is folder
            elCell.innerHTML = desc;
         };  // return render cell desc
    };
        
})();
