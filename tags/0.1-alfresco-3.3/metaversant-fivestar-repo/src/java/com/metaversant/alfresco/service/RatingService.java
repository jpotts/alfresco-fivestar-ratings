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
