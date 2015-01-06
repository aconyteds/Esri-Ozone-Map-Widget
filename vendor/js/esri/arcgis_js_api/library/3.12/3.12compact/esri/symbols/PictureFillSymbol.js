// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.12/esri/copyright.txt for details.
//>>built
define("esri/symbols/PictureFillSymbol","dojo/_base/declare dojo/_base/lang dojo/sniff dojox/gfx/_base ../kernel ../lang ../urlUtils ./FillSymbol".split(" "),function(e,g,l,d,m,n,p,q){var k={xoffset:0,yoffset:0,width:12,height:12};e=e(q,{declaredClass:"esri.symbol.PictureFillSymbol",type:"picturefillsymbol",xscale:1,yscale:1,xoffset:0,yoffset:0,constructor:function(a,b,c,f){a?g.isString(a)?(this.url=a,void 0!==b&&(this.outline=b),void 0!==c&&(this.width=c),void 0!==f&&(this.height=f)):(this.xoffset=
d.pt2px(a.xoffset),this.yoffset=d.pt2px(a.yoffset),this.width=d.pt2px(a.width),this.height=d.pt2px(a.height),b=a.imageData,!(9>l("ie"))&&b&&(c=this.url,this.url="data:"+(a.contentType||"image")+";base64,"+b,this.imageData=c)):(g.mixin(this,k),this.width=d.pt2px(this.width),this.height=d.pt2px(this.height))},setWidth:function(a){this.width=a;return this},setHeight:function(a){this.height=a;return this},setOffset:function(a,b){this.xoffset=a;this.yoffset=b;return this},setUrl:function(a){a!==this.url&&
(delete this.imageData,delete this.contentType);this.url=a;return this},setXScale:function(a){this.xscale=a;return this},setYScale:function(a){this.yscale=a;return this},getStroke:function(){return this.outline&&this.outline.getStroke()},getFill:function(){return g.mixin({},d.defaultPattern,{src:this.url,width:this.width*this.xscale,height:this.height*this.yscale,x:this.xoffset,y:this.yoffset})},getShapeDescriptors:function(){return{defaultShape:{type:"path",path:"M -10,-10 L 10,0 L 10,10 L -10,10 L -10,-10 E"},
fill:this.getFill(),stroke:this.getStroke()}},toJson:function(){var a=this.url,b=this.imageData;if(0===a.indexOf("data:"))var c=a,a=b,b=c.indexOf(";base64,")+8,b=c.substr(b);if(g.isString(a)&&(0===a.indexOf("/")||0===a.indexOf("//")||0===a.indexOf("./")||0===a.indexOf("../")))a=p.getAbsoluteUrl(a);var c=d.px2pt(this.width),c=isNaN(c)?void 0:c,f=d.px2pt(this.height),f=isNaN(f)?void 0:f,e=d.px2pt(this.xoffset),e=isNaN(e)?void 0:e,h=d.px2pt(this.yoffset),h=isNaN(h)?void 0:h,a=n.fixJson(g.mixin(this.inherited("toJson",
arguments),{type:"esriPFS",url:a,imageData:b,contentType:this.contentType,width:c,height:f,xoffset:e,yoffset:h,xscale:this.xscale,yscale:this.yscale}));a.imageData||delete a.imageData;return a}});e.defaultProps=k;l("extend-esri")&&(g.setObject("symbol.PictureFillSymbol",e,m),m.symbol.defaultPictureFillSymbol=k);return e});