<#include "include/documentlist.lib.ftl" />
<@documentlistTemplate>
<script type="text/javascript">//<![CDATA[
   new Alfresco.DocumentList("${args.htmlid}").setOptions(
   {
      <#if repositoryUrl??>repositoryUrl: "${repositoryUrl}",</#if>
      siteId: "${page.url.templateArgs.site!""}",
      containerId: "${template.properties.container!"documentLibrary"}",
      usePagination: ${(args.pagination!false)?string},
      showFolders: ${(preferences.showFolders!false)?string},
      simpleView: ${(preferences.simpleView!false)?string},
      highlightFile: "${(page.url.args["file"]!"")?js_string}",
      vtiServer: ${vtiServer}
   }).setMessages(
      ${messages}
   );
//]]></script>
<script type="text/javascript">//<![CDATA[
	var mratings = new Metaversant.Ratings("${args.htmlid}_mrating").setOptions({
		targetUrl: "${url.context}/proxy/alfresco/api/node/workspace/SpacesStore/{id}/mratings",
		readOnly: false
	});
//]]></script>
</@>