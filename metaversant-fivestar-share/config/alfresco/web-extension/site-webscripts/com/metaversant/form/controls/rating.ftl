<script>
	var mratings = new Metaversant.Ratings('${fieldHtmlId}').setOptions({
		targetUrl: "${url.context}/proxy/alfresco/api/node/workspace/SpacesStore/{id}/mratings",
		fireMetadataRefresh: true
	});
</script>
<div class="form-field">
   <#if form.mode == "view">
      <div class="viewmode-field">
         <span class="viewmode-label">${field.label?html}:</span>
         <span class="viewmode-value"><div id="${fieldHtmlId}_${form.arguments.itemId?replace('workspace://SpacesStore/','')}" class="rating"><#if field.value?string == ''>0<#else>${field.value}</#if></div></span>
      </div>
   <#else>
      <label for="${fieldHtmlId}">${field.label?html}:<#if field.mandatory><span class="mandatory-indicator">${msg("form.required.fields.marker")}</span></#if></label>
      <input id="${fieldHtmlId}" type="text" name="${field.name}" tabindex="0"
             class="number<#if field.control.params.styleClass?exists> ${field.control.params.styleClass}</#if>"
             <#if field.value?is_number>value="${field.value?c}"<#else>value="${field.value?html}"</#if>
             <#if field.description?exists>title="${field.description}"</#if>
             <#if field.control.params.maxLength?exists>maxlength="${field.control.params.maxLength}"</#if> 
             <#if field.control.params.size?exists>size="${field.control.params.size}"</#if> 
             <#if field.disabled>disabled="true"</#if> />
      <@formLib.renderFieldHelp field=field />	  
   </#if>
</div>