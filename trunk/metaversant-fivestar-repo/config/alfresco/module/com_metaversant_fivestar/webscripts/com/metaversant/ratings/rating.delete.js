function main() {

    if (url.templateArgs.id == null || url.templateArgs.id.length == 0) {
        logger.log("Node ID argument not set");
        status.code = 400;
        status.message = "Node ID argument not set";
        status.redirect = true;
        return;
    }

    if (url.templateArgs.store_type == null || url.templateArgs.store_type.length ==0) {
        logger.log("Store type not set");
        status.code = 400;
        status.message = "Store type not set";
        status.redirect = true;
        return;
    }

    if (url.templateArgs.store_id == null || url.templateArgs.store_id.length ==0) {
        logger.log("Store ID not set");
        status.code = 400;
        status.message = "Store ID not set";
        status.redirect = true;
        return;
    }

    var nodeRefStr = url.templateArgs.store_type + "://" + url.templateArgs.store_id + "/" + url.templateArgs.id;
    logger.log("Getting current node");
    var curNode = search.findNode(nodeRefStr);
    if (curNode == null) {
        logger.log("Node not found");
        status.code = 404;
        status.message = "No node found for node ref:" + nodeRefStr;
        status.redirect = true;
        return;
    }

    mratings.deleteRatings(curNode);

    model.nodeRef = nodeRefStr;
    model.schemeName = "fiveStarRatingScheme"; // 3.4 compat

}

main();