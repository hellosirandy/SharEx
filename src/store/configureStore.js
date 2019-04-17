import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import ui from './reducers/ui';
import auth from './reducers/auth';
import couple from './reducers/couple';
import expense from './reducers/expense';

const rootReducer = combineReducers({
  ui,
  auth,
  couple,
  expense,
});

let composeEnhancers = compose;

if (__DEV__) {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}

const configureStore = () => {
  return createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));
};

export default configureStore;
