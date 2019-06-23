import { REGISTER_LOCATION } from './constants';
import initialState from './initialState';

// Rekit uses redux-thunk for async actions by default: https://github.com/gaearon/redux-thunk
// If you prefer redux-saga, you can use rekit-plugin-redux-saga: https://github.com/supnate/rekit-plugin-redux-saga
export function registerLocation(args = {}) {
  return {
    type: REGISTER_LOCATION,
    data: args,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case REGISTER_LOCATION:
      // Just after a request is sent
      let address = action.data.address;
      if (state.locationInfo === undefined) {
        state.locationInfo = {
          latitude: 0,
          longitude: 0,
          coordsStr: '0.0',
          address: '',
        };
      }
      if (action.data.address === undefined || action.data.address === '') {
        address = state.locationInfo.address;
      }
      return {
        ...state,
        locationInfo: {
          latitude: action.data.latitude,
          longitude: action.data.longitude,
          coordsStr: action.data.coordsStr,
          address: address,
        },
      };

    default:
      return state;
  }
}
