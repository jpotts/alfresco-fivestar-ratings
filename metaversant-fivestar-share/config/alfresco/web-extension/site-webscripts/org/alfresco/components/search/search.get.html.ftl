<script type="text/javascript">//<![CDATA[
   new Alfresco.Search("${args.htmlid}").setOptions(
   {
      siteId: "${siteId}",
      siteName: "${siteName?js_string}",
      initialSearchTerm: "${searchTerm?js_string}",
      initialSearchTag: "${searchTag?js_string}",
      initialSearchAll: "${searchAll?string}",
      minSearchTermLength: ${args.minSearchTermLength!config.scoped['Search']['search'].getChildValue('min-search-term-length')},
      maxSearchResults: ${args.maxSearchResults!config.scoped['Search']['search'].getChildValue('max-search-results')}
   }).setMessages(
      ${messages}
   );
//]]></script>
<script type="text/javascript">//<![CDATA[
	var mratings = new Metaversant.Ratings("${args.htmlid}_mrating").setOptions({
		targetUrl: "${url.context}/proxy/alfresco/api/node/workspace/SpacesStore/{id}/mratings"
	});
//]]></script>
<div id="${args.htmlid}-body" class="search">
   <div class="resultbar theme-bg-color-3">
      <span id="${args.htmlid}-search-info">
         ${msg("search.info.searching")}
      </span>
      
      <span id="${args.htmlid}-scope-toggle-container" class="hidden">
      (
         <a href="#" id="${args.htmlid}-scope-toggle-link" class="search-scope-toggle"></a>
      )
      </span>
   </div>
   
   <div id="${args.htmlid}-results" class="results"></div>
</div>