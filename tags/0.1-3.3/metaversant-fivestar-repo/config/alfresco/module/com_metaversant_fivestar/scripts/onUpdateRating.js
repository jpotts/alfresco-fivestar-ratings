<import resource="classpath:alfresco/module/com_metaversant_fivestar/scripts/rating.js">
/**
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
*/
var scriptFailed = false;

// Have a look at the behaviour object that should have been passed
if (behaviour == null) {
    logger.log("The behaviour object has not been set.");
    scriptFailed = true;
}

// Check the name of the behaviour
if (behaviour.name == null && behaviour.name != "onUpdateNode") {
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
    if (behaviour.args.length == 1) {
        var childAssoc = behaviour.args[0];
        logger.log("Calling compute average");
        computeAverage(childAssoc);
    } else {
        logger.log("The number of arguments is incorrect.");
        scriptFailed = true;
    }
}        