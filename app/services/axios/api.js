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
  return instance.post(baseUrl + 'HICService.y?cmd=checkPhone', {
    phone: args.phone,
    ...configParameter,
  });
}

//发送手机验证码
export function apiSendCodeToPhone(args = {}) {
  return instance.post(baseUrl + 'HICService.y?cmd=sendCodeToPhone', {
    phone: args.phone,
    seq: '138012',
  });
}

//注册
export function apiRegist(args = {}) {
  return instance.post(baseUrl + 'HICService.y?cmd=regist', {
    phone: args.phone,
    password: args.password,
  });
}

//注册信息完善1
export function apiEditRegistInfo1(args = {}) {
  return instance.post(baseUrl + 'HICService.y?cmd=editRegistInfo1', {
    nickName: args.nickName,
    face: args.face,
    sex: args.sex,
    birth: args.birth,
  });
}

//注册信息完善2
export function apiEditRegistInfo2(args = {}) {
  return instance.post(baseUrl + 'HICService.y?cmd=editRegistInfo2', {
    kkStatus: args.kkStatus,
    markers: args.markers,
  });
}
