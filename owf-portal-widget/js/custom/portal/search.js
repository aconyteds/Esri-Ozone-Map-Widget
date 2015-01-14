define(["dojo/_base/declare",'dijit/_WidgetBase','dijit/_TemplatedMixin','dijit/_WidgetsInTemplateMixin', 'dojo/text!../templates/search.html',
        "dijit/form/Select", "dijit/form/TextBox", "dijit/form/Form", "dijit/form/Button","custom/portal/itemStore", "dojo/on", "dojo/Stateful", "dojo/_base/array", "dojo/_base/lang", 
        "custom/portal/toc"], 
		function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, searchTemplate,
				Select, TextBox, Form, Button, itemStore, on, Stateful, array, lang,
				portalToc){
	var Search=declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin],{
		widgetsInTemplate: true,
        templateString: searchTemplate,
        postCreate:function(){
        	var me=this;
        	on(me.searchForm, "submit", function(e){
        		var params=this.get("value");
        		me.portal[params.filter]({q:params.q, num:"100"}).then( function(data){
        			var res=new me.results();
        			if(params.filter==="queryGroups"){
        				res.set("folders", data.results);
        				//res.getGroupItems();
        			}
        			else if(params.filter==="queryUsers"){
        				res.set("folders", data.results);
        				//res.getUserItems();
        			}
        			else{
        				res.set("items", data.results);
        				res.set("columns", [
        				    {label:"Name", field:"title"},
        				    {label:"Type", field:"type"}
        				]);
        			}
        			me.createSearchResultTab( me.portalSharingUrl, res, "\""+ params.q+"\" - Results", me.targetContainer);
        			console.log([data, res]);
        		});
        		e.preventDefault();
        		e.stopPropagation();
        	});
        },
        createSearchResultTab:function( portalSharingUrl, result, title, target){
        	var userGridParams={
				store:itemStore(result.get("items"), result.get("folders")),
				selectionMode:"single",
				query:{parent:null},
				sort:"title",
				columns:result.get("columns")
			};
			target.addChild(new portalToc({title:title, gridParams:userGridParams, sharingUrl:portalSharingUrl, closable:true}));
        },
        results:declare([Stateful],{
        	items:[],
        	folders:[],
        	columns:[],
        	_itemsGetter:function(indx){
        		return this.items;
        	},
        	_itemsSetter:function(value){
        		if(value.constructor === Array){
        			this.items=this.items.concat(value);
        		}
        		else{
        			this.items.push(value);
        		}        		
        	},
        	_foldersGetter:function(indx){
        		return this.folders;
        	},
        	_foldersSetter:function(value){
        		if(value.constructor === Array){
        			this.folders=this.folders.concat(value);
        		}
        		else{
        			this.folders.push(value);
        		}   
        	},
        	_columnsGetter:function(){
        		return this.columns;
        	},
        	_columnsSetter:function(value){
        		this.columns=value;	
        	},
        	getGroupItems:function(indx){
        		var me=this;
        		array.forEach(this.folders, function(group){
        			console.log(group);
        			lang.mixin(group.results, {parent:group.id});
        			me.set("items", group.results);
        		});
        	},
        	getUserItems:function(indx){
        		
        	}
        })
	});	
	return Search;
});