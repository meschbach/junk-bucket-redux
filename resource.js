
const { STATE_LOADED, STATE_LOADING, STATE_CREATING, STATE_CREATED } = require("./common");

const initialState = {};

function isLoading(state){ return state.state === STATE_LOADING; }
function isLoaded(state){ return state.state === STATE_LOADED; }

const NOT_LOADABLE_STATES = [STATE_CREATING, STATE_CREATED, STATE_LOADED, STATE_LOADING];
function shouldLoad( state ){
	return !NOT_LOADABLE_STATES.includes(state.state);
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
}

module.exports = {
	resource,
	isLoaded,
	isLoading,
	shouldLoad,
	selectEntity
};
