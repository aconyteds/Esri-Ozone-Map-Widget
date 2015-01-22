define(["dojo/_base/declare", "dojo/store/Memory", "dojo/Stateful", "dojo/store/Observable", "dojo/_base/array"],
		function(declare, Memory, Stateful, Observable, array){
	var store=function(items, folders){		
		this._itemContainer=declare([Stateful],{
			folders:[],
			_foldersGetter:function(){
				return this.folders;
			},
			_foldersSetter:function(arr){
				this.folders=this.folders.concat(arr);
			},
			items:[],
			_itemsGetter:function(){
				return this.items;
			},
			_itemsSetter:function(arr){
				this.items=this.items.concat(arr);
			}
		});
        this._createStore=function(items, folders){
			var structure=new this._itemContainer({
				folders:folders,
				items:[]
			});
			var mStore=new Observable(new this._Store({data:[]}));
			structure.watch("items", function(name, oldV, newV){
				array.forEach(newV, function(item){
					mStore.put({title:item.title, type:item.type, id:item.id.toString(), url:item.itemUrl, parent:item.folderId||null, children:null});
				});
			});
			structure.set("items", items);
			array.forEach(folders, function(folder){
				mStore.put({title: folder.title, id:folder.id.toString(), url:folder.url, type:"directory"});
				folder.getItems().then(function(items){
					structure.set("items", items);
				});				
			});
			mStore.startup();
			return mStore;
		}
		this._Store=declare([Memory],{
			_connects:[],
			_queries:[],
			getChildren:function(object){
				return this.query({parent:object.id})||[];
			},
			renderExpando:function(){
				return false;
			},
			startup:function(){
				
			}
		});
		return this._createStore(items, folders);
	}
	return store;
});