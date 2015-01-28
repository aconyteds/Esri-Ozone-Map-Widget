define(["dojo/_base/declare",'dijit/_WidgetBase','dijit/_TemplatedMixin','dijit/_WidgetsInTemplateMixin', 'dojo/text!../templates/searchInterface.html',
        "dijit/form/Select", "dijit/form/TextBox", "dijit/form/Form", "dijit/form/Button", "dojo/on", "dojo/Stateful", "dojo/_base/array", "dojo/_base/lang", 
        "dijit/TitlePane", "dijit/form/CheckBox"], 
		function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, searchTemplate,
				Select, TextBox, Form, Button,  on, Stateful, array, lang,
				TitlePane, CheckBox){
	var Search=declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin],{
		widgetsInTemplate: true,
        templateString: searchTemplate,
        postCreate:function(){
        	var me=this;
        	//console.log(this);
        	on(me.searchForm, "submit", function(e){
        		//" AND type:'Maps' AND typekeywords:(('Web Map' -Application -Site) OR ('Service' AND 'Data') OR ('Data' AND 'KML))" - POSSIBLE FILTERING
        		var params=this.get("value");
        		if(params.filter=="queryGroups")
        			me.searchWorker.groupQuery(params.q,null, me.targetContainer);
        		else if(params.filter=="queryItems")
        			me.searchWorker.itemQuery(params.q,null, me.targetContainer);
        		else if(params.filter=="queryUsers")
        			me.searchWorker.userQuery(params.q,null, me.targetContainer);
        		e.preventDefault();
        		e.stopPropagation();
        	});
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
        	}
        })
	});	
	return Search;
});