import initialState from './initialState';
import { reducer as loginReducer } from './login';
import { reducer as applyLogonReducer } from './applyLogon';
import { reducer as fetchConfigInfoReducer } from './fetchConfigInfo';
import { reducer as fetchContentListReducer } from './fetchContentList';
import { reducer as registerLocationReducer } from './registerLocation';

const reducers = [
  loginReducer,
  applyLogonReducer,
  fetchConfigInfoReducer,
  fetchContentListReducer,
  registerLocationReducer,
];

export default function reducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    default:
      newState = state;
      break;
  }
  return reducers.reduce((s, r) => r(s, action), newState);
}
