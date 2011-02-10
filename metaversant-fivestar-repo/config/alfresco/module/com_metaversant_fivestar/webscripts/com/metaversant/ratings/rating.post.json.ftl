<#escape x as jsonUtils.encodeJSONString(x)>
{"data" : 
        {
         "nodeRef" : "${nodeRef}",
         "rating" : "${rating}",
         "user" : "${user}",
		 "ratingScheme": "${schemeName!""}"		 
        }
}
</#escape>