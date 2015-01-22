define(["dojo/_base/declare",'dijit/_WidgetBase',"custom/portal/itemStore", "dojo/on", "dojo/Stateful", "dojo/_base/array", "dojo/_base/lang", 
        "custom/portal/toc", "dgrid/tree", "dojo/store/Memory",  "dojo/store/Observable"], 
		function(declare, _WidgetBase, itemStore, on, Stateful, array, lang,
				portalToc, Tree, Memory, Observable){
	var Search=declare([_WidgetBase],{
        postCreate:function(){
        	var me=this;
        	
        	/*on(me.searchForm, "submit", function(e){
        		var params=this.get("value");
        		me.portal[params.filter]({q:"title:"+params.q+" AND type:'Maps' AND typekeywords:(('Web Map' -Application -Site) OR ('Service' AND 'Data') OR ('Data' AND 'KML))",
        		num:"100", sortFields:"title, avgRating, created, numViews, type"}).then( function(data){
    				console.log(data);
        			var res=new me.results();
        			if(params.filter==="queryGroups"){
        				res.set("folders", data.results);
        				res.getGroupItems();
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
        			me.createSearchResultTab( me.portalSharingUrl, me.searchUrl, res, "\""+ params.q+"\" - Results", me.targetContainer);
        			//console.log([data, res]);
        		});
        		e.preventDefault();
        		e.stopPropagation();
        	});*/
        },
        execute:function(queryString, options, type){
        	/**Function will execute a search and will populate an item store based upon the type of search
        	 * queryString will be the string to search with
        	 * options will be the eventual options search to use when finally reaching the item query
        	 * type will be the type of search to be executed: [GROUP, USER, ITEM]
        	 */
        },
        groupQuery:function(q,opt,target){
        	var me=this;
        	var res=this._initStore(this);
        	this.portal.queryGroups({q:q, num:100, sortFields:"title, avgRating, created, numViews, type"}).then(function(data){
        		res.set("columns", [Tree({label:"Name", field:"title"}),{label:"Type", field:"type"}]);
        		res.set("folders",  array.map(data.results, function(group){
    				group.queryItems({q:q+(opt||""), num:100, sortFields:"title, avgRating, created, numViews, type"}).then(function(items){
    					res.set("items", array.map(items.results, function(item){
    						lang.mixin(item, {parent:group.id, children:null});
    						return item;
    					}));
    				});
    				lang.mixin(group, {parent:null, type:"Group"});
    				return group;
    			}));
    			var mToc=me.createSearchResultContainer(me.portalSharingUrl, res, "\""+q+"\" - Results");
    			target.addChild(mToc);
    		});
        },
        userQuery:function(q, opt, target){
        	
        },
        itemQuery:function(q, opt, target){
        	var res=this._initStore(this), me=this;
        	res.set("columns", [{label:"Name", field:"title"},{label:"Type", field:"type"}]);
        	this.portal.queryItems({q:q+(opt||""), num:100, sortFields:"title, avgRating, created, numViews, type"}).then(function(data){
        		res.set("items", array.map(data.results, function(item){
        			lang.mixin(item, {parent:null, children:null});
        			return item;
        		}));
        		var mToc=me.createSearchResultContainer(me.portalSharingUrl, res, "\""+q+"\" - Results");
    			target.addChild(mToc);
        	});
        },
        _initStore:function(me){
        	var res=new me.results();
    		res.startup();
    		return res;
        },
        createSearchResultContainer:function(portalSharingUrl, result, title){
        	var me=this;
        	var userGridParams={
				store:result.store,
				selectionMode:"single",
				query:{parent:null},
				sort:"title",
				columns:result.get("columns")
			};
			return new portalToc({title:title, gridParams:userGridParams, sharingUrl:portalSharingUrl, closable:true});
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
        	_Store:declare([Memory],{
    			getChildren:function(object){
    				return this.query({parent:object.id})||[];
    			},
    			renderExpando:function(){
    				return false;
    			}
        	}),
        	startup:function(){
        		var me=this;
        		this.store=new Observable(new this._Store({data:[]}));
        		this.watch("items", function(a,b,c){
        			array.forEach(c, function(item){
        				me.store.put({title:item.title, type:item.type, id:item.id.toString(), url:item.itemUrl, parent:item.parent||null, children:item.children||null});
        			});
        		});
        		this.watch("folders", function(a,b,c){
        			array.forEach(c, function(folder){
        				me.store.put({title:folder.title, id:folder.id.toString(), url:folder.url, parent:folder.parent, type:folder.type});
        			});
        		});
        		/*on(this.store, "query", function(data){
        			console.log(data);
        		});*/
        	}
        })
	});	
	return Search;
});