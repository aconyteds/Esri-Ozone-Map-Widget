// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.12/esri/copyright.txt for details.
//>>built
define("esri/dijit/geoenrichment/EnrichConfig","../../declare dojo/_base/lang dojo/dom-class ./_Wizard ../../tasks/geoenrichment/EnrichParameters ../../tasks/geoenrichment/RingBuffer ./EnrichOptionsPage ./DataBrowser dojo/i18n!../../nls/jsapi".split(" "),function(l,f,m,n,p,q,r,s,g){return l("esri.dijit.geoenrichment.EnrichConfig",[n],{enrichParams:null,geomType:null,fields:null,fieldsMap:null,allowNewColumns:!0,allowFieldTypeMismatch:!1,studyAreaCount:null,showBackButton:!0,title:g.geoenrichment.dijit.EnrichConfig.title,
_nextButton:null,_dataCollections:null,_eventMap:{back:!0,finish:["params","fieldsMap","dataCollections"]},selectedIDs:null,constructor:function(){this.selectedIDs=[]},startup:function(){this.inherited(arguments);this.enrichParams||(this.enrichParams=new p);this.enrichParams.studyAreaOptions=new q;m.add(this.domNode,"EnrichConfig");var b=this.pages.d=new s({countryID:this.enrichParams.countryID,countryBox:!0,multiSelect:!0,okButton:g.geoenrichment.dijit.WizardButtons.next,title:this.title});b.on("back,cancel",
f.hitch(this,this._onBack));b.on("ok",f.hitch(this,this._applyVariables));this._loadDataBrowser()},_onDataCollectionSelect:function(){var b=!1,c=this.pages.d.get("selection"),a;for(a in c)if(c[a]){b=!0;break}this._nextButton.disabled=!b},_loadDataBrowser:function(){this.pages.d.set("selection",this.selectedIDs);this.loadPage("d")},_applyVariables:function(){this._dataCollections=this.pages.d.dataCollections[this.enrichParams.countryID];this.pages.o||(this.pages.o=new r({buffer:this.enrichParams.studyAreaOptions,
geomType:this.geomType,fields:this.fields,allowNewColumns:this.allowNewColumns,allowFieldTypeMismatch:this.allowFieldTypeMismatch,studyAreaCount:this.studyAreaCount,onBack:f.hitch(this,function(){this.fieldsMap=this.pages.o.get("fieldsMap");this._loadDataBrowser()}),onFinish:f.hitch(this,this._finish)}));this.pages.o.set("dataCollections",this._dataCollections);for(var b=this.fieldsMap||{},c={},a=this.selectedIDs=this.pages.d.get("selection"),e=0;e<a.length;e++){var d=a[e];c[d]=b[d]||""}this.fieldsMap=
c;this.pages.o.set("fieldsMap",c);this.loadPage("o")},_onBack:function(){this.onBack()},onBack:function(){},_finish:function(){this.enrichParams.countryID=this.pages.d.get("countryID");this.enrichParams.studyAreaOptions=this.pages.o.get("buffer");var b=this.fieldsMap=this.pages.o.get("fieldsMap"),c=[];this.enrichParams.variables=[];for(var a,e=0;e<this._dataCollections.length;e++){var d=this._dataCollections[e],g=!0,h=[];for(a=0;a<d.variables.length;a++){var k=d.id+"."+d.variables[a].id;f.isString(b[k])?
h.push(k):g=!1}if(g)this.enrichParams.variables.push(d.id+".*"),c.push(d);else if(0<h.length){for(a=0;a<h.length;a++)this.enrichParams.variables.push(h[a]);c.push(d)}}this.onFinish(this.enrichParams,b,c)},onFinish:function(b,c,a){}})});