import reducer from '../redux/reducer';
import thunk from 'redux-thunk';

import initialState from '../redux/initialState';
import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from '../redux/reducer';

const middlewares = [thunk];
export default function configureStore(state = initialState) {
  const store = createStore(rootReducer, state, compose(applyMiddleware(...middlewares)));
  return store;
}
