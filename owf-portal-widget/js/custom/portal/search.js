define(["dojo/_base/declare",'dijit/_WidgetBase', "dojo/on", "dojo/Stateful", "dojo/_base/array", "dojo/_base/lang", 
        "custom/portal/toc", "dgrid/tree", "dojo/store/Memory",  "dojo/store/Observable"], 
		function(declare, _WidgetBase,  on, Stateful, array, lang,
				portalToc, Tree, Memory, Observable){
	var Search=declare([_WidgetBase],{
		/**Functions will execute a search and will populate an item store based upon the type of search
    	 * queryString will be the string to search with
    	 * options will be the eventual options search to use when finally reaching the item query
    	 * target will be the location to append the result TOC to
    	 * types  of search to be executed: [GROUP, USER, ITEM]
    	 */
		_maxTitleLength:20,
		postMixInProperties:function(params){
			this._maxTitleLength=this.maxTitleLength;
		},
        groupQuery:function(q,opt,target,title){
        	//Exectues a query for groups and returns items belonging to that group in a tree like fashion
        	title=title?title:{str:"\""+q+"\" - Results", length:this._maxTitleLength};
        	var me=this, res=this._initStore(this);
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
    			var mToc=me._createSearchResultContainer(me.portalSharingUrl, res, me._truncateText(title.str, title.length));
    			target.addChild(mToc);
    		});
        },
        userQuery:function(q, opt, target, title){
        	title=title?title:{str:"\""+q+"\" - Results", length:this._maxTitleLength};
        	var me=this, res=this._initStore(this);
        	this.portal.queryUsers({q:q, num:100, sortFields:"title, avgRating, created, numViews, type"}).then(function(data){
        		//data=users; we want folders and items, then we want items for folders
        		res.set("columns", [Tree({label:"Name", field:"title"}),{label:"Type", field:"type"}]);
        		res.set("folders",  array.map(data.results, function(user){
        			user.getContent().then(function(userData){
        				res.set("folders", array.map(userData.folders, function(folder){
        					folder.getItems().then(function(items){
        						res.set("items", array.map(items, function(item){
        							lang.mixin(item, {parent:item.folderId, children:null});
        							return item;
        						}));
        					});
        					lang.mixin(folder, {parent:user.username, type:"Folder"});
        					return folder;
        				}));
        				res.set("items", array.map(userData.items, function(item){
        					lang.mixin(item, {parent:user.username, children:null});
        					return item;
        				}));
        			});
        			return {title:user.fullName, id:user.username, type:"User", url:user.userContentUrl, parent:null};
        		}));
        		var mToc=me._createSearchResultContainer(me.portalSharingUrl, res, me._truncateText(title.str, title.length));
    			target.addChild(mToc);
        	});
        },
        itemQuery:function(q, opt, target, title){
        	//Returns a list of items given a search string
        	title=title?title:{str:"\""+q+"\" - Results", length:this._maxTitleLength};
        	var me=this, res=this._initStore(this);
        	res.set("columns", [{label:"Name", field:"title"},{label:"Type", field:"type"}]);
        	this.portal.queryItems({q:q+(opt||""), num:100, sortFields:"title, avgRating, created, numViews, type"}).then(function(data){
        		res.set("items", array.map(data.results, function(item){
        			lang.mixin(item, {parent:null, children:null});
        			return item;
        		}));
        		var mToc=me._createSearchResultContainer(me.portalSharingUrl, res, me._truncateText(title.str, title.length));
    			target.addChild(mToc);
        	});
        },
        _createSearchResultContainer:function(portalSharingUrl, result, title){
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
        _results:declare([Stateful],{
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
        }),
        _initStore:function(me){
        	var res=new me._results();
    		res.startup();
    		return res;
        },
        _truncateText:function(str, length){
			if(str.length>length){
				str=str.substring(0,length)+"...";
			}
			return str;
		}        
	});	
	return Search;
});