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
