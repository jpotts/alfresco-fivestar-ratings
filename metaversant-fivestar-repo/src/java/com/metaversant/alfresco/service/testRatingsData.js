logger.log("User rating:" + mratings.getUserRating(document, person.properties.userName));

var ratingData = mratings.getRatingData(document);

logger.log("Average:" + ratingData.getRating());
logger.log("Count:" + ratingData.getCount());
logger.log("Total:" + ratingData.getTotal());