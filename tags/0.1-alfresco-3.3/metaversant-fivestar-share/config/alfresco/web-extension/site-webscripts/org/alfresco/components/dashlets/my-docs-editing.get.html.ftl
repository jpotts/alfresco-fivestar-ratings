<script type="text/javascript">//<![CDATA[
	var mde_mratings = new Metaversant.Ratings('${args.htmlid}_mde_mrating').setOptions({
		targetUrl: "${url.context}/proxy/alfresco/api/node/workspace/SpacesStore/{id}/mratings"
	});
//]]></script>
<#macro doclibUrl doc>
   <a href="${url.context}/page/site/${doc.location.site}/documentlibrary?file=${doc.fileName?url}&amp;filter=editingMe" class="theme-color-1">${doc.displayName?html}</a>
</#macro>

<#-- Render no items text -->
<#macro renderNoItems>
   <div class="detail-list-item first-item">
      <span>${msg("label.noItems")}</span>
   </div>
</#macro>
<#macro renderItems contents icon>
   <#assign items=contents.items />
   <#list items?sort_by("modifiedOn") as doc>
   <#assign modifiedBy><a href="${url.context}/page/user/${doc.modifiedByUser?url}/profile">${doc.modifiedBy?html}</a></#assign>
   <div class="detail-list-item <#if doc_index = 0>first-item</#if>">
      <div>
         <div class="icon">
            <img src="${url.context}${icon}" alt="${doc.displayName?html}" />
         </div>
         <div class="details">
            <h4><a href="${url.context}/page/site/${doc.site.shortName}/${doc.browseUrl}" class="theme-color-1">${doc.displayName?html}</a></h4>
            <div>
               ${msg("text.edited-on", doc.modifiedOn?datetime("dd MMM yyyy HH:mm:ss 'GMT'Z '('zzz')'")?string("dd MMM, yyyy HH:mm"), doc.site.title)?html}
            </div>
         </div>
      </div>
   </div>
   </#list>
</#macro>
<script type="text/javascript">//<![CDATA[
   new Alfresco.widget.DashletResizer("${args.htmlid}", "${instance.object.id}");
//]]></script>
<div class="dashlet" id="myEditingDocsDashlet">
   <div class="title">${msg("header")}</div>
   <div class="body scrollableList" <#if args.height??>style="height: ${args.height}px;"</#if>>
   <#if documents.error?exists>
      <div class="detail-list-item first-item last-item">
         <span class="error">${msg(documents.message)}</span>
      </div>
   <#else>
      <div class="hdr">
         <h3>${msg('text.documents')}</h3>
      </div>
      <#if documents.items?size != 0>
      <#list documents.items?sort_by("modifiedOn") as doc>
      <#assign modifiedBy><a href="${url.context}/page/user/${doc.modifiedByUser?url}/profile">${doc.modifiedBy?html}</a></#assign>
      <div class="detail-list-item <#if doc_index = 0>first-item</#if>">
         <div>
            <div class="icon">
               <img src="${url.context}/components/images/generic-file-32.png" alt="${doc.displayName?html}" />
            </div>
            <div class="details">
               <h4><@doclibUrl doc /></h4>
               <#if doc.custom?has_content && doc.custom.averageRating?exists>
	     	       <div class="rating-label">Rating:</div><div id="${args.htmlid}_mde_mrating_${doc.nodeRef?replace("workspace://SpacesStore/", "")}" class="rating">${doc.custom.averageRating}</div>
		       </#if>
               <div <#if doc.custom?has_content && doc.custom.averageRating?exists>style="clear: left;"</#if>>
                  ${msg("text.editing-since", doc.modifiedOn?datetime("dd MMM yyyy HH:mm:ss 'GMT'Z '('zzz')'")?string("dd MMM, yyyy HH:mm"), doc.location.siteTitle)?html}
               </div>
            </div>
         </div>
      </div>
      </#list>
      <#else>
         <@renderNoItems />
      </#if>
   </#if>
   <#if content.error?exists>
      <div class="detail-list-item first-item last-item">
         <span class="error">${msg(content.message?html)}</span>
      </div>
   <#else>
      <div class="hdr">
         <h3>${msg('text.blogposts')}</h3>
      </div>
      <#if content.blogPosts.items?size != 0>
         <@renderItems content.blogPosts '/components/images/blogpost-32.png' />
      <#else>
         <@renderNoItems />
      </#if>
      <div class="hdr">
         <h3>${msg('text.wikipages')}</h3>
      </div>
      <#if content.wikiPages.items?size != 0>
         <@renderItems content.wikiPages '/components/images/wikipage-32.png' />
      <#else>
         <@renderNoItems />
      </#if>
      <div class="hdr">
         <h3>${msg('text.forumposts')}</h3>
      </div>
      <#if content.forumPosts.items?size != 0>
         <@renderItems content.forumPosts '/components/images/topicpost-32.png' />
      <#else>
         <@renderNoItems />
      </#if>
   </#if>
   </div>
</div>