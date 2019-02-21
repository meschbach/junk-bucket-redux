
const { STATE_LOADED, STATE_LOADING } = require("./common");

const initialState = {};

function isLoading(state){
	return state.state === STATE_LOADING;
}

function isLoaded(state){
	return state.state === STATE_LOADED;
}

function shouldLoad( state ){
	return !( isLoading(state) || isLoaded(state) );
}

function selectEntity( state ){
	return state.entity;
}

function resource( actionPrefix, dispatch, onLoad ){
	const ACTION_LOADING = actionPrefix + ".loading";
	const ACTION_LOADED = actionPrefix + ".loaded";

	function loadedEntity( entity ){ return {type: ACTION_LOADED, entity} }
	function loading(){ return {type: ACTION_LOADING} }

	return {
		load: function( momento ){
			dispatch(loading());
			const promise = onLoad( momento );
			if( promise.then ){
				promise.then(function( result ){
					dispatch(loadedEntity(result));
				}, function(error){
					console.log("Promise rejected: ", error);
				});
			}
		},
		loading,
		loadedEntity,
		reducer: function ( state = initialState, action) {
			switch( action.type ){
				case ACTION_LOADING:
					state = Object.assign({}, state, {state: STATE_LOADING });
					break;
				case ACTION_LOADED:
					state = Object.assign({}, state, {state: STATE_LOADED, entity: action.entity });
					break;
			}
			return state;
		}
	};
	return self;
}

module.exports = {
	resource,
	isLoaded,
	isLoading,
	shouldLoad,
	selectEntity
};
