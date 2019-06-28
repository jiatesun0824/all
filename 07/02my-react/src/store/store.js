import {createStore, combineReducers, applyMiddleware} from 'redux';
import {reducer} from './home';
import {caseReducer} from './case';
import thunk from 'redux-thunk';
let store = createStore(
  combineReducers({reducer, caseReducer}),
  applyMiddleware(thunk)
);

export default store;