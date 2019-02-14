
const STATE_LOADED = "loaded";
const STATE_LOADING = "loading";

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

function resource( actionPrefix ){
	const ACTION_LOADING = actionPrefix + ".loading";
	const ACTION_LOADED = actionPrefix + ".loaded";

	return {
		loading: function(){ return {type: ACTION_LOADING} },
		loadedEntity: function( entity ){
			return {type: ACTION_LOADED, entity}
		},
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
