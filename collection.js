
const INIT_STATE = { items: {} };

const { STATE_LOADING, STATE_LOADED } = require("./common");

/**
 * Query to determine if the an element by the given ID is loaded.
 *
 * @param state redux state to be queried
 * @param id ID for the element to be queried
 * @returns {boolean} true if loading, otherwise false
 */
function isItemLoading( state, id ){
	const itemEnvelope = state.items[id] || {};
	return itemEnvelope.state === STATE_LOADING;
}

function isItemLoaded( state, id){
	const itemEnvelope = state.items[id];
	if( !itemEnvelope ){ return false; }
	return true;
}

function isCollectionLoading( state ){
	if( state.state === STATE_LOADING ) return true;
	return false;
}

function isCollectionLoaded( state ) {
	if( state.state === STATE_LOADED ) return true;
	return false;
}

function selectItem( state, id ){
	const item = state.items[id];
	if( !item ) { return ;}
	return item.entity;
}

function resourceCollection( name ){
	const ACTION_ITEM_LOADED = name + ".item-loaded";
	const ACTION_ITEM_LOADING = name + ".item-loading";
	const ACTION_COLLECTION_LOADING = name + ".collection-loading";
	const ACTION_COLLECTION_LOADED = name + ".collection-loaded";
	const ACTION_COLLECTION_IDS_LOADED = name + ".collection-loaded.ids";

	function loadedItem( entity ) {
		return {
			type: ACTION_ITEM_LOADED,
			entity: entity
		}
	}

	function loadingItem( id ){
		return { type: ACTION_ITEM_LOADING,  id };
	}

	function loadingCollection(){
		return { type: ACTION_COLLECTION_LOADING };
	}

	function loadedItemIDs( ids ){
		return { type: ACTION_COLLECTION_IDS_LOADED, ids }
	}

	function loadedCollection( items ){
		return {
			type: ACTION_COLLECTION_LOADED,
			items
		};
	}

	function reducer( state = INIT_STATE, action ){
		switch (action.type) {
			case ACTION_ITEM_LOADED: {
				const itemID = action.entity.id;
				const updatedState = {state: STATE_LOADED, entity: action.entity };
				const itemIDChange = {};
				itemIDChange[itemID] = updatedState;
				const newItemState = Object.assign({}, state.items, itemIDChange);
				state = Object.assign({}, state, {items: newItemState});
			}	break;
			case ACTION_ITEM_LOADING: {
				const itemID = action.id;
				const updatedState = {state: STATE_LOADING};
				const itemIDChange = {};
				itemIDChange[itemID] = updatedState;
				const newItemState = Object.assign({}, state.items, itemIDChange);
				state = Object.assign({}, state, {items: newItemState});
			}	break;
			case ACTION_COLLECTION_LOADING: {
				state = Object.assign({}, state, {state: STATE_LOADING});
			}	break;
			case ACTION_COLLECTION_IDS_LOADED: {
				const itemIDChanged = action.ids.reduce(function (result, item) {
					result[item] = { state: STATE_LOADED, entity: {id: item} };
					return result;
				}, {});
				const newItemState = Object.assign({}, state.items, itemIDChanged);
				state = Object.assign({}, state, {state: STATE_LOADED, items: newItemState});
			}   break;
			case ACTION_COLLECTION_LOADED: {
				const items = action.items.reduce(function (result, entity) {
					result[entity.id] = { state: STATE_LOADED, entity };
					return result;
				}, {});
				state = Object.assign({}, state, {state: STATE_LOADED, items})
			}   break;
		}
		return state;
	}

	return {
		loadedItem,
		loadingItem,
		loadedItemIDs,
		loadingCollection,
		loadedCollection,
		reducer,
		selectItem
	};
}

module.exports = {
	isItemLoading, isItemLoaded,
	isCollectionLoading, isCollectionLoaded,
	selectItem,
	resourceCollection
};
