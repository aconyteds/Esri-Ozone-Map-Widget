// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.12/esri/copyright.txt for details.
//>>built
require({cache:{"url:esri/dijit/VisibleScaleRangeSlider/templates/ScaleMenu.html":'\x3cdiv class\x3d"${baseClass}"\x3e\n  \x3cdiv class\x3d"${baseClass}Header"\x3e\n    \x3cdiv data-dojo-attach-point\x3d"dap_currentScaleLabel" class\x3d"${baseClass}Item"\x3e\x3c/div\x3e\n    \x3cdiv id\x3d"${id}_scaleInput" data-dojo-attach-point\x3d"dap_scaleInput" data-dojo-type\x3d"dijit/form/TextBox"\x3e\x3c/div\x3e\n    \x3cdiv data-dojo-type\x3d"dijit/Tooltip" data-dojo-props\x3d"connectId:\'${id}_scaleInput\'"\x3e${labels.customScaleInputTooltip}\x3c/div\x3e\n  \x3c/div\x3e\n  \x3chr/\x3e\n  \x3col data-dojo-attach-point\x3d"dap_recommendedScales" class\x3d"${baseClass}List"\x3e\n    \x3cli data-dojo-attach-point\x3d"dap_currentScaleItem" class\x3d"${baseClass}Item ${baseClass}Selectable"\x3e\x3c/li\x3e\n    \x3c!--additional list items added dynamically--\x3e\n  \x3c/ol\x3e\n\x3c/div\x3e\n'}});
define("esri/dijit/VisibleScaleRangeSlider/ScaleMenu","../../domUtils ../../kernel dijit/_TemplatedMixin dijit/_WidgetBase dijit/_WidgetsInTemplateMixin dojo/_base/declare dojo/_base/array dojo/_base/lang dojo/dom-construct dojo/dom-prop dojo/has dojo/keys dojo/number dojo/on dojo/query dojo/string dojox/lang/functional/object dojo/i18n!../../nls/jsapi dojo/text!./templates/ScaleMenu.html dijit/form/TextBox".split(" "),function(f,m,b,n,p,q,r,e,s,g,t,u,h,k,v,l,w,x,y){b=q([n,b,p],{declaredClass:"esri.dijit.VisibleScaleRangeSlider.ScaleMenu",
templateString:y,baseClass:"esriScaleMenu",labels:x.visibleScaleRangeSlider,_recommendedScales:{world:1E8,continent:5E7,countriesBig:25E6,countriesSmall:12E6,statesProvinces:6E6,stateProvince:3E6,counties:15E5,county:75E4,metropolitanArea:32E4,cities:16E4,city:8E4,town:4E4,neighborhood:2E4,streets:1E4,street:5E3,buildings:2500,building:1250},_elementValueMap:null,_elements:null,_scaleRangeCategories:null,_originalScaleInputValue:null,buildRendering:function(){this.inherited(arguments);var a=this.labels.featuredScaleLabels,
c=this._recommendedScales,z=this.baseClass+"Item "+this.baseClass+"Selectable",b;r.forEach(w.keys(c),function(d){b=a[d];d=l.substitute(b,{scaleLabel:this._formatScale(c[d])});s.create("li",{innerHTML:d,className:z},this.dap_recommendedScales)},this)},_formatScale:function(a){return"1:"+h.format(a,{fractional:!1})},postCreate:function(){this.inherited(arguments);k(this.domNode,k.selector("."+this.baseClass+"Item."+this.baseClass+"Selectable","click"),e.hitch(this,function(a){this.emit("scale-selected",
{scale:this._parseScale(a.target.innerHTML)})}));this.dap_scaleInput.on("keyDown",e.hitch(this,function(a){a.keyCode===u.ENTER&&this._handleCustomScaleInput()}))},_handleCustomScaleInput:function(){var a=this._parseScale(this.dap_scaleInput.get("value"));a!==this._originalScaleInputValue&&(isNaN(a)||this.emit("scale-selected",{scale:a}))},_parseScale:function(a){a=a.replace(/.*\(/,"").replace(/\).*$/,"").replace(/.*1:/,"");return h.parse(a)},_setCurrentScaleAttr:function(a){var c=this._formatScale(a.scale);
g.set(this.dap_currentScaleLabel,"innerHTML",a.label);this.dap_scaleInput.set("value",c,!1);this._originalScaleInputValue=c;c=l.substitute(this.labels.featuredScaleLabels.current,{scaleLabel:this._formatScale(a.mapScale)});g.set(this.dap_currentScaleItem,"innerHTML",c);this._hideOutOfScaleRanges(a.ranges)},_hideOutOfScaleRanges:function(a){var c;v("."+this.baseClass+"Item."+this.baseClass+"Selectable",this.dap_recommendedScales).forEach(function(b){b!==this.dap_currentScaleItem&&(c=this._parseScale(b.innerHTML),
a.contains(c)?f.show(b):f.hide(b))},this)}});t("extend-esri")&&e.setObject("dijit.ScaleMenu",b,m);return b});