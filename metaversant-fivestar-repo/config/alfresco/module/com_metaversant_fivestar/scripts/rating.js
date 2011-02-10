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