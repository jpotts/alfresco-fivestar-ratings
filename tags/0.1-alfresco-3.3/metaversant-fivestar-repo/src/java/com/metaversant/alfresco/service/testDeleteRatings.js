logger.log("Rated?" + mratings.hasRatings(document));

logger.log("Deleting ratings");
mratings.deleteRatings(document);

logger.log("Rated?" + mratings.hasRatings(document));