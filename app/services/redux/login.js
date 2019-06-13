import {
  SPARK_LOGIN_BEGIN,
  SPARK_LOGIN_SUCCESS,
  SPARK_LOGIN_FAILURE,
  SPARK_LOGIN_DISMISS_ERROR,
} from './constants';
import { apiLongin } from '../axios/api';

export function login(args = {}) {
  return dispatch => {
    // optionally you can have getState as the second argument
    dispatch({
      type: SPARK_LOGIN_BEGIN,
    });

    // Return a promise so that you could control UI flow without states in the store.
    // For example: after submit a form, you need to redirect the page to another when succeeds or show some errors message if fails.
    // It's hard to use state to manage it, but returning a promise allows you to easily achieve it.
    // e.g.: handleSubmit() { this.props.actions.submitForm(data).then(()=> {}).catch(() => {}); }
    const promise = new Promise((resolve, reject) => {
      const doRequest = apiLongin(args);
      doRequest.then(
        res => {
          dispatch({
            type: SPARK_LOGIN_SUCCESS,
            data: res.data,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        err => {
          dispatch({
            type: SPARK_LOGIN_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissLoginError() {
  return {
    type: SPARK_LOGIN_DISMISS_ERROR,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case SPARK_LOGIN_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        loginPending: true,
        loginError: null,
      };

    case SPARK_LOGIN_SUCCESS:
      // The request is success
      return {
        ...state,
        loginInfo: action.data,
        loginPending: false,
        loginError: null,
      };

    case SPARK_LOGIN_FAILURE:
      // The request is failed
      return {
        ...state,
        loginPending: false,
        loginError: action.data.error,
      };

    case SPARK_LOGIN_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        loginError: null,
      };

    default:
      return state;
  }
}
