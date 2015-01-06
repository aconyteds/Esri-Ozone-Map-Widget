define(["dojo/_base/declare", "dijit/layout/ContentPane", "dojo/_base/array", "esri/arcgis/utils", "dijit/form/Button", "cmwapi/cmwapi"],
		function(declare, ContentPane, array, arcgisUtils, Button, cmwapi){
	return declare([ContentPane],{
		postCreate:function(){
			var me=this, portalObj=this.portalObj;
			arcgisUtils.arcgisUrl=this.sharingUrl;
			portalObj.portal.queryGroups({q:portalObj.portal.basemapGalleryGroupQuery}).then(function(data){
				//Query the actual results
				data.results[0].queryItems({num:100}).then(function(items){
					array.forEach(items.results, function(item){
						arcgisUtils.getItem(item.id).then(function(myItem){
							cmwapi.portal.basemaps.add.send({id:myItem.item.id, data:myItem.itemData.baseMap});
							var tempButton=new me._createBasemapDijit({basemapInfo:myItem, label:myItem.item.title});
							me.addChild(tempButton);
						});
					});
				})
			});
		},
		_createBasemapDijit:declare([Button],{
			//Use this to create an individual Basemap Button that when clicked will fire off the set basemap event
			postCreate:function(){
				
			},
			onClick:function(){
				cmwapi.portal.basemaps.set.send({id:this.basemapInfo.item.id});
			}
		})
	});
});