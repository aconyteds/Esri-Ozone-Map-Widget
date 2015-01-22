define(["dojo/dom-construct", "dijit/layout/TabContainer", "dijit/layout/ContentPane", "dojo/_base/declare", "dojo/_base/lang", "esri/arcgis/Portal", "custom/portal/toc", "custom/portal/basemapGallery",
        "dojo/_base/array", "cmwapi/cmwapi", "esri/arcgis/utils", "custom/portal/searchInterface", "dgrid/tree", "custom/portal/itemStore", "dijit/layout/AccordionContainer", "custom/portal/search"],
	function(domConstruct, TabContainer, ContentPane, declare, lang,  arcgisPortal, portalToc, basemapGallery,
			array, cmwapi, arcgisUtils, SearchInterface, Tree, itemStore, AccordionContainer, search){
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
				var _search=new SearchInterface({portal:portalObj.portal, portalSharingUrl:portalSharingUrl, targetContainer:this}).placeAt(searchContainer);
				var searchWorker=new search({portal:portalObj.portal, portalSharingUrl:portalSharingUrl, targetContainer:this});
				searchWorker.groupQuery("group", null, this);
				searchWorker.itemQuery("item", null, this);
				
				/**User Content Accordion*/
				portalObj.getContent().then(lang.hitch(this, function(data){
					var userGridParams={
						store:itemStore(data.items, data.folders),
						selectionMode:"single",
						query:{parent:null},
						sort:"title",
						columns:[
							Tree({label:"Name", field:"title"}),
							{label:"Type", field:"type"}
						],
					};
					this.portalUserContainer=new portalToc({title:portalObj.fullName+"'s Content", gridParams:userGridParams, sharingUrl:portalSharingUrl});
					portalOptionsContainer.addChild(this.portalUserContainer);
				}));
				
				/**Basemap Container*/
				this.BasemapContainer=new basemapGallery({title:portalObj.portal.name+" Basemaps", portalObj:portalObj, sharingUrl:portalSharingUrl});
				portalOptionsContainer.addChild(this.BasemapContainer);
				
				//User Group Container
				
				
				/*this.portalOptions.getGroups().then(lang.hitch(this, function(data){
					var structure=[];
					array.forEach(data, function(group){
						group.queryItems().then(function(items){
						});						
					});
					console.log(data);
					this.portalGroupContainer=new portalToc({title:"Group Content", storeData:data});
					this.addChild(this.portalGroupContainer);
				}));*/
				
				//console.log([this.portalOptions.portal.basemapGalleryGroupQuery, this.portalOptions]);
				//this._initBMHandler(this.portalOptions.portal.basemapGalleryGroupQuery, this.portalOptions.portal.portalUrl, this);
			}
		});
});