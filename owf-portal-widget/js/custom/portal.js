define(["dojo/dom-construct", "dijit/layout/TabContainer", "dijit/layout/ContentPane", "dojo/_base/declare", "dojo/_base/lang", "esri/arcgis/Portal", "custom/portal/toc", "custom/portal/basemapGallery",
        "dojo/_base/array", "dojo/store/Memory", "dojo/store/Observable", "dojo/Stateful", "cmwapi/cmwapi", "esri/arcgis/utils"],
	function(domConstruct, TabContainer, ContentPane, declare, lang,  arcgisPortal, portalToc, basemapGallery,
			array, Memory, observable, Stateful, cmwapi, arcgisUtils){
		return declare([TabContainer], {
			postCreate:function(){
				var portalObj=this.portalOptions, portalSharingUrl=this.portalOptions.portal.portalUrl+"content/items";
				
				//Base Interface which will allow for searching and other interactions with a web Map
				this.portalInterface=new ContentPane({title:"WebMap", content:"Hello"});
				this.addChild(this.portalInterface);
				
				//User Content Tab
				this.portalOptions.getContent().then(lang.hitch(this, function(data){
					this.portalUserContainer=new portalToc({title:"User Content", storeData:this._createUserItemStore(data), sharingUrl:portalSharingUrl, selected:true});
					this.addChild(this.portalUserContainer);
				}));
				
				//Basemap Container
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
			},
			_itemContainer:declare([Stateful],{
				folders:[],
				_foldersGetter:function(){
					return this.folders;
				},
				_foldersSetter:function(arr){
					this.folders=this.folders.concat(arr);
				},
				items:[],
				_itemsGetter:function(){
					return this.items;
				},
				_itemsSetter:function(arr){
					this.items=this.items.concat(arr);
				}
			}),
			_createUserItemStore:function(data){
				var structure=new this._itemContainer({
					folders:data.folders,
					items:[]
				});
				var Memory;
				mStore=new observable(new this._Store({data:[]}));
				structure.watch("items", function(name, oldV, newV){
					array.forEach(newV, function(item){
						mStore.put({title:item.title, type:item.type, id:item.id.toString(), url:item.itemUrl, parent:item.folderId||null, children:null});
					});
				});
				structure.set("items", data.items);
				array.forEach(data.folders, function(folder){
					mStore.put({title: folder.title, id:folder.id.toString(), url:folder.url, type:"directory"});
					folder.getItems().then(function(items){
						structure.set("items", items);
					});				
				});
				return mStore;
			},
			_Store:declare([Memory],{
				getChildren:function(object){
					return this.query({parent:object.id});
				}
			})
		});
});