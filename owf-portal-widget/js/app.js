/**
 * @copyright © 2014 Environmental Systems Research Institute, Inc. (Esri)
 *
 * @license
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at<br>
 * <br>
 *     {@link http://www.apache.org/licenses/LICENSE-2.0}<br>
 * <br>
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

// Entry point for portal webapp
//
// NOTE: Modules that are not compatible with asynchronous module loading
// (AMD) are included in the webapp's HTML file to prevent issues.
require(['dojo/_base/xhr', "custom/imw", "dojo/_base/array", "esri/arcgis/Portal", "custom/portal","cmwapi/cmwapi", "esri/IdentityManager", "esri/arcgis/OAuthInfo", "dojo/domReady!"],
    function(xhr, imw, array, arcgisPortal, portal, cmwapi, esriId, OAuthInfo){
	xhr.get({url:"js/config.json", handleAs:"json",load: function(data){
		var oAuthInfo = esriId.findOAuthInfo(data.portalInfo.portalUrl);
		if(!oAuthInfo){
			var oauthReturnUrl = window.location.protocol + "//" + window.location.host +"/esri/oauth-callback.html";
			oAuthInfo = new OAuthInfo({
				appId: data.portalInfo.appId,
				expiration: 14 * 24 * 60,
				portalUrl: data.portalInfo.portalUrl,
				authNamespace: '/',
				popup: true,
				popupCallbackUrl: oauthReturnUrl,
				popupWindowFeatures: "height=312,width=355,location"
			});
			esriId.registerOAuthInfos([oAuthInfo]);
		}
		esriId.getCredential(data.portalInfo.portalUrl).then(function(login){
			new arcgisPortal.Portal(data.portalInfo.portalUrl).signIn().then(function(portalData){
				cmwapi.portal.signIn.send(data);				
				//console.log(portalData);
				new portal({style:"height:100%; width:100%;", tabPosition:"bottom", portalOptions:portalData}).placeAt("portalContainer").startup();
			});
		});		
		
	}});
    if (OWF.Util.isRunningInOWF()) {
        OWF.ready(function () {
            // see https://developers.arcgis.com/en/javascript/jshelp/ags_proxy.html for options
            //  applicable to your deployment environment
            // Base installation - applying with a JSP available in this app.
            //  However, other options (ASP.NET, PHP) exist
            // TODO: Need means of configuring for the overall application...  Also, dealing with authentication
            esri.config.defaults.io.proxyUrl = "/Java/proxy.jsp";

            OWF.notifyWidgetReady();
       });
    }
});
