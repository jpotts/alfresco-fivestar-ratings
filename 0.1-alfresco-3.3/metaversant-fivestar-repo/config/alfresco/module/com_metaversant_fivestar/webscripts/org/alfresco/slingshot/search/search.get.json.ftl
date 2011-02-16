<#macro dateFormat date>${date?string("dd MMM yyyy HH:mm:ss 'GMT'Z '('zzz')'")}</#macro>
<#escape x as jsonUtils.encodeJSONString(x)>
{
	"items":
	[
		<#list data.items as item>
		{
			"nodeRef": "${item.nodeRef}",
			"type": "${item.type}",
			"name": "${item.name!''}",
			"displayName": "${item.displayName!''}",
			"description": "${item.description!''}",
			"modifiedOn": "<@dateFormat item.modifiedOn />",
			"modifiedByUser": "${item.modifiedByUser}",
			"modifiedBy": "${item.modifiedBy}",
			"size": ${item.size?c},
			"tags": [<#list item.tags as tag>"${tag}"<#if tag_has_next>,</#if></#list>],
			<#if item.browseUrl??>
			"browseUrl": "${item.browseUrl}",
			</#if>
			<#if item.custom??>"custom": <#noescape>${item.custom}</#noescape>,</#if>
			"site":
			{
				"shortName": "${item.site.shortName}",
				"title": "${item.site.title}"
			},
			"container": "${item.container}"
		}<#if item_has_next>,</#if>
		</#list>
	]
}
</#escape>