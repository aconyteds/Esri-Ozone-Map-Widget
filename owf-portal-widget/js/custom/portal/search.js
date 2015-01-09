define(["dojo/_base/declare",'dijit/_WidgetBase','dijit/_TemplatedMixin','dijit/_WidgetsInTemplateMixin', 'dojo/text!../templates/search.html',
        "dijit/form/Select", "dijit/form/TextBox", "dijit/form/Form", "dijit/form/Button","custom/portal/itemStore", "dojo/on"], 
		function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, searchTemplate,
				Select, TextBox, Form, Button, itemStore, on){
	var Search=declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin],{
		widgetsInTemplate: true,
        templateString: searchTemplate,
        postCreate:function(){
        	var me=this;
        	on(me.searchForm, "submit", function(e){
        		var params=this.get("value");
        		me.portal[params.filter]({q:params.q, num:"100"}).then(function(data){
        			console.log(data);
        		});
        		e.preventDefault();
        		e.stopPropagation();
        	});
        }
	});	
	return Search;
});