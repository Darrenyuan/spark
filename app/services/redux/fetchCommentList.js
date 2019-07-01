import {
  FETCH_COMMENT_LIST_BEGIN,
  FETCH_COMMENT_LIST_SUCCESS,
  FETCH_COMMENT_LIST_FAILURE,
  FETCH_COMMENT_LIST_DISMISS_ERROR,
} from './constants';
import { apiFetchCommentList } from '../axios/api';
import initialState from './initialState';
import _ from 'lodash';

// Rekit uses redux-thunk for async actions by default: https://github.com/gaearon/redux-thunk
// If you prefer redux-saga, you can use rekit-plugin-redux-saga: https://github.com/supnate/rekit-plugin-redux-saga
export function fetchCommentList(args = {}) {
  return dispatch => {
    // optionally you can have getState as the second argument
    dispatch({
      type: FETCH_COMMENT_LIST_BEGIN,
    });

    // Return a promise so that you could control UI flow without states in the store.
    // For example: after submit a form, you need to redirect the page to another when succeeds or show some errors message if fails.
    // It's hard to use state to manage it, but returning a promise allows you to easily achieve it.
    // e.g.: handleSubmit() { this.props.actions.submitForm(data).then(()=> {}).catch(() => {}); }
    const promise = new Promise((resolve, reject) => {
      // doRequest is a placeholder Promise. You should replace it with your own logic.
      // See the real-word example at:  https://github.com/supnate/rekit/blob/master/src/features/home/redux/fetchRedditReactjsList.js
      // args.error here is only for test coverage purpose.
      const doRequest = apiFetchCommentList(args);
      doRequest.then(
        res => {
          dispatch({
            type: FETCH_COMMENT_LIST_SUCCESS,
            data: res.data.data,
            payload: {
              searchTerm: args.searchTerm,
              page: args.page,
              pageSize: args.pageSize,
              totalCount: res.data.totalCount,
              timestamp: new Date().getTime(),
            },
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        err => {
          dispatch({
            type: FETCH_COMMENT_LIST_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

// Async action saves request error by default, this method is used to dismiss the error info.
// If you don't want errors to be saved in Redux store, just ignore this method.
export function dismissFetchCommentListError() {
  return {
    type: FETCH_COMMENT_LIST_DISMISS_ERROR,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case FETCH_COMMENT_LIST_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        fetchCommentListPending: true,
        fetchCommentListError: null,
      };

    case FETCH_COMMENT_LIST_SUCCESS:
      if (_.isEqual(action.data, {})) {
        return {
          ...state,
          fetchCommentListPending: false,
          fetchCommentListError: null,
        };
      }
      // The request is success
      if (state.commentList === undefined) {
        state.commentList = { ...initialState.commentList };
      }

      const byId = {};
      const items = [];
      action.data.list.forEach(item => {
        items.push(item.dataid);
        byId[item.dataid] = item;
      });
      const { commentList } = state;
      const { searchTerms } = commentList;
      const { searchTerm, page, pageSize, totalCount } = action.payload;
      searchTerms.push(searchTerm);
      let entity = {
        [page]: {
          items: items,
        },
        page: page,
        pageSize: pageSize,
        totalCount: totalCount,
      };
      state.commentList[searchTerm] = {
        ...state.commentList[searchTerm],
        ...entity,
      };

      return {
        ...state,
        commentList: {
          ...state.commentList,
          searchTerms: searchTerms,
          byId: { ...state.commentList.byId, ...byId },
          page: action.data.page,
          pageSize: action.data.pageSize,
          total: action.data.totalCount,
          listNeedReload: false,
        },
        fetchCommentListPending: false,
        fetchCommentListError: null,
      };

    case FETCH_COMMENT_LIST_FAILURE:
      // The request is failed
      return {
        ...state,
        fetchCommentListPending: false,
        fetchCommentListError: action.data.error,
      };

    case FETCH_COMMENT_LIST_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        fetchCommentListError: null,
      };

    default:
      return state;
  }
}
