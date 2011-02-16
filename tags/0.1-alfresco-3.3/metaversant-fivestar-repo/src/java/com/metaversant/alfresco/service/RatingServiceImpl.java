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
package com.metaversant.alfresco.service;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.alfresco.repo.security.authentication.AuthenticationUtil;
import org.alfresco.repo.security.authentication.AuthenticationUtil.RunAsWork;
import org.alfresco.service.cmr.repository.ChildAssociationRef;
import org.alfresco.service.cmr.repository.NodeRef;
import org.alfresco.service.cmr.repository.NodeService;
import org.alfresco.service.cmr.search.ResultSet;
import org.alfresco.service.cmr.search.SearchService;
import org.alfresco.service.namespace.QName;
import org.alfresco.service.namespace.QNamePattern;
import org.alfresco.service.namespace.RegexQNamePattern;
import org.apache.log4j.Logger;

import com.metaversant.alfresco.model.RatingsModel;

public class RatingServiceImpl implements RatingService {

	private NodeService nodeService;
	private SearchService searchService;
	
	private Logger logger = Logger.getLogger(RatingServiceImpl.class);

	public RatingData getRatingData(NodeRef nodeRef) {
		
		Integer total = (Integer)nodeService.getProperty(nodeRef, RatingsModel.PROP_TOTAL_RATING);
		if (total == null) total = 0;
		Integer count = (Integer)nodeService.getProperty(nodeRef, RatingsModel.PROP_RATING_COUNT);
		if (count == null) count = 0;
		Double rating = (Double)nodeService.getProperty(nodeRef, RatingsModel.PROP_AVERAGE_RATING);
		if (rating == null) rating = 0.0d;
 
		RatingData ratingData = new RatingDataImpl(total, count, rating);

		return ratingData;
	}

	protected NodeRef getRatingNodeRef(NodeRef nodeRef, String user) {
		String queryString = "PARENT:\"" + nodeRef.toString() + "\" AND @mr\\:rater:\"" + user + "\"";

		ResultSet results = searchService.query(nodeRef.getStoreRef(), SearchService.LANGUAGE_LUCENE, queryString);
		
		List<NodeRef> resultList = results.getNodeRefs();
		
		if (resultList == null || resultList.isEmpty()) {
			logger.debug("No ratings found for this node for user: " + user);
			return null;
		} else {
			return resultList.get(resultList.size()-1);
		}
	}
	
	public int getUserRating(NodeRef nodeRef, String user) {
		int rating = 0;
		
		if (user == null || user.equals("")) {
			logger.debug("User name was not passed in");
			return rating;
		}

		NodeRef ratingNodeRef = getRatingNodeRef(nodeRef, user);
		if (ratingNodeRef != null) {
			Integer ratingProp = (Integer) nodeService.getProperty(ratingNodeRef, RatingsModel.PROP_RATING);
			
			if (ratingProp != null) {
				rating = ratingProp;
			}
		}

		return rating;
	}

	public boolean hasRatings(NodeRef nodeRef) {
		List<NodeRef> ratingList = getRatings(nodeRef);
		return !ratingList.isEmpty();
	}
	
	public List<NodeRef> getRatings(NodeRef nodeRef) {
		ArrayList<NodeRef> returnList = new ArrayList<NodeRef>();
		List<ChildAssociationRef> children = nodeService.getChildAssocs(nodeRef, (QNamePattern) RatingsModel.ASSN_MR_RATINGS, new RegexQNamePattern(RatingsModel.NAMESPACE_METAVERSANT_RATINGS_CONTENT_MODEL, "rating.*"));
		for (ChildAssociationRef child : children) {
			returnList.add(child.getChildRef());			
		}
		return returnList;
	}
	
	public void rate(NodeRef nodeRef, int rating, String user) {
		NodeRef ratingNodeRef = getRatingNodeRef(nodeRef, user);		
		if (ratingNodeRef == null) {
			createRatingNode(nodeRef, rating, user);
		} else {
			// do an update instead of a create--we aren't going to allow more than
			// one vote per user
			// maybe we should make this configurable in the future
			updateRatingNode(ratingNodeRef, rating);
		}
	}
	
	protected void updateRatingNode(final NodeRef ratingNodeRef, final int rating) {

		AuthenticationUtil.runAs(new RunAsWork<String>() {
			@SuppressWarnings("synthetic-access")
			public String doWork() throws Exception {

					nodeService.setProperty(ratingNodeRef, RatingsModel.PROP_RATING, rating);
			
					logger.debug("Updated rating node");
					return "";
			}
		},
		AuthenticationUtil.SYSTEM_USER_NAME);					
	}
	
	protected void createRatingNode(final NodeRef nodeRef, final int rating, final String user) {

		AuthenticationUtil.runAs(new RunAsWork<String>() {
			@SuppressWarnings("synthetic-access")
			public String doWork() throws Exception {
					// add the aspect to this document if it needs it		
					if (nodeService.hasAspect(nodeRef, RatingsModel.ASPECT_MR_RATEABLE)) {
						logger.debug("Document already has aspect");
					} else {
						logger.debug("Adding rateable aspect");
						nodeService.addAspect(nodeRef, RatingsModel.ASPECT_MR_RATEABLE, null);
					}
					
					Map<QName, Serializable> props = new HashMap<QName, Serializable>();
					props.put(RatingsModel.PROP_RATING, rating);
					props.put(RatingsModel.PROP_RATER, user);
			
					nodeService.createNode(
							nodeRef,
							RatingsModel.ASSN_MR_RATINGS,
							QName.createQName(RatingsModel.NAMESPACE_METAVERSANT_RATINGS_CONTENT_MODEL, RatingsModel.PROP_RATING.getLocalName() + new Date().getTime()),
							RatingsModel.TYPE_MR_RATING,
							props);
			
					logger.debug("Created rating node");
					return "";
			}
		},
		AuthenticationUtil.SYSTEM_USER_NAME);					
	}
	
	public void deleteRatings(NodeRef nodeRef) {
		// check the parent to make sure it has the right aspect
		if (nodeService.hasAspect(nodeRef, RatingsModel.ASPECT_MR_RATEABLE)) {
			// continue, this is what we want
		} else {
			logger.debug("Node did not have rateable aspect.");
			return;
		}
		
		// get the node's children
		List<NodeRef> ratingList = getRatings(nodeRef);

		if (ratingList.size() == 0) {
			// No children so no work to do
			if (logger.isDebugEnabled()) logger.debug("No children found");			
		} else {
			// iterate through the children and remove each one			
			for (NodeRef ratingNodeRef : ratingList) {
				nodeService.removeChild(nodeRef, ratingNodeRef);
			}
		}
	}
	
	public class RatingDataImpl implements RatingService.RatingData {
		protected int total;
		protected int count;
		protected double rating;
		
		public RatingDataImpl(int total, int count, double rating) {
			this.total = total;
			this.count = count;
			this.rating = rating;
		}
		
		public int getCount() {
			return count;
		}
		
		public double getRating() {
			return rating;
		}
		
		public int getTotal() {
			return total;
		}
	}

	public void setNodeService(NodeService nodeService) {
		this.nodeService = nodeService;
	}

	public void setSearchService(SearchService searchService) {
		this.searchService = searchService;
	}
}
