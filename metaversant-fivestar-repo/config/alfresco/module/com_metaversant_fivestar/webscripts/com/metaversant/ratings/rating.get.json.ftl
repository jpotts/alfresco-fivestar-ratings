<#macro dateFormat date>${date?string("dd MMM yyyy HH:mm:ss 'GMT'Z '('zzz')'")}</#macro>
<#escape x as jsonUtils.encodeJSONString(x)>
{
   "data":
   {
      "nodeRef": "${nodeRef}",
      "ratings":
      [
         <#list ratings as rating>
         {
            "ratingScheme": "${schemeName!""}",
            "rating": ${rating.score?c},
            "appliedBy": "${rating.user!""}"
         }<#if rating_has_next>,</#if>
         </#list>
      ],
      "nodeStatistics":
      {
         "${schemeName!""}":
         {
            "averageRating": ${rating.average?c},
            "ratingsCount": ${rating.count?c}
         }
      }
   }
}
</#escape>