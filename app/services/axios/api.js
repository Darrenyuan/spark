import axios from 'axios';
import DeviceInfo from 'react-native-device-info';
import LocationService from '../../screens/LocationService';
import { b64_hmac_md5 } from 'react-native-md5';
import md5 from 'react-native-md5';

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
// 部分参数从redux里面取
const getDefaultArgs = args => ({
  auid: args.auid,
  M0: args.M0,
  M2: args.M2,
  M3: args.M3,
  M8: args.M8,
  M9: args.M9,
});

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
      sjid: args.sjid,
      auid: args.auid,
      M0: args.M0,
      M2: args.M2,
      M3: args.M3,
      M8: args.M8,
      M9: args.M9,
    }),
  );
}
export function apiOnStart(args = {}) {
  let defaultArgs = getDefaultArgs(args);
  return instance.post(
    baseUrl + 'HICService.y?cmd=onStart',
    jsonToQueryString({ ...defaultArgs, M0: DeviceInfo.getUniqueID(), M9: new Date().getTime() }),
    config,
  );
}
export function apiUserInfo(args = {}) {
  let defaultArgs = getDefaultArgs(args);
  return instance.post(
    baseUrl + 'UserCService.y?cmd=userInfo',
    jsonToQueryString({
      ...defaultArgs,
      userAuid: args.userAuid,
    }),
    config,
  );
}
//修改密码
export function apiEditPassword(args = {}) {
  let defaultArgs = getDefaultArgs(args);
  return instance.post(
    baseUrl + 'UserCService.y?cmd=editPassword',
    jsonToQueryString({
      ...defaultArgs,
      phone: args.phone,
      oldPassword: args.oldPassword,
      password: args.password,
    }),
    config,
  );
}
//修改手机号码
export function apiEditPhone(args = {}) {
  let defaultArgs = getDefaultArgs(args);
  return instance.post(
    baseUrl + 'UserCService.y?cmd=editPhone',
    jsonToQueryString({
      ...defaultArgs,
      phone: args.phone,
      password: args.password,
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
  );
}

export function apiLogin(args = {}) {
  let defaultArgs = getDefaultArgs(args);
  return instance.post(
    baseUrl + 'HICService.y?cmd=login',
    jsonToQueryString({
      ...defaultArgs,
      M0: DeviceInfo.getUniqueID(),
      M9: new Date().getTime(),
      phone: args.phone,
      password: args.password,
    }),
    config,
  );
}

export function apiResetPassword(args = {}) {
  let defaultArgs = getDefaultArgs(args);
  return instance.post(
    baseUrl + 'HICService.y?cmd=resetPassword',
    jsonToQueryString({
      ...defaultArgs,
      M0: DeviceInfo.getUniqueID(),
      M9: new Date().getTime(),
      phone: args.phone,
      password: args.password,
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

//编辑背景图片
export function apiEditMyBackground(args = {}) {
  let formData = new FormData();
  formData.append('auid', args.auid);
  formData.append('M0', args.M0);
  formData.append('M2', args.M2);
  formData.append('M3', args.M3);
  formData.append('M8', args.M8);
  formData.append('M9', args.M9);
  formData.append('file1', {
    uri: args.file1,
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
  return axios.post(`${baseUrl}UserCService.y?cmd=editMyBackground`, formData, options);
}
//编辑头像
export function apiEditFace(args = {}) {
  let formData = new FormData();
  formData.append('auid', args.auid);
  formData.append('M0', args.M0);
  formData.append('M2', args.M2);
  formData.append('M3', args.M3);
  formData.append('M8', args.M8);
  formData.append('M9', args.M9);
  formData.append('file1', {
    uri: args.file1,
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
  return axios.post(`${baseUrl}UserCService.y?cmd=editFace`, formData, options);
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
  );
}
//主题分类属性信息
export function apiSjTypeInfo(args = {}) {
  return instance.post(
    baseUrl + 'SubjectCService.y?cmd=sjTypeInfo',
    jsonToQueryString({
      sjType: args.sjType,
      auid: args.auid,
      M0: args.M0,
      M2: args.M2,
      M3: args.M3,
      M8: args.M8,
      M9: args.M9,
    }),
  );
}
//发表主题
export function apiAdd(args = {}) {
  let formData = new FormData();
  formData.append('sjType', args.sjType);
  formData.append('title', args.title);
  formData.append('content', args.content);
  formData.append('areaR', args.areaR);
  formData.append('startTime', args.startTime);
  formData.append('price', args.price);
  formData.append('auid', args.auid);
  formData.append('M0', args.M0);
  formData.append('M2', args.M2);
  formData.append('M3', args.M3);
  formData.append('M8', args.M8);
  formData.append('M9', args.M9);
  formData.append('location', args.location);
  args.imgs.map(item => {
    formData.append('face', {
      uri: item.path,
      name: 'file.jpg',
      type: 'multipart/form-data',
    });
  });
  let options = {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  return axios.post(`${baseUrl}SubjectCService.y?cmd=add`, formData, options);
}
export function apiLogout(args = {}) {
  let defaultArgs = getDefaultArgs(args);
  return instance.post(
    baseUrl + 'HICService.y?cmd=logout',
    jsonToQueryString({
      ...defaultArgs,
    }),
    config,
  );
}

export function apiApplyLogon(args = {}) {
  let defaultArgs = getDefaultArgs(args);
  return instance.post(
    baseUrl + 'HICService.y?cmd=applyLogon',
    jsonToQueryString({
      ...defaultArgs,
      M0: DeviceInfo.getUniqueID(),
      M9: new Date().getTime(),
      deviceToken: args.deviceToken,
    }),
    config,
  );
}
export function apiEditMyInfo(args = {}) {
  let defaultArgs = getDefaultArgs(args);
  return instance.post(
    baseUrl + 'UserCService.y?cmd=editMyInfo',
    jsonToQueryString({
      ...defaultArgs,
      nickName: args.nickName,
      sex: args.sex,
      kkStatus: args.kkStatus,
      markers: args.markers,
    }),
    config,
  );
}
export function apiFetchContentList(args = {}) {
  const obj = {
    sjType: args.sjType,
    collectFlag: args.collectFlag,
    keyword: args.keyword,
    page: args.page,
    pageRow: args.pageSize,
    auid: args.auid,
    M0: args.M0,
    M2: args.M2,
    M3: args.M3,
    M8: args.M8,
    M9: args.M9,
  };
  if (args.userAuid) {
    obj.userAuid = args.userAuid;
  }
  return instance.post(baseUrl + 'SubjectCService.y?cmd=list', jsonToQueryString(obj), config);
}

export function apiFetchNearByDetail(args = {}) {
  return instance.post(
    baseUrl + 'SubjectCService.y?cmd=detail',
    jsonToQueryString({
      sjid: args.sjid,
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

export function apiAgreeList(args = {}) {
  return instance.post(
    baseUrl + 'HICService.y?cmd=agreeList',
    jsonToQueryString({
      ...defaultArgs,
      auid: args.auid,
      M2: args.M2,
      sjid: args.sjid,
    }),
    config,
  );
}

export function apiFetchCommentList(args = {}) {
  return instance.post(
    baseUrl + 'SubjectCService.y?cmd=commentList',
    jsonToQueryString({
      sjid: args.sjid,
      page: args.page,
      pageRow: args.pageSize,
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

export function apiCollectList(args = {}) {
  return instance.post(
    baseUrl + 'HICService.y?cmd=collectList',
    jsonToQueryString({
      ...defaultArgs,
      auid: args.auid,
      M2: args.M2,
      sjid: args.sjid,
    }),
    config,
  );
}

export function apiAgree(args = {}) {
  return instance.post(
    baseUrl + 'SubjectCService.y?cmd=agree',
    jsonToQueryString({
      sjid: args.sjid,
      agreeFlag: args.agreeFlag,
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

export function apiComment(args = {}) {
  return instance.post(
    baseUrl + 'SubjectCService.y?cmd=comment',
    jsonToQueryString({
      sjid: args.sjid,
      content: args.content,
      replyID: args.replyID,
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

export function apiCommentAgree(args = {}) {
  return instance.post(
    baseUrl + 'SubjectCService.y?cmd=commentAgree',
    jsonToQueryString({
      sjid: args.sjid,
      commentDataid: args.commentDataid,
      agreeFlag: args.agreeFlag,
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

export function apiCollect(args = {}) {
  return instance.post(
    baseUrl + 'SubjectCService.y?cmd=colllect',
    jsonToQueryString({
      sjid: args.sjid,
      collectFlag: args.collectFlag,
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

export function apiMsgList(args = {}) {
  return instance.post(
    baseUrl + 'HICService.y?cmd=list',
    jsonToQueryString({
      ...defaultArgs,
      auid: args.auid,
      M2: args.M2,
    }),
    config,
  );
}

export function apiRegeo(args = {}) {
  114.4297976345486, 30.5044091796875;
  let locationStr = '' + args.longitude + ',' + args.latitude;
  return instance.get(
    `http://restapi.amap.com/v3/geocode/regeo?key=b47dab6619bc7d71f22f6b4efed7ee03&location=${locationStr}&radius=1000&extensions=all&batch=false&roadlevel=0`,
  );
}
