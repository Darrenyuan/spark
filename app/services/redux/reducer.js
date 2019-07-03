import initialState from './initialState';
import { reducer as loginReducer } from './login';
import { reducer as logoutReducer } from './logout';
import { reducer as applyLogonReducer } from './applyLogon';
import { reducer as fetchConfigInfoReducer } from './fetchConfigInfo';
import { reducer as fetchContentListReducer } from './fetchContentList';
import { reducer as fetchAddListReducer } from './fetchAddList';
import { reducer as registerLocationReducer } from './registerLocation';
import { reducer as fetchNearByDetailReducer } from './fetchNearByDetail';
import { reducer as fetchCommentListReducer } from './fetchCommentList';

const reducers = [
  loginReducer,
  logoutReducer,
  applyLogonReducer,
  fetchConfigInfoReducer,
  fetchContentListReducer,
  fetchAddListReducer,
  registerLocationReducer,
  fetchNearByDetailReducer,
  fetchCommentListReducer,
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
