define(["dojo/dom-construct", "dijit/layout/TabContainer", "dijit/layout/ContentPane", "dojo/_base/declare", "dojo/_base/lang", "esri/arcgis/Portal", "custom/portal/toc", "custom/portal/basemapGallery",
        "dojo/_base/array", "cmwapi/cmwapi", "esri/arcgis/utils", "custom/portal/search", "dgrid/tree", "custom/portal/itemStore"],
	function(domConstruct, TabContainer, ContentPane, declare, lang,  arcgisPortal, portalToc, basemapGallery,
			array, cmwapi, arcgisUtils, Search, Tree, itemStore){
		return declare([TabContainer], {
			postCreate:function(){
				var portalObj=this.portalOptions, portalSharingUrl=this.portalOptions.portal.portalUrl+"content/items";
				/**Base Interface which will allow for searching and other interactions with a web Map*/
				this.portalInterface=new ContentPane({title:"WebMap", content:"Welcome "+portalObj.fullName+"!"});
				this.addChild(this.portalInterface);
				var searchContainer=domConstruct.create("div", null, this.portalInterface.domNode);
				new Search({portal:this.portalOptions.portal, portalSharingUrl:portalSharingUrl, targetContainer:this}).placeAt(searchContainer);	
				
				/**User Content Tab*/
				this.portalOptions.getContent().then(lang.hitch(this, function(data){
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
					this.portalUserContainer=new portalToc({title:"User Content", gridParams:userGridParams, sharingUrl:portalSharingUrl, selected:true});
					this.addChild(this.portalUserContainer);
				}));
				
				/**Basemap Container*/
				this.BasemapContainer=new basemapGallery({title:"Basemaps", portalObj:portalObj, sharingUrl:portalSharingUrl});
				this.addChild(this.BasemapContainer);
				
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