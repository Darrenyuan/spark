import {
  FETCH_COLLECT_LIST_BEGIN,
  FETCH_COLLECT_LIST_SUCCESS,
  FETCH_COLLECT_LIST_FAILURE,
  FETCH_COLLECT_LIST_DISMISS_ERROR,
} from './constants';
import { apiFetchCollectList } from '../axios/api';
import initialState from './initialState';
import _ from 'lodash';

// Rekit uses redux-thunk for async actions by default: https://github.com/gaearon/redux-thunk
// If you prefer redux-saga, you can use rekit-plugin-redux-saga: https://github.com/supnate/rekit-plugin-redux-saga
export function fetchCollectList(args = {}) {
  return dispatch => {
    // optionally you can have getState as the second argument
    dispatch({
      type: FETCH_COLLECT_LIST_BEGIN,
    });

    // Return a promise so that you could control UI flow without states in the store.
    // For example: after submit a form, you need to redirect the page to another when succeeds or show some errors message if fails.
    // It's hard to use state to manage it, but returning a promise allows you to easily achieve it.
    // e.g.: handleSubmit() { this.props.actions.submitForm(data).then(()=> {}).catch(() => {}); }
    const promise = new Promise((resolve, reject) => {
      // doRequest is a placeholder Promise. You should replace it with your own logic.
      // See the real-word example at:  https://github.com/supnate/rekit/blob/master/src/features/home/redux/fetchRedditReactjsList.js
      // args.error here is only for test coverage purpose.
      const doRequest = apiFetchCollectList(args);
      doRequest.then(
        res => {
          dispatch({
            type: FETCH_COLLECT_LIST_SUCCESS,
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
            type: FETCH_COLLECT_LIST_FAILURE,
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
export function dismissFetchCollectListError() {
  return {
    type: FETCH_COLLECT_LIST_DISMISS_ERROR,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case FETCH_COLLECT_LIST_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        fetchCollectListPending: true,
        fetchCollectListError: null,
      };

    case FETCH_COLLECT_LIST_SUCCESS:
      if (_.isEqual(action.data, {})) {
        return {
          ...state,
          fetchCollectListPending: false,
          fetchCollectListError: null,
        };
      }
      // The request is success
      if (state.collectList === undefined) {
        state.collectList = { ...initialState.collectList };
      }

      const byId = {};
      const items = [];
      action.data.list.forEach(item => {
        items.push(item.dataid);
        byId[item.dataid] = item;
      });
      const { collectList } = state;
      const { searchTerms } = collectList;
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
      state.collectList[searchTerm] = {
        ...state.collectList[searchTerm],
        ...entity,
      };

      return {
        ...state,
        collectList: {
          ...state.collectList,
          searchTerms: searchTerms,
          byId: { ...state.collectList.byId, ...byId },
          page: action.data.page,
          pageSize: action.data.pageSize,
          total: action.data.totalCount,
          listNeedReload: false,
        },
        fetchCollectListPending: false,
        fetchCollectListError: null,
      };

    case FETCH_COLLECT_LIST_FAILURE:
      // The request is failed
      return {
        ...state,
        fetchCollectListPending: false,
        fetchCollectListError: action.data.error,
      };

    case FETCH_COLLECT_LIST_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        fetchCollectListError: null,
      };

    default:
      return state;
  }
}
