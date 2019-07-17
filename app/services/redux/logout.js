import {
  SPARK_LOGOUT_BEGIN,
  SPARK_LOGOUT_SUCCESS,
  SPARK_LOGOUT_FAILURE,
  SPARK_LOGOUT_DISMISS_ERROR,
} from './constants';
import { apiLogout } from '../axios/api';
export function logout(args = {}) {
  return dispatch => {
    // optionally you can have getState as the second argument
    dispatch({
      type: SPARK_LOGOUT_BEGIN,
    });

    // Return a promise so that you could control UI flow without states in the store.
    // For example: after submit a form, you need to redirect the page to another when succeeds or show some errors message if fails.
    // It's hard to use state to manage it, but returning a promise allows you to easily achieve it.
    // e.g.: handleSubmit() { this.props.actions.submitForm(data).then(()=> {}).catch(() => {}); }
    const promise = new Promise((resolve, reject) => {
      const doRequest = apiLogout(args);
      doRequest.then(
        res => {
          console.log(res);
          console.log('teyrtyetrwetryw');
          dispatch({
            type: SPARK_LOGOUT_SUCCESS,
            data: res.data.data,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        err => {
          dispatch({
            type: SPARK_LOGOUT_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}
export function dismissLogoutError() {
  return {
    type: SPARK_LOGOUT_DISMISS_ERROR,
  };
}
export function reducer(state, action) {
  switch (action.type) {
    case SPARK_LOGOUT_BEGIN:
      return {
        ...state,
        logoutPending: true,
        logoutError: null,
      };

    case SPARK_LOGOUT_SUCCESS:
      return {
        ...state,
        userInfo: {},
        loginInfo: {},
        addList: {
          searchTerms: [],
          items: [],
          page: 1,
          pageSize: 10,
          total: 0,
          byId: {},
          listNeedReload: false,
        },
        logoutPending: false,
        logoutError: null,
      };

    case SPARK_LOGOUT_FAILURE:
      return {
        ...state,
        logoutPending: false,
        // loginError: action.data.error,
      };

    case SPARK_LOGOUT_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        logoutError: null,
      };

    default:
      return state;
  }
}
