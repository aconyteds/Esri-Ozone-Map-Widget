define(["dojo/_base/declare", "dgrid/OnDemandGrid", "dgrid/tree", "dgrid/Selection", "dijit/layout/ContentPane", "dojo/_base/lang", "dojo/on", "dijit/tree/ObjectStoreModel",
        "cmwapi/cmwapi"],
	function(declare, OnDemandGrid, Tree, Selection, ContentPane, lang, on, ObjectStoreModel, cmwapi){
	return declare([ContentPane],{
		postMixInProperties:function(){
			lang.mixin(this, {portalData:this.storeData});
		},
		postCreate:function(){
			console.log([this, this.portalData]);
			var me=this;
			
			var myobj=this.portalData;
			this.grid=new this._grid({
				store:myobj,
				selectionMode:"single",
				query:{parent:null},
				columns:[
					Tree({label:"Name", field:"title"}),
					{label:"Type", field:"type"},
					{label:"URL", field:"url", sortable:false}
				],
			});
			this.addChild(this.grid);
			this.grid.startup();
			var obs=this.portalData.query();
			obs.observe(lang.hitch(this, function(a,b,c){
				console.log([a, b, c]);
				if(c>-1){
					this.grid.refresh();
					this.grid.resize();
				}
			}));
			on(this, "show", lang.hitch(this, function(){
				this.grid.resize();
			}));
			this.grid.on("dgrid-select", function(event){
				console.log(event);
				var row=event.rows[0];
				if(row.data.type=="Map Service" || row.data.type=="Web Map"){
					cmwapi.portal.item.add.send({id:row.id, type:row.data.type, sharingUrl:me.sharingUrl});
				}
				
			});
			
		},
		_grid:declare([OnDemandGrid, Selection],{
			
		})
	})	
});