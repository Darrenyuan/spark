import {
  SPARK_APPLY_LOGON_BEGIN,
  SPARK_APPLY_LOGON_SUCCESS,
  SPARK_APPLY_LOGON_FAILURE,
  SPARK_APPLY_LOGON_DISMISS_ERROR,
} from './constants';
import { apiApplyLogon } from '../axios/api';

export function applyLogon(args = {}) {
  return dispatch => {
    dispatch({
      type: SPARK_APPLY_LOGON_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const doRequest = apiApplyLogon(args);
      doRequest.then(
        res => {
          dispatch({
            type: SPARK_APPLY_LOGON_SUCCESS,
            data: res.data.data.user,
          });
          resolve(res);
        },
        err => {
          dispatch({
            type: SPARK_APPLY_LOGON_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissApplyLogonError() {
  return {
    type: SPARK_APPLY_LOGON_DISMISS_ERROR,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case SPARK_APPLY_LOGON_BEGIN:
      return {
        ...state,
      };

    case SPARK_APPLY_LOGON_SUCCESS:
      return {
        ...state,
        userInfo: action.data,
      };

    case SPARK_APPLY_LOGON_FAILURE:
      return {
        ...state,
        applyLogonError: action.data.error,
      };

    case SPARK_APPLY_LOGON_DISMISS_ERROR:
      return {
        ...state,
      };

    default:
      return state;
  }
}
