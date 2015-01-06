define(["cmwapi/map/portal/BasemapsAdd", "cmwapi/map/portal/BasemapsSet", "cmwapi/map/portal/SignIn", "cmwapi/map/portal/ItemAdd"],function(BasemapsAdd, BasemapsSet, SignIn, ItemAdd){
	return {
		signIn:SignIn,
		basemaps:{
			add:BasemapsAdd,
			set:BasemapsSet
		},
		item:{
			add:ItemAdd
		}
	};
});