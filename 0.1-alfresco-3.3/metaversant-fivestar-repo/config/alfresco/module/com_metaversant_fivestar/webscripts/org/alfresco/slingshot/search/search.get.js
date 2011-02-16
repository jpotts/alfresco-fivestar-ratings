<import resource="classpath:/alfresco/extension/templates/webscripts/org/alfresco/slingshot/search/search.lib.js">
function main()
{
   var siteId = (args.site !== undefined) ? args.site : null;
   var containerId = (args.container !== undefined) ? args.container : null;
   var term = (args.term !== undefined) ? args.term : null;
   var tag = (args.tag !== undefined) ? args.tag : null;
   var maxResults = (args.maxResults !== undefined) ? parseInt(args.maxResults, 10) : DEFAULT_MAX_RESULTS;
   
   model.data = getSearchResults(term, tag, maxResults, siteId, containerId);
}

main();