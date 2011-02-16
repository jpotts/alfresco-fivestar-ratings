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
package com.metaversant.alfresco.jscript;

import org.alfresco.repo.jscript.ScriptNode;
import org.alfresco.repo.jscript.ValueConverter;
import org.alfresco.repo.processor.BaseProcessorExtension;
import org.alfresco.service.cmr.repository.NodeRef;

import com.metaversant.alfresco.service.RatingService;

public class Ratings extends BaseProcessorExtension {

	private RatingService ratingService;
	
	private final ValueConverter valueConverter = new ValueConverter();
	
	public void rate(ScriptNode scriptNode, int rating, String user) {
		ratingService.rate((NodeRef)valueConverter.convertValueForRepo(scriptNode), rating, user);
	}
	
	public void deleteRatings(ScriptNode scriptNode) {
		ratingService.deleteRatings((NodeRef)valueConverter.convertValueForRepo(scriptNode));
	}
	
	public Object getRatingData(ScriptNode scriptNode) {
		return ratingService.getRatingData((NodeRef)valueConverter.convertValueForRepo(scriptNode)); 
	}
	
	public int getUserRating(ScriptNode scriptNode, String user) {
		return ratingService.getUserRating((NodeRef)valueConverter.convertValueForRepo(scriptNode), user);
	}
	
	public boolean hasRatings(ScriptNode scriptNode) {
		return ratingService.hasRatings((NodeRef)valueConverter.convertValueForRepo(scriptNode));
	}

	public void setRatingService(RatingService ratingService) {
		this.ratingService = ratingService;
	}
	
}
