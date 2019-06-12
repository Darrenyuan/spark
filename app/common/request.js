'use strict';

import QueryString from 'query-string';
import _ from 'lodash';
import toast from './toast';
import DeviceInfo from 'react-native-device-info';
import LocationService from '../screens/LocationService';

/**
 * http请求
 */
let request = {
  get(url, params) {
    if (params) {
      url += '?' + QueryString.stringify(params);
    }
    const options = {
      method: 'GET',
    };
    return _fetchData(url, options);
  },
  post(url, params = {}) {
    url = config.api.baseURI + url;

    params.auid = config.loginInfo.auid;
    params.M0 = DeviceInfo.getUniqueID();
    params.M2 = config.loginInfo.loginToken;
    params.M3 = LocationService.getLocationString();
    params.M9 = new Date().getTime();

    for (let key in params) {
      if (params[key] === undefined || params[key] === null) {
        delete params[key];
      }
    }
    params = QueryString.stringify(params);

    const options = {
      method: 'POST',
      body: params,
      requestHeader: 'application/x-www-form-urlencoded',
    };
    return _fetchData(url, options);
  },
  upload(url: string, params = {}, callback: Function) {
    url = config.api.baseURI + url;

    params.auid = config.loginInfo.auid;
    params.M0 = DeviceInfo.getUniqueID();
    params.M2 = config.loginInfo.loginToken;
    params.M3 = LocationService.getLocationString();
    params.M9 = new Date().getTime();

    let formData = new FormData();
    let data = params;
    for (let key in data) {
      if (data[key] === undefined || data[key] === null) {
        delete data[key];
      } else {
        formData.append(key, data[key]);
      }
    }

    const options = {
      method: 'POST',
      body: formData,
      requestHeader: 'multipart/form-data',
    };
    return _fetchData(url, options, callback);
  },
};

export default request;

const _fetchData = (url, options, callback) => {
  const { method = 'POST', body, requestHeader } = options;
  console.log(options);
  console.log(999999999);
  return new Promise((resolve, reject) => {
    const handler = function() {
      try {
        resolve(this);
      } catch (e) {
        // console.warn(e)
        reject(e);
      }
    };
    let xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader('Content-Type', requestHeader);
    xhr.onload = handler;
    xhr.timeout = 20000;
    xhr.ontimeout = () => {
      toast.fail('请求超时');
    };
    callback && callback(xhr);
    xhr.send(body);
  }).then(response => {
    // console.log(response)
    if (response.readyState === 4 && response.status === 200) {
      let res = JSON.parse(response.responseText);
      console.log(res);
      if (res.code === 1) {
        //请求ok
      } else if (res.code === 2) {
        //错误请求
        toast.fail(res.msg);
      } else if (res.code === 4) {
        //接口异常
        toast.fail(res.msg);
      }
      return res;
    }
    return ResponseStatus(response);
  });
};

// const fetchRequest = {
// 	get(url: string, params: Object) {
// 		if (params) {
// 			url += '?' + QueryString.stringify(params);
// 		}
// 		return this._fetchData(url);
// 	},
// 	post(url: string, params: Object) {
// 		const fetchOptions = _.extend(config.header, {
// 			body: QueryString.stringify(params)
// 		});
// 		return this._fetchData(url, fetchOptions);
// 	},
// 	_fetchData(url: string, fetchOptions ?: Object) {
// 		return fetch(url, fetchOptions)
// 			.then(response => {
// 				// console.log(response)
// 				if (response.ok && response.status === 200) {
// 					return response.json();
// 				}
// 				return ResponseStatus(response)
// 			})
// 	}
// }

const ResponseStatus = function(response) {
  let code = response.status;
  let msg = response.responseText;
  if (code === 404) {
    msg = '404 not found';
    toast.fail(msg);
  } else if (code === 400) {
    msg = '请求参数不合法';
    toast.fail(msg);
  } else if (code === 500) {
    msg = '服务器异常';
    toast.fail(msg);
  }
  return {
    code,
    msg,
  };
};
