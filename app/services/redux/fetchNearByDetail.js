import {
  FETCH_NEAR_BY_DETAIL_BEGIN,
  FETCH_NEAR_BY_DETAIL_SUCCESS,
  FETCH_NEAR_BY_DETAIL_FAILURE,
  FETCH_NEAR_BY_DETAIL_DISMISS_ERROR,
} from './constants';
import { apiFetchNearByDetail } from '../axios/api';
import initialState from './initialState';
import _ from 'lodash';

// Rekit uses redux-thunk for async actions by default: https://github.com/gaearon/redux-thunk
// If you prefer redux-saga, you can use rekit-plugin-redux-saga: https://github.com/supnate/rekit-plugin-redux-saga
export function fetchNearByDetail(args = {}) {
  return dispatch => {
    // optionally you can have getState as the second argument
    dispatch({
      type: FETCH_NEAR_BY_DETAIL_BEGIN,
    });

    // Return a promise so that you could control UI flow without states in the store.
    // For example: after submit a form, you need to redirect the page to another when succeeds or show some errors message if fails.
    // It's hard to use state to manage it, but returning a promise allows you to easily achieve it.
    // e.g.: handleSubmit() { this.props.actions.submitForm(data).then(()=> {}).catch(() => {}); }
    const promise = new Promise((resolve, reject) => {
      // doRequest is a placeholder Promise. You should replace it with your own logic.
      // See the real-word example at:  https://github.com/supnate/rekit/blob/master/src/features/home/redux/fetchRedditReactjsList.js
      // args.error here is only for test coverage purpose.
      const doRequest = apiFetchNearByDetail(args);
      doRequest.then(
        res => {
          dispatch({
            type: FETCH_NEAR_BY_DETAIL_SUCCESS,
            data: res.data.data,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        err => {
          dispatch({
            type: FETCH_NEAR_BY_DETAIL_FAILURE,
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
export function dismissFetchNearByDetailError() {
  return {
    type: FETCH_NEAR_BY_DETAIL_DISMISS_ERROR,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case FETCH_NEAR_BY_DETAIL_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        fetchNearByDetailPending: true,
        fetchContentListError: null,
      };

    case FETCH_NEAR_BY_DETAIL_SUCCESS:
      if (_.isEqual(action.data, {})) {
        return {
          ...state,
          fetchNearByDetailPending: false,
          fetchNearByDetailError: null,
        };
      }
      // The request is success
      if (state.nearByDetails === undefined) {
        state.nearByDetails = { ...initialState.nearByDetails };
      }
      const data = action.data;
      const byId = {};
      const items = [];
      state.nearByDetails.items.forEach(item => {
        items.push(item);
      });
      byId[data.sjid] = data;
      items.push(data.sjid);
      return {
        ...state,
        nearByDetails: {
          byId: { ...state.nearByDetails.byId, ...byId },
          items: items,
        },
        fetchNearByDetailPending: false,
        fetchNearByDetailError: null,
      };

    case FETCH_NEAR_BY_DETAIL_FAILURE:
      // The request is failed
      return {
        ...state,
        fetchNearByDetailPending: false,
        fetchNearByDetailError: action.data.error,
      };

    case FETCH_NEAR_BY_DETAIL_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        fetchNearByDetailError: null,
      };

    default:
      return state;
  }
}
