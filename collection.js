
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

function selectResource( state, id ){
	return Object.assign({}, state.items[id], {id});
}

function resourceCollection( name ){
	const ACTION_ITEM_LOADED = name + ".item-loaded";
	const ACTION_ITEM_LOADING = name + ".item-loading";
	const ACTION_COLLECTION_LOADING = name + ".collection-loading";
	const ACTION_COLLECTION_LOADED = name + ".collection-loaded";
	const ACTION_COLLECTION_IDS_LOADED = name + ".collection-loaded.ids";
	const ACTION_COLLECTION_CREATING = name + ".item-creating";
	const ACTION_ITEM_CREATED = name + ".item-created";

	function loadedItem( id, entity ) {
		return {
			type: ACTION_ITEM_LOADED,
			id: id,
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
				const itemID = action.id;
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
				state = Object.assign({}, state, {state: STATE_LOADED})
			}   break;
			case ACTION_COLLECTION_CREATING: {
				const itemID = action.id;
				const updatedState = {state: STATE_CREATING, entity: action.item };
				const itemIDChange = {};
				itemIDChange[itemID] = updatedState;
				const newItemState = Object.assign({}, state.items, itemIDChange);
				state = Object.assign({}, state, {items: newItemState});
			}
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
		selectItem,
		query: {
			selectItem,
			selectResource,
			selectItems: (state) => state.items,
			ids: (state) => Object.keys(state.items),
			shouldLoad: (state) => shouldLoad(state),
			isLoading: (state) => isLoading(state)
		},
		actions: {
			create: (id, item) => {
				return {
					type: ACTION_COLLECTION_CREATING,
					id,
					item
				}
			},
			created: (id) => {
				return {
					type: ACTION_ITEM_CREATED,
					id
				}
			},
			loadedItem: loadedItem,
			loadingItem: loadingItem,
			loading: loadingCollection,
			loaded: loadedCollection
		}
	};
}

module.exports = {
	isItemLoading, isItemLoaded,
	isCollectionLoading, isCollectionLoaded,
	selectItem,
	resourceCollection
};
