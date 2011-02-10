package com.metaversant.alfresco.service;

import org.alfresco.service.cmr.repository.NodeRef;

public interface RatingService {
	public void rate(NodeRef nodeRef, int rating, String user);
	public void deleteRatings(NodeRef nodeRef);
	public RatingData getRatingData(NodeRef nodeRef);
	public int getUserRating(NodeRef nodeRef, String user);
	public boolean hasRatings(NodeRef nodeRef);
	
	public interface RatingData {
		public int getCount();
		public double getRating();
		public int getTotal();
	}
	
}
