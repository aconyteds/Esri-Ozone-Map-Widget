// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.11/esri/copyright.txt for details.
//>>built
define("esri/toolbars/TextEditor","dojo/_base/declare dojo/_base/lang dojo/_base/connect dojo/_base/event dojo/has dojo/dom-construct dojo/dom-class dojo/dom-style dojo/keys ../kernel".split(" "),function(e,f,b,l,m,n,p,g,k,q){e=e(null,{declaredClass:"esri.toolbars.TextEditor",constructor:function(a,b,c){this._graphic=a;this._map=b;this._toolbar=c;this._enable(this._graphic)},destroy:function(){this._disable()},onEditStart:function(){},onEditEnd:function(){},_enable:function(a){this._editBox?(b.disconnect(this._addEditBoxHandler),
this._addEditBoxHandler=null):(this._map.navigationManager.setImmediateClick(!0),this._addEditBoxHandler=b.connect(a.getLayer(),"onDblClick",this,function(h){this._map.navigationManager.setImmediateClick(!1);h.graphic==a&&(l.stop(h),b.disconnect(this._addEditBoxHandler),this._addEditBoxHandler=null,this._addTextBox(a))}))},_disable:function(){this._applyEdit();this._addEditBoxHandler&&(b.disconnect(this._addEditBoxHandler),this._addEditBoxHandler=null);this._removeTextBox();this.onEditEnd(this._graphic);
this._toolbar.onTextEditEnd(this._graphic)},_addTextBox:function(a,h){if(!this._editBox){var c;a.symbol.text||(a.symbol.text="Tempt text",a.setSymbol(a.symbol),c="");var e=this._createInputTextStyle(a,this._map);""!==c&&(c=h||a.symbol.text);this._editBox=n.create("input",{type:"text",value:c});g.set(this._editBox,e);p.add(this._editBox,"esriTextEditorInput");this._map.container.appendChild(this._editBox);this._editBox.focus();this._editBoxKeyHandler=b.connect(this._editBox,"onkeyup",f.hitch(this,
function(a){(a.keyCode==k.ENTER||a.keyCode===k.TAB)&&this._disable()}));this._editBoxBlurHandler=b.connect(this._editBox,"onblur",f.hitch(this,function(a){this._disable()}));a.symbol.text="";a.setSymbol(a.symbol);a.hide();var d=this._editBox;this._disableBoxHandler||(this._disableBoxHandler=this._map.on("zoom-start",f.hitch(this,function(){this._disable()})));this._moveBoxHandler=this._map.on("pan",function(a){g.set(d,{left:this._editBoxLeft+a.delta.x+"px",top:this._editBoxTop+a.delta.y+"px"})});
this._moveBoxStartHandler=this._map.on("pan-start",function(){this._editBoxLeft=parseFloat(g.get(d,"left"));this._editBoxTop=parseFloat(g.get(d,"top"))});this.onEditStart(a,this._editBox);this._toolbar.onTextEditStart(a,this._editBox)}},_removeTextBox:function(){this._editBoxBlurHandler&&(b.disconnect(this._editBoxBlurHandler),this._editBoxBlurHandler=null);this._editBox&&(this._editBox.parentNode.removeChild(this._editBox),this._editBox=null);this._disableBoxHandler&&(this._disableBoxHandler.remove(),
this._disableBoxHandler=null);this._moveBoxHandler&&(this._moveBoxHandler.remove(),this._moveBoxHandler=null);this._moveBoxStartHandler&&(this._moveBoxStartHandler.remove(),this._moveBoxStartHandler=null);this._editBoxKeyHandler&&(b.disconnect(this._editBoxKeyHandler),this._editBoxKeyHandler=null)},_createInputTextStyle:function(a,b){var c=a.getDojoShape().getTransformedBoundingBox(),e=Math.abs(c[0].x-c[1].x)/Math.cos(a.symbol.angle/180*Math.PI),d=a.symbol.font;return{"font-family":d.family,"font-size":d.size+
"px","font-style":d.style,"font-variant":d.variant,"font-weight":d.weight,left:c[0].x+"px",top:c[0].y+"px",width:e+"px"}},_applyEdit:function(){if(this._editBox)if(this._editBox.value){this._graphic.show();var a=this._graphic.symbol;a.text=this._editBox.value;this._graphic.setSymbol(a)}else this._graphic.getLayer().remove(this._graphic)}});m("extend-esri")&&f.setObject("toolbars.TextEditor",e,q);return e});