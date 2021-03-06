
const {
	isItemLoading,
	isItemLoaded,
	isCollectionLoading,
	isCollectionLoaded,
	resourceCollection
} = require("./collection");
const {
	STATE_CREATING,
	STATE_LOADED,
	STATE_CREATED
} = require("./common");

const TEST_INIT_ACTION = {type: "@@iniitalize"};

describe( "Given a resource collection", function(){
	describe("When no actions have been performed against it", function(){
		const testCollection = resourceCollection("test-collection");
		const {selectItem} = testCollection.query;
		const state = testCollection.reducer( undefined, TEST_INIT_ACTION);

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

		test("Then items are not loading", function(){
			expect(isItemLoading(state, "don't worry")).toBeFalsy();
		})
	});

	describe("When an item is loaded",function(){
		const checkIt = resourceCollection("check-it");
		const {loadedItem} = checkIt.actions;
		const {selectItem} = checkIt.query;
		const id = 0;
		const entity = {id: 0, water:"inland"};
		const state0 = checkIt.reducer( undefined, TEST_INIT_ACTION );
		const state1 = checkIt.reducer( state0, loadedItem(id, entity));

		test("Then the entire collection is unloaded", function(){
			expect(isCollectionLoaded(state1)).toBeFalsy();
		});
		test("Then the entire collection is not loading", function(){
			expect(isCollectionLoading(state1)).toBeFalsy();
		});

		test("Then the item is loaded", function(){
			expect(isItemLoaded( state1, id)).toBeTruthy();
		});

		test("Then the item can be retrieved", function () {
			expect(selectItem(state1, id)).toEqual(entity);
		});
	});

	describe("When an item is loading", function(){
		const gated = resourceCollection("gated");
		const {reducer, loadingItem } = resourceCollection("gated");
		const {loadedItem} = gated.actions;
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
			const state2 = reducer( state1, loadedItem(id, entity) );
			
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

	describe("When creating an item", function () {
		const how = resourceCollection("long");
		const id = 455;
		const exampleItem = {picture:true};
		const state0 = how.reducer(undefined,how.actions.create(id, exampleItem));

		test("Then the resource is in the creating state", function(){
			expect(how.query.selectResource(state0,id).state).toEqual(STATE_CREATING);
		});

		test("Then the entity is available", function(){
			expect(how.query.selectItem(state0,id)).toEqual(exampleItem);
		});

		describe("When the item is created", function () {
			const state1 = how.reducer(state0,how.actions.created(id));

			test("Then the resource is loaded", function(){
				expect(how.query.selectResource(state1,id).state).toEqual(STATE_CREATED);
			});

			test("Then the entity is available", function(){
				expect(how.query.selectItem(state1,id)).toEqual(exampleItem);
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