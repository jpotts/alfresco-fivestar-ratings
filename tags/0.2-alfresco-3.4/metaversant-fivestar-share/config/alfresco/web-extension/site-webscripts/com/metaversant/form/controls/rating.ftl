<#comment>
   Copyright 2011, Jeff Potts

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
</#comment>
<#comment>
Major hack alert: In 3.4 Enterprise, the field HTML ID changes when a metadata
refresh happens which causes a problem for the client-side JavaScript ratings
component. So, I'm stripping out the change to keep the field ID consistent.
</#comment>
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