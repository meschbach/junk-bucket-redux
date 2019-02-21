
const {
	isItemLoading,
	isItemLoaded,
	isCollectionLoading,
	isCollectionLoaded,
	resourceCollection
} = require("./collection");

const TEST_INIT_ACTION = {type: "@@iniitalize"};

describe( "Given a resource collection", function(){
	describe("When no actions have been performed against it", function(){
		const {reducer, selectItem } = resourceCollection("test-collection");
		const state = reducer( undefined, TEST_INIT_ACTION);

		test("Then the entire collection is unloaded", function(){
			expect(isCollectionLoaded(state)).toBeFalsy();
		});
		test("Then the entire collection is not loading", function(){
			expect(isCollectionLoading(state)).toBeFalsy();
		});

		test("Then a specific item is unavailable", function(){
			expect(selectItem(state, "example")).toBeFalsy();
		});

		test("Then a specific item is not loaded", function(){
			expect(isItemLoaded(state, "example")).toBeFalsy();
		});
	});

	describe("When an item is loaded",function(){
		const {reducer, loadedItem, selectItem } = resourceCollection("check-it");
		const entity = {id: 0, water:"inland"};
		const state0 = reducer( undefined, TEST_INIT_ACTION );
		const state1 = reducer( state0, loadedItem(entity));

		test("Then the entire collection is unloaded", function(){
			expect(isCollectionLoaded(state1)).toBeFalsy();
		});
		test("Then the entire collection is not loading", function(){
			expect(isCollectionLoading(state1)).toBeFalsy();
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
		const state0 = reducer( undefined, TEST_INIT_ACTION);
		const state1 = reducer( state0, loadingItem( id ));

		test("The entire collection is not loaded", function(){
			expect(isCollectionLoaded(state1)).toBeFalsy();
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
		const state0 = reducer( undefined, TEST_INIT_ACTION );
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