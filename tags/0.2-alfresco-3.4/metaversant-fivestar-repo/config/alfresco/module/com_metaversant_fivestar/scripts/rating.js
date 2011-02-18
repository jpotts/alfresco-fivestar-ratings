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

/**
	This function is used by the JavaScript-based Rating behavior.
*/
function computeAverage(childAssocRef) {
		var parentRef = childAssocRef.parent;
		
		// check the parent to make sure it has the right aspect
		if (parentRef.hasAspect("{http://www.metaversant.com/model/ratings/1.0}rateable")) {
			// continue, this is what we want
		} else {
			logger.log("Rating's parent ref did not have rateable aspect.");
			return;
		}
		
		// get the parent node's children
		var children = parentRef.childAssocs["{http://www.metaversant.com/model/ratings/1.0}ratings"];

		// iterate through the children to compute the total
		var average = 0.0;
		var total = 0;
        var count = 0;
        
		if (children != null && children.length > 0) {
            count = children.length;
			for (i in children) {
				var child = children[i];
				var rating = child.properties["{http://www.metaversant.com/model/ratings/1.0}rating"];
				total += rating;
			}
		
			// compute the average
			average = total / count;
		}			
	
		logger.log("Computed average:" + average);
		
		// store the average on the parent node
		parentRef.properties["{http://www.metaversant.com/model/ratings/1.0}averageRating"] = average;
		parentRef.properties["{http://www.metaversant.com/model/ratings/1.0}totalRating"] = total;
		parentRef.properties["{http://www.metaversant.com/model/ratings/1.0}ratingCount"] = count;
		parentRef.save();
		
		logger.log("Property set");
		
		return;

}