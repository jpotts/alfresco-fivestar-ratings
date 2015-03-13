## About Metaversant's Fivestar Ratings Widget for Alfresco Share ##

This is an Alfresco Share customization that makes documents in the Alfresco repository rateable using a fivestar ratings widget. It started with the "Someco ratings" example from the Alfresco Developer Guide but adds a fully-integrated ratings widget into the Share UI.

With this customization in place, users can see the average rating and post new ratings from:
  * Dashlets
    * My Documents
    * Documents I'm Editing
    * Modified Documents (Site Dashboard)
  * Document Lists
    * Share Document Library
    * Repository Document Library
    * Search results
  * Document Details

Check out [this blog post](http://ecmarchitect.com/archives/2011/02/17/1296) for a link to a screencast.

## Didn't Alfresco release a ratings service in 3.4? ##

In 3.4, Alfresco introduced their own ratings service but that release did not include any front-end widgets to access the service. In addition, the 3.4 ratings service does not persist ratings statistics to the rated node, which is something that needs to happen, in our opinion, to support things like displaying a rating for every document in a list.

The goal of this project is for our ratings service to be API compatible with Alfresco's 3.4 ratings service, so that our front-end widget could be used with Alfresco's 3.4 back-end service when it is more fully-baked. Until then, if you deploy this customization to 3.4, it will leverage our custom Ratings Service rather than Alfresco's.

## Compatibility ##

The code is known to work on the following Alfresco versions:
  * Alfresco 3.3.3 Enterprise
  * Alfresco 3.3g Community
  * Alfresco 3.4.0 Enterprise
  * Alfresco 3.4d Community

Some versions may require version-specific steps, so [check the doc](http://code.google.com/p/alfresco-fivestar-ratings/wiki/Installation) before deploying.

It has been tested on Mac OS X 10.6.6 with the following clients:
  * Firefox 3.6.13
  * Safari 5.0.3
  * Google Chrome 9.0.597.102

And on Microsoft Windows 7 with the following clients:
  * Microsoft Internet Explorer 8
  * Firefox 3.6.10