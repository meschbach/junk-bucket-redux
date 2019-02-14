
const TEST_INIT_STATE = "@@initialize";
const {resource, isLoaded, isLoading, shouldLoad, selectEntity} = require("./resource");

describe("Initial State", function(){
	const {reducer, loading, loadedEntity} = resource("test");
	const state0 = reducer(undefined, {type: TEST_INIT_STATE});

	test('Not loaded', function(){
		expect(isLoaded(state0)).toBeFalsy();
	});

	test('is not loading', function(){
		expect(isLoading(state0)).toBeFalsy();
	});

	test('should load', function () {
		expect(shouldLoad(state0)).toBeTruthy();
	});

	describe("When loading", function() {
		const state1 = reducer(state0, loading());

		test("is loading", function(){
			expect(isLoading(state1)).toBeTruthy();
		});

		test("is not loaded", function(){
			expect(isLoaded(state1)).toBeFalsy();
		});

		test("should not load", function(){
			expect(shouldLoad(state1)).toBeFalsy();
		});
	});

	describe("When loaded directly", function(){
		const entity = {test};
		const state1 = reducer(state0, loadedEntity(entity));

		test('is not loading', function(){
			expect(isLoading(state1)).toBeFalsy();
		});

		test('it is loaded', function(){
			expect(isLoaded(state1)).toBeTruthy();
		});

		test("should not load", function(){
			expect(shouldLoad(state1)).toBeFalsy();
		});

		test("entity is selectable", function(){
			expect(selectEntity(state1)).toEqual(entity);
		});
	});
});

const {combineReducers} = require("redux");

function selectA( state ){ return state.a; }
function selectB( state ){ return state.b; }

describe("Given a combined reducer with two entities", function(){
	const aEntity = resource("a");
	const bEntity = resource("b");
	const entityABReducer = combineReducers({a: aEntity.reducer, b: bEntity.reducer});

	describe("When entity A is loaded", function(){
		test("Then Entity B is not loaded", function(){
			const a = {};
			const state0 = entityABReducer( undefined, TEST_INIT_STATE);
			const state1 = entityABReducer( state0, aEntity.loadedEntity(a));
			expect(isLoaded(selectB(state1))).toBeFalsy();
		});

		test("Then Entity A is loaded", function(){
			const a = {};
			const state0 = entityABReducer( undefined, TEST_INIT_STATE);
			const state1 = entityABReducer( state0, aEntity.loadedEntity(a));
			expect(isLoaded(selectA(state1))).toBeTruthy();
		});
	})
});
