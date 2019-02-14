const React = require("react");

const TEST_INIT_STATE = "@@initialize";

const STATE_LOADED = "loaded";
const STATE_LOADING = "loading";

const ACTION_LOADING = "entity.loading";
const ACTION_LOADED = "entity.loaded";

const initialState = {};
function resourceReducer( state = initialState, action ){
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

function loadedEntity(entity){
	return {
		type: ACTION_LOADED,
		entity
	};
}

function loading(){
	return { type: ACTION_LOADING };
}

describe("Initial State", function(){
	const state0 = resourceReducer(undefined, {type: TEST_INIT_STATE});

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
		const state1 = resourceReducer(state0, loading());

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
		const state1 = resourceReducer(state0, loadedEntity(entity));

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
