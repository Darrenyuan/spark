import reducer from '../redux/reducer';
import thunk from 'redux-thunk';
import throttle from 'lodash/throttle';
import { loadState, saveState } from './storage';
import initialState from '../redux/initialState';
import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from '../redux/reducer';

const middlewares = [thunk];

export default function configureStore() {
  let state = initialState;
  const serializedState = loadState();
  if (serializedState) {
    state = serializedState;
  }
  const store = createStore(rootReducer, state, compose(applyMiddleware(...middlewares)));
  store.subscribe(
    throttle(() => {
      saveState(store.getState());
    }, 1000),
  );
  return store;
}
