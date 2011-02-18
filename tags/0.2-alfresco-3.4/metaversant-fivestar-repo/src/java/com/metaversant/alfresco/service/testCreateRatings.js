logger.log("Rated?" + mratings.hasRatings(document));

logger.log("Rating document three times");
mratings.rate(document, 1, person.properties.userName);
mratings.rate(document, 2, person.properties.userName);
mratings.rate(document, 3, person.properties.userName);

logger.log("Rated?" + mratings.hasRatings(document));