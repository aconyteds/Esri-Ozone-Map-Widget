# ESRI Components for OWF
 
## Description

This Git Repo provides sample widgets (light-weight web applications) designed for use with the [OZONE Widget Framework (OWF)](https://github.com/ozoneplatform/owf) that leverage the [ArcGIS JavaScript API](https://developers.arcgis.com/en/javascript/) to provide mapping capabilities to end users.  In addition to sample widgets, this repo includes AMD module sets for integrating map based widgets via the [Common Map Widget Application Programming Interface (CMWAPI)](http://www.cmwapi.org).

## Included Components

#### [ArcGIS OWF Map Widget](https://github.com/Esri/Esri-Ozone-Map-Widget/tree/master/owf-map-widget)

A resusable map widget that supports CMWAPI v1.1 widget interactions.  This widget includes a few common ArcGIS JavaScript map controls for map view manipulation and allows the plotting of map layers through the CMWAPI.  Additionally, it includes a basic Overlay Manager for displaying and manipulating map Overlays and Features as defined by the CMWAPI.  This widget leverages the CMWAPI 1.1 Specification Implementation and the ArcGIS CMWAPI Adapter modules described below.

#### [ArcGIS OWF Context Map Widget](https://github.com/Esri/Esri-Ozone-Map-Widget/tree/master/owf-context-map-widget)

The widget is intended to be used with the ArcGIS OWF Map Widget or another CMWAPI 1.1 compliant widget.  It shows the context of the viewed area in the primary map widget, as compared to a 2-D map of the world.  Clicking in or dragging a bounding box in the context map sends a message to listening maps to center on the click or bounding box location.

#### [ArcGIS Image Collection Query Widget](https://github.com/Esri/Esri-Ozone-Map-Widget/tree/master/image-collection-query-widget)

Allows the user to query for image metadata from a a particular feature service RESTful endpoint provided by Esri, within a time interval and cloud coverage percentage.  The endpoint returns KML, which the widget broadcasts via CMWAPI.  Users using CMWAPI-compliant widgets, including the ArcGIS OWF Map Widget, then see the existence and metadata of images of analytical interest, plotted on their map.

#### [cmwapi](https://github.com/Esri/Esri-Ozone-Map-Widget/tree/master/cmwapi)

A set of AMD modules that implement the CMWAPI specification and allow any OWF widget to communicate via CMWAPI channels without having to duplicate standard channel management and verification logic.  These modules attempt to provide all map-agnostic CMWAPI constructs and processing for client code.  They abstract the OWF pub/sub mechanism and include default message validation using specification rules. Where appropriate, missing message elements are replaced with default values (e.g., replacing missing overlayId values with the id of the sending widget).  Any errors detected by these modules are published on the map.error channel. 

#### [cmwapi-adapter](https://github.com/Esri/Esri-Ozone-Map-Widget/tree/master/cmwapi-adapter)

A set of AMD modules that can be used in conjunction with an [ArcGIS Map](https://developers.arcgis.com/en/javascript/jsapi/map-amd.html) object to interact with OWF widgets via the CMWAPI.  These modules attach a series of event handlers to the CMWAPI channels that translate CMWAPI messages to appropriate ArcGIS JavaScript calls via the [cmwapi](https://github.com/Esri/Esri-Ozone-Map-Widget/tree/master/cmwapi) modules. They represent the ArcGIS specific portion of a full CMWAPI implementation.

#### [Basic Map Widget](https://github.com/Esri/Esri-Ozone-Map-Widget/tree/master/basic-map-widget)

A simple map widget using the ESRI [ArcGIS JavaScript API](https://developers.arcgis.com/en/javascript/). It's purpose is to provide a basic demonstration of using ArcGIS maps within OWF widgets.  When run within OWF alongside the Contacts Manager widget described below, it includes the following features:

* Receives [drag and drop](https://github.com/ozoneplatform/owf/wiki/OWF-7-Developer-Widget-Drag-and-Drop-API) data from other OWF widgets.

    > When an entry is dragged from the Contacts Manager into the map it will then plot and zoom to the location.

* Receives [Intents](https://github.com/ozoneplatform/owf/wiki/OWF-7-Developer-Widget-Intents-API) from other OWF widgets that plot a location

#### [Contacts Manager](https://github.com/Esri/Esri-Ozone-Map-Widget/tree/master/contacts)

A modified version of the [Contacts Manager](https://github.com/ozoneplatform/owf/tree/master/web-app/examples/walkthrough/widgets/contacts) example widget that ships with OWF 7. This version uses Intents to allow the user to select which map widget implementation should receive the address when contact entry is clicked. (The original version was hard coded to send the address to a specific map widget.)

#### [Portal] (https://github.com/Esri/Esri-Ozone-Map-Widget/tree/master/owf-portal-widget)

A simple implementation showcasing the ability to integrate Portal within the Ozone Widget Framework. This version allows for the use of OAuth authentication to enable a user to view, load, and update information within their organizations Portal.

## Limitations / Known Issues

1. CMWAPI map.feature.plot messages are not supported by the map widget.  ArcGIS KMLLayers make use of an ArcGIS Portal service to parse KML data.  This service requires accessible URLs to KML data and does not accept KML string input.  See the [KML Layer JavaScript documentation] (https://developers.arcgis.com/javascript/jsapi/kmllayer-amd.html) for more details.  A client side parser or an enhancement to the KML processing service may be provided in an update. 

2. CMWAPI Drag and Drop messages that include "feature" attributes are not supported by the map widget.  These drag and drop messages provide KML data in string format.  See limitation 1.  Note that CMWAPI drag and drop messages that provide markers or feature URLs are supported.

3. "Zooming" to added feature layers when they are created is supported for features that can be rendered in one pass.  Composite features (e.g., KMZ files) that may result in multiple asynchronous data pulls do not auto-zoom the map after loading.  This may be added as an enhancement but can present certain usability issues.  If any of the asynchronous calls takes a long time, the eventual zooming to data may not appear connected to the user action that triggered it.

4. Loading content from Portal can sometimes cause issues if there is a problem with the security of the resources vs the security of the deployed environment.

## Requirements

1. OWF 6.0 GA or better.  See the OWF [Get Started](http://www.owfgoss.org/getstarted.html) page, if you are not familiar with the framework.
    
    > NOTE: Although CMWAPI 1.1 makes use of eventing, the widgets also take advantage of widget intents, introduced in OWF6.  Since CMWAPI 1.2 intends to add widget intents to the specification, we have concentrated on supporting releases of OWF which have the widget intents capability.  

2. Web server to host the widgets

    > NOTE: You may choose to host the widgets on the same server as OWF for convenience. The [OWF download](https://www.owfgoss.org/download.html) features a bundled [Tomcat](http://tomcat.apache.org/) instance.

3. Access to Esri services
    
    All widgets
    
    > _Esri Javascript API_, which itself presumes access to Esri services:   Tested with http://js.arcgis.com/3.7/, and configurable in each widget via the window.esriJsPath in js/dojoConfig.js. 

    Image collection query widget

    >   _Image Collection Coverage service_  is a query to a RESTful endpoint provided by Esri which interacts with a feature service to provide a set of images for Iran.  Its endpoint location is configurable via DEFAULT_SERVER in app.js.  

4. Proxy to provide access to Esri services

    > NOTE: Certain Esri services, including those dealing with WMS, require provision of a [proxy](https://developers.arcgis.com/en/javascript/jshelp/ags_proxy.html), which is a server-side code deployment.  Choose and configure the appropriate proxy implementation (ASP.NET, Java, PHP, ...) for your web server.  These widgets were tested against the Java/JSP proxy.  If using the Java/JSP proxy, be sure to modify the serverUrls variable to match your data URLs.  For development purposes, this variable can be set to pass "http://" and "https://".  A deployment version of the proxy should use more restrictive URL filters.

    > NOTE: The location for the proxy used by the ArcGIS OWF Map Widget is configured in app.js as esri.config.defaults.io.proxyUrl.

## Installation

1. Create an `esri` directory in the appropriate **_`webapps`_** location for your web server.

2. Copy the contents of this project to the newly created directory.

     > NOTE: To deploy minified versions of the CMWAPI and CMWAPI-ADAPTER modules, build the project using "grunt deploy" and copy the contents of the deployment folder to this location instead.

3. Login to your running OWF instance as an administrator.

4. [Create](https://github.com/ozoneplatform/owf/wiki/OWF-7-Administrator-Creating-and-Editing-Widgets) entries for the widgets in OWF by importing the following descriptor files from your server:
    * http(s)://_**yourserver**_:_**port**_/esri/owf-map-widget/descriptor.html
    * http(s)://_**yourserver**_:_**port**_/esri/basic-map-widget/descriptor.html
    * http(s)://_**yourserver**_:_**port**_/esri/contacts/descriptor/descriptor.html
    * http(s)://_**yourserver**_:_**port**_/esri/owf-context-map-widget/descriptor.html
    * http(s)://_**yourserver**_:_**port**_/esri/image-collection-query-widget/descriptor.html
    * http(s)://_**yourserver**_:_**port**_/esri/owf-portal-widget/descriptor.html

5. Assign the widgets to the [OWF Users Group](https://github.com/ozoneplatform/owf/wiki/OWF-7-Administrator-Default-Content) or to specific users so they can be opened.

## Portal Implementation Instructions (Optional)
> If you wish to integrate Portal with your Ozone Widget Framework Implementation

Once you have finished deploying the Esri widgets and have verified they are working within your Ozone environment; complete the following steps to enable Portal to communicate with your environment.

1. Login to your portal as an administrator with publisher rights and navigate to "My Content."
2. Select "Add Item" and navigate to "An Application" to launch the Add Item dialog.
3. Provide the URL for your Ozone Application, Select Web Mapping, Ready to Use, Javascript, and fill out the Title and Tags information and press "Add Item."
4. If not taken to the details page for the registered application, select the title in the "My Content" section.
5. Share the application with the necessary groups and make any other modifications you wish to ensure users can find the application within your Portal.
6. Under App Registration, select "REGISTER"
7. Keep App Type as Browser, and add any URLs which can be used to access your application. When done press "REGISTER."
8. In your deployment, update <install path>/owf-portal-widget/js/config.json with the URL for your Portal and the App ID in the App Registration section on the Item Details Page.

## Development Environment Setup

The unit tests and JavaScript documentation for this repository can be run/generated using the [GRUNT Task Runner](http://gruntjs.com "GRUNT: The JavaScript Task Runner - Homepage"). Said tests leverage the [Jasmine v1.3.1](http://pivotal.github.io/jasmine "Jasmine Introduction") testing framework and are executed with [Karma v0.10.2](http://karma-runner.github.io/0.10/index.html "Karma: Spectacular Test Runner for JavaScript - Homepage"). The required development tools are provided by the [NPM Registry](http://npmjs.org "Node Packaged Modules - Homepage") and [Node JS v0.10.21](http://nodejs.org "Node.js - Homepage").  Java must be installed and available in your PATH for use by [JSDoc](https://github.com/krampstudio/grunt-jsdoc "Grunt-jsdoc plugin").

> NOTE: The products of this repository can be developed and extended using any number of current JavaScript and web development frameworks. The installation steps below are provided for the convenience of contributors.

To setup the development environment, use the directions below. 

1. Install the appropriate [Node JS v0.10.21](http://nodejs.org/download "Node.js Downloads") package for your platform and the accompanying Node Package Manager (NPM).

    > WARNING: Older versions of Node/NPM (e.g., v0.8.x) may not execute the current Karma installation packages correctly on Windows. An update to the latest version of Node/NPM is recommended.

2. Install the GRUNT command line _globally_ by executing:

        npm install -g grunt-cli

3. Install other development dependencies by executing the following in the source code root directory (where the [package.json](package.json) file is located):

        npm install

4. (Optional) Install Karma _globally_ so that it may be executed manually outside of GRUNT (with alternate options specified):

        npm install -g karma

5. To run the unit tests and create JavaScript documentation simply execute `grunt` in the source code root directory.

We are also internally experimenting with the use of [Vagrant](http://www.vagrantup.com) and make our Vagrantfile efforts available in the dev-ops folder.  

### Grunt Targets
Once the development environment has been setup, grunt can be used to run JSHint on the JavaScript code, execute the functional tests and generate project documentation.  To run everything in series, use the following command from the top level directory.

        grunt

Specific build targets are defined in the top level file, Gruntfile.js.  At present, there are a few primary targets:  jshint, test, jsdoc, and deploy.  Provide those targets on the command line to execute only those grunt tasks.

        grunt jsdoc

Notes that targets can be nested for further refinement.  For example, to produce only the documentation for the CMWAPI related JavaScript files, use the following command:

        grunt jsdoc:cmwapi
         

Note that the below task accomplishes all of the development tasks listed above, and finally prepares a deployment folder with minify-ed versions of necessary JavaScript files and all other needed resources.

        grunt deploy


### Additional JavaScript Test Options

If you have installed Karma globally (as noted above) you may execute it manually from the command and reference a specific configuration file:

    karma start test/test-chrome.conf.js

If any tests fail, a common way to debug them is through the use of browser-specific tools. To enable this, you may override the config file settings for a specific browser and put Karma in server mode to allow for repeated test execution:

    karma start test/test-chrome.conf.js --browsers=Chrome --single-run=false

## Copyright

Copyright © 2013 [Environmental Systems Research Institute, Inc. (Esri)](http://www.esri.com)

## License

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

A copy of the license is available in the repository's
[license.txt](https://github.com/Esri/Esri-Ozone-Map-Widget/blob/master/license.txt) file.
