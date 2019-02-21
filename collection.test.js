
function isLoading() {}
function isLoaded() {}

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
		reducer
	};
}

function isItemLoading( state, id ){
	const itemEnvelope = state.items[id] || {};
	return itemEnvelope.state === STATE_LOADING;
}
function isItemLoaded( state, id){
	const itemEnvelope = state.items[id];
	if( !itemEnvelope ){ return false; }
	return true;
}

function isCollectionLoading( state, id ){
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

const TEST_INIT_ACTION = {type: "@@iniitalize"};

const STATE_LOADED = "loaded";
const STATE_LOADING = "loading";
const INIT_STATE = { items: {} };

describe( "Given a resource collection", function(){
	describe("When no actions have been performed against it", function(){
		const {reducer} = resourceCollection("test-collection");
		const state = reducer( undefined, TEST_INIT_ACTION);

		test("Then the entire collection is unloaded", function(){
			expect(isLoaded(state)).toBeFalsy();
		});
		test("Then the entire collection is not loading", function(){
			expect(isLoading(state)).toBeFalsy();
		});

		test("Then a specific item is unavailable", function(){
			expect(selectItem(state, "example")).toBeFalsy();
		});

		test("Then a specific item is not loaded", function(){
			expect(isItemLoaded(state, "example")).toBeFalsy();
		});
	});

	describe("When an item is loaded",function(){
		const {reducer, loadedItem } = resourceCollection("check-it");
		const entity = {id: 0, water:"inland"};
		const state0 = reducer( undefined, INIT_STATE);
		const state1 = reducer( state0, loadedItem(entity));

		test("Then the entire collection is unloaded", function(){
			expect(isLoaded(state1)).toBeFalsy();
		});
		test("Then the entire collection is not loading", function(){
			expect(isLoading(state1)).toBeFalsy();
		});

		test("Then the item is loaded", function(){
			expect(isItemLoaded( state1, 0)).toBeTruthy();
		});

		test("Then the item can be retrieved", function () {
			expect(selectItem(state1, 0)).toEqual(entity);
		});
	});

	describe("When an item is loading", function(){
		const {reducer, loadingItem, loadedItem } = resourceCollection("gated");
		const id = 2895;
		const entity = {id, flight:"delayed"};
		const state0 = reducer( undefined, INIT_STATE);
		const state1 = reducer( state0, loadingItem( id ));

		test("The entire collection is not loaded", function(){
			expect(isLoaded(state1)).toBeFalsy();
		});

		test("The item in question is loading", function(){
			expect(isItemLoading(state1, id)).toBeTruthy();
		});
		
		describe("And the item is loaded", function(){
			const state2 = reducer( state1, loadedItem(entity) );
			
			test("Then the item is loaded", function () {
				expect(isItemLoaded(state2, id)).toBeTruthy();
			})
		});
	});

	describe("When the collection is loading", function(){
		const { reducer, loadingCollection, loadedItemIDs, loadedCollection } = resourceCollection("hearting");
		const state0 = reducer( undefined, INIT_STATE);
		const state1 = reducer( state0, loadingCollection());

		test("Then is loading the collection", function(){
			expect(isCollectionLoading(state1)).toBeTruthy();
		});

		describe("And has finished loading the IDs", function () {
			const ids = [56,26,13,2];
			const state2 = reducer(state1, loadedItemIDs( ids ));

			test("Then the collection is loaded", function(){
				expect(isCollectionLoaded(state2)).toBeTruthy();
			});
		});

		describe("And the collection is loaded", function(){
			const state2 = reducer( state0, loadedCollection([]));

			test("Then the collection is loaded", function(){
				expect(isCollectionLoaded(state2)).toBeTruthy();
			});
		});
	});
});

const {combineReducers} = require("redux");

describe("Given two collections", function(){
	const collection0 = resourceCollection("sunbelt");
	const collection1 = resourceCollection("prestege");
	const rootReducer = combineReducers({c0: collection0.reducer, c1: collection1.reducer});
	const state0 = rootReducer( undefined, TEST_INIT_ACTION);

	describe("When one is loaded", function () {
		const state1 = rootReducer( state0, collection0.loadedCollection([{id:0},{id:1}]) );

		test("Then the collection is loaded", function(){
			expect(isCollectionLoaded(state1.c0)).toBeTruthy();
		});

		test("Then the other is not", function(){
			expect(isCollectionLoaded(state1.c1)).toBeFalsy();
		});
	});
});