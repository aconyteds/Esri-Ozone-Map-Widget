//>>built
require({cache:{"url:dijit/form/templates/DropDownButton.html":'\x3cspan class\x3d"dijit dijitReset dijitInline"\n\t\x3e\x3cspan class\x3d\'dijitReset dijitInline dijitButtonNode\'\n\t\tdata-dojo-attach-event\x3d"ondijitclick:__onClick" data-dojo-attach-point\x3d"_buttonNode"\n\t\t\x3e\x3cspan class\x3d"dijitReset dijitStretch dijitButtonContents"\n\t\t\tdata-dojo-attach-point\x3d"focusNode,titleNode,_arrowWrapperNode,_popupStateNode"\n\t\t\trole\x3d"button" aria-haspopup\x3d"true" aria-labelledby\x3d"${id}_label"\n\t\t\t\x3e\x3cspan class\x3d"dijitReset dijitInline dijitIcon"\n\t\t\t\tdata-dojo-attach-point\x3d"iconNode"\n\t\t\t\x3e\x3c/span\n\t\t\t\x3e\x3cspan class\x3d"dijitReset dijitInline dijitButtonText"\n\t\t\t\tdata-dojo-attach-point\x3d"containerNode"\n\t\t\t\tid\x3d"${id}_label"\n\t\t\t\x3e\x3c/span\n\t\t\t\x3e\x3cspan class\x3d"dijitReset dijitInline dijitArrowButtonInner"\x3e\x3c/span\n\t\t\t\x3e\x3cspan class\x3d"dijitReset dijitInline dijitArrowButtonChar"\x3e\x26#9660;\x3c/span\n\t\t\x3e\x3c/span\n\t\x3e\x3c/span\n\t\x3e\x3cinput ${!nameAttrSetting} type\x3d"${type}" value\x3d"${value}" class\x3d"dijitOffScreen" tabIndex\x3d"-1"\n\t\tdata-dojo-attach-event\x3d"onclick:_onClick"\n\t\tdata-dojo-attach-point\x3d"valueNode" role\x3d"presentation" aria-hidden\x3d"true"\n/\x3e\x3c/span\x3e\n'}});
define("dijit/form/DropDownButton","dojo/_base/declare dojo/_base/lang dojo/query ../registry ../popup ./Button ../_Container ../_HasDropDown dojo/text!./templates/DropDownButton.html ../a11yclick".split(" "),function(c,d,b,e,f,g,h,k,l){return c("dijit.form.DropDownButton",[g,h,k],{baseClass:"dijitDropDownButton",templateString:l,_fillContent:function(){if(this.srcNodeRef){var a=b("*",this.srcNodeRef);this.inherited(arguments,[a[0]]);this.dropDownContainer=this.srcNodeRef}},startup:function(){if(!this._started){if(!this.dropDown&&
this.dropDownContainer){var a=b("[widgetId]",this.dropDownContainer)[0];a&&(this.dropDown=e.byNode(a));delete this.dropDownContainer}this.dropDown&&f.hide(this.dropDown);this.inherited(arguments)}},isLoaded:function(){var a=this.dropDown;return!!a&&(!a.href||a.isLoaded)},loadDropDown:function(a){var b=this.dropDown,c=b.on("load",d.hitch(this,function(){c.remove();a()}));b.refresh()},isFocusable:function(){return this.inherited(arguments)&&!this._mouseDown}})});