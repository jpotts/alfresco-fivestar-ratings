<import resource="classpath:alfresco/module/com_metaversant_fivestar/scripts/rating.js">
var scriptFailed = false;

// Have a look at the behaviour object that should have been passed
if (behaviour == null) {
    logger.log("The behaviour object has not been set.");
    scriptFailed = true;
}

// Check the name of the behaviour
if (behaviour.name == null && behaviour.name != "onDeleteNode") {
    logger.log("The behaviour name has not been set correctly.");
    scriptFailed = true;
} else {
    logger.log("Behaviour name: " + behaviour.name);
}

// Check the arguments
if (behaviour.args == null) {
    logger.log("The args have not been set.");
    scriptFailed = true;
} else {
    if (behaviour.args.length == 2) {
        var childAssoc = behaviour.args[0];
        logger.log("Calling compute average");
        computeAverage(childAssoc);        
    } else {
        logger.log("The number of arguments is incorrect.");
        scriptFailed = true;
    }
}        