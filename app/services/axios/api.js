import axios from 'axios';

let baseUrl = 'http://kk.melepark.com:8099/kkserver/';

let option = {
  baseURL: baseUrl,
  timeout: 10000,
  // crossdomain: true,
  //withCredentials: true,
};
const config = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
};
const uploadConfig = {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
};
const instance = axios.create(option);

instance.interceptors.response.use(res => {
  if (res.code === 2 || res.code === 4) {
    var promise = new Promise(function(resolve, reject) {
      reject(new Error('expire'));
    });
    return promise;
  }
  return res;
});
function jsonToQueryString(json) {
  return (
    '' +
    Object.keys(json)
      .map(function(key) {
        return encodeURIComponent(key) + '=' + encodeURIComponent(json[key]);
      })
      .join('&')
  );
}

export function apiFetchConfigInfo(args = {}) {
  return instance.post(
    baseUrl + 'HICService.y?cmd=onStart',
    jsonToQueryString({
      auid: args.auid /*固有参数：用户唯一标识auid,可为空*/,
      M0: args.M0 /*固有参数：H5前端标识，安卓为MMC，IOS为IMMC*/,
      M2: args.M2 /*固有参数：登录TOKEN,可为空*/,
      M3: args.M3 /*固有参数：实时位置经纬度*/,
      M8: args.M8 /*固有参数：DES.MD5(auid+M9)*/,
      M9: args.M9 /*固有参数：时间戳（毫秒）*/,
    }),
    config,
  );
}

//检查手机号码是否已注册
export function apiCheckPhone(args = {}) {
  return instance.post(
    baseUrl + 'HICService.y?cmd=checkPhone',
    jsonToQueryString({
      phone: args.phone,
      auid: args.auid,
      M0: args.M0,
      M2: args.M2,
      M3: args.M3,
      M8: args.M8,
      M9: args.M9,
    }),
    config,
  );
}

//发送手机验证码
export function apiSendCodeToPhone(args = {}) {
  return instance.post(
    baseUrl + 'HICService.y?cmd=sendCodeToPhone',
    jsonToQueryString({
      phone: args.phone,
      auid: args.auid,
      M0: args.M0,
      M2: args.M2,
      M3: args.M3,
      M8: args.M8,
      M9: args.M9,
    }),
    config,
  );
}

//注册
export function apiRegist(args = {}) {
  return instance.post(
    baseUrl + 'HICService.y?cmd=regist',
    jsonToQueryString({
      phone: args.phone,
      password: args.password,
      auid: args.auid,
      M0: args.M0,
      M2: args.M2,
      M3: args.M3,
      M8: args.M8,
      M9: args.M9,
    }),
    config,
  );
}

//注册信息完善1
export function apiEditRegistInfo1(args = {}) {
  let formData = new FormData();
  formData.append('nickName', args.nickName);
  formData.append('birth', args.birth);
  formData.append('sex', args.sex);
  formData.append('auid', args.auid);
  formData.append('M0', args.M0);
  formData.append('M2', args.M2);
  formData.append('M3', args.M3);
  formData.append('M8', args.M8);
  formData.append('M9', args.M9);
  formData.append('face', {
    uri: args.face.uri,
    name: 'file.jpg',
    type: 'multipart/form-data',
  });
  let options = {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  return axios.post(`${baseUrl}HICService.y?cmd=editRegistInfo1`, formData, options);
}

//注册信息完善2
export function apiEditRegistInfo2(args = {}) {
  return instance.post(
    baseUrl + 'HICService.y?cmd=editRegistInfo2',
    jsonToQueryString({
      kkStatus: args.kkStatus,
      markers: args.markers,
      auid: args.auid,
      M0: args.M0,
      M2: args.M2,
      M3: args.M3,
      M8: args.M8,
      M9: args.M9,
    }),
    config,
  );
}
