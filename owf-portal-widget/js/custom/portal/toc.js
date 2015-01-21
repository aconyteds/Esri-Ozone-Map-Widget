define(["dojo/_base/declare", "dgrid/OnDemandGrid", "dgrid/Selection", "dijit/layout/ContentPane", "dojo/_base/lang", "dojo/on", "cmwapi/cmwapi", "dojo/dom-attr"],
	function(declare, OnDemandGrid, Selection, ContentPane, lang, on,  cmwapi, domAttr){
	return declare([ContentPane],{
		postCreate:function(){
			var me=this;
			this.set("style", "padding:0; overflow:hidden;");
			this.grid=new this._grid(this.gridParams);
			console.log(this.grid);
			domAttr.set(this.grid.domNode, "style", {height:"100%"});
			this.addChild(this.grid);
			this.grid.startup();
			var obs=this.gridParams.store.query();
			obs.observe(lang.hitch(this, function(a,b,c){
				if(c>-1){
					this.grid.refresh();
					this.grid.resize();
				}
			}));
			on(this, "show", lang.hitch(this, function(){
				this.grid.resize();
			}));
			this.grid.on("dgrid-select", function(event){
				var row=event.rows[0];
				if(row.data.type=="Map Service" || row.data.type=="Web Map"){
					cmwapi.portal.item.add.send({id:row.id, type:row.data.type, sharingUrl:me.sharingUrl});
				}
			});
		},
		_grid:declare([OnDemandGrid, Selection],{
			noDataMessage:"No results were found"
			
		})
	})	
});