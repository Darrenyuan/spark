import React from "react";

let permissionDenied = false;
let latitude = null;
let longitude = null;

function _saveLocationInfo() {
  config.setLocationInfo({
    permissionDenied,
    latitude,
    longitude
  });
}

function init() {
  config.getLocationInfo().then(locationInfo => {
    permissionDenied = locationInfo.permissionDenied
      ? locationInfo.permissionDenied
      : false;
    latitude = locationInfo.latitude ? locationInfo.latitude : null;
    longitude = locationInfo.longitude ? locationInfo.longitude : null;

    getCurrentPosition();
  });
}

function destroy() {}

function getCurrentPosition(
  successCallback: Function,
  errorCallback: Function,
  options: Object
) {
  navigator.geolocation.getCurrentPosition(
    position => {
      latitude = Math.abs(position.coords.latitude);
      longitude = Math.abs(position.coords.longitude);
      permissionDenied = false;
      _saveLocationInfo();

      if (successCallback) {
        successCallback(position);
      }
    },
    error => {
      permissionDenied = false;
      if (error.code === error.PERMISSION_DENIED) {
        permissionDenied = true;
      }
      _saveLocationInfo();

      if (errorCallback) {
        errorCallback(error);
      }
    },
    options ? options : { timeout: 20000, maximumAge: 1000 }
  );
}

function getLocationString() {
  if (latitude && longitude) {
    return `${latitude},${longitude}`;
  }
  return null;
}

export default {
  init,
  destroy,
  getCurrentPosition,
  getLocationString,
  permissionDenied,
  latitude,
  longitude
};
