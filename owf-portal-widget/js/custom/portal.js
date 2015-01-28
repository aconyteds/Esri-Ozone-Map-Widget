define(["dojo/dom-construct", "dijit/layout/TabContainer", "dijit/layout/ContentPane", "dojo/_base/declare", "custom/portal/basemapGallery",
         "custom/portal/searchInterface", "dgrid/tree",  "dijit/layout/AccordionContainer", "custom/portal/search"],
	function(domConstruct, TabContainer, ContentPane, declare,  basemapGallery,
			  SearchInterface, Tree,  AccordionContainer, search){
		return declare([TabContainer], {
			postCreate:function(){
				var portalObj=this.portalOptions, portalSharingUrl=this.portalOptions.portal.portalUrl+"content/items";
				
				/**Base Interface which will allow for searching and other interactions with a web Map*/
				this.portalInterface=new ContentPane({title:"Portal Options", style:{padding:"0"}});
				this.addChild(this.portalInterface);
				var portalOptionsContainer=new AccordionContainer();
				this.portalInterface.addChild(portalOptionsContainer);
				var searchContainer=new ContentPane({title:"Search for Content within "+portalObj.portal.name});
				portalOptionsContainer.addChild(searchContainer);
				var searchWorker=new search({portal:portalObj.portal, portalSharingUrl:portalSharingUrl});

				//Sample Queries
				searchWorker.groupQuery("group", null, this);
				searchWorker.itemQuery("item", null, this);
				
				/**SEARCH INTERFACE PANE**/
				var _search=new SearchInterface({portal:portalObj.portal, portalSharingUrl:portalSharingUrl, targetContainer:this, searchWorker:searchWorker}).placeAt(searchContainer);
				
				/**User Content Accordion*/
				searchWorker.userQuery(portalObj.username, null, portalOptionsContainer, {str:portalObj.fullName+"'s Content", length:Infinity});
				
				/**Basemap Container*/
				this.BasemapContainer=new basemapGallery({title:portalObj.portal.name+" Basemaps", portalObj:portalObj, sharingUrl:portalSharingUrl});
				portalOptionsContainer.addChild(this.BasemapContainer);
				
				/**TODO: User Group Container**/				
			}
		});
});