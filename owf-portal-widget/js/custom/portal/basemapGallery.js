define(["dojo/_base/declare", "dijit/layout/ContentPane", "dojo/_base/array", "esri/arcgis/utils", "dijit/form/Button", "cmwapi/cmwapi", "dojo/dom-attr"],
		function(declare, ContentPane, array, arcgisUtils, Button, cmwapi, domAttr){
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
							var tempButton=new me._createBasemapDijit({basemapInfo:myItem, label:myItem.item.title, portalUrl:portalObj.portal.portalUrl});
							me.addChild(tempButton);
						});
					});
				})
			});
		},
		_createBasemapDijit:declare([Button],{
			//Use this to create an individual Basemap Button that when clicked will fire off the set basemap event
			postCreate:function(){
				domAttr.set(this.iconNode, "style", {background:"url("+this.portalUrl+"/content/items/"+this.basemapInfo.item.id+"/info/"+this.basemapInfo.item.thumbnail+")",
					height:"133px", width:"200px", display:"block", border:"1px solid #759dc0"});
			},
			onClick:function(){
				cmwapi.portal.basemaps.set.send({id:this.basemapInfo.item.id, data:this.basemapInfo.itemData.baseMap});
			}
		})
	});
});