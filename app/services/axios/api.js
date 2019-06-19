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
      auid: args.auid /*固有参数：用户唯一标识auid,可为空*/,
      M0: args.M0 /*固有参数：H5前端标识，安卓为MMC，IOS为IMMC*/,
      M2: args.M2 /*固有参数：登录TOKEN,可为空*/,
      M3: args.M3 /*固有参数：实时位置经纬度*/,
      M8: args.M8 /*固有参数：DES.MD5(auid+M9)*/,
      M9: args.M9 /*固有参数：时间戳（毫秒）*/,
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
      M0: DeviceInfo.getUniqueID(),
      M9: new Date().getTime(),
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

export function apiList(args = {}) {
  let defaultArgs = getDefaultArgs(args);
  return instance.post(
    baseUrl + 'HICService.y?cmd=list',
    jsonToQueryString({
      ...defaultArgs,
      M0: DeviceInfo.getUniqueID(),
      M9: new Date().getTime(),
      sjType: args.sjType /*主题分类*/,
      collectFlag: args.collectFlag /*收藏标记：1-查询我收藏的主题，其他为空*/,
      keyword: args.keyword /*搜索关键字*/,
    }),
    config,
  );
}

export function apiDetail(args = {}) {
  return instance.post(
    baseUrl + 'HICService.y?cmd=detail',
    jsonToQueryString({
      ...defaultArgs,
      auid: args.auid,
      M2: args.M2,
      sjid: args.sjid,
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

export function apiCommentList(args = {}) {
  return instance.post(
    baseUrl + 'HICService.y?cmd=commentList',
    jsonToQueryString({
      ...defaultArgs,
      auid: args.auid,
      M2: args.M2,
      sjid: args.sjid,
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
    baseUrl + 'HICService.y?cmd=agree',
    jsonToQueryString({
      ...defaultArgs,
      auid: args.auid,
      M2: args.M2,
      sjid: args.sjid,
      agreeFlag: args.agreeFlag /*赞标识  1 赞  0 取消赞*/,
    }),
    config,
  );
}

export function apiComment(args = {}) {
  return instance.post(
    baseUrl + 'HICService.y?cmd=comment',
    jsonToQueryString({
      ...defaultArgs,
      auid: args.auid,
      M2: args.M2,
      sjid: args.sjid,
      content: args.content /*内容*/,
      replyID: args.replyID /*若是回复：上级评论的dataid*/,
    }),
    config,
  );
}

export function apiCollect(args = {}) {
  return instance.post(
    baseUrl + 'HICService.y?cmd=colllect',
    jsonToQueryString({
      ...defaultArgs,
      auid: args.auid,
      M2: args.M2,
      sjid: args.sjid,
      collectFlag: args.collectFlag /*收藏标识  1 收藏  0 取消收藏*/,
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

export function apiUserInfo(args = {}) {
  return instance.post(
    baseUrl + 'HICService.y?cmd=userInfo',
    jsonToQueryString({
      ...defaultArgs,
      auid: args.auid,
      M2: args.M2,
      userAuid: args.userAuid /*用户auid*/,
    }),
    config,
  );
}

export function apiEditMyInfo(args = {}) {
  return instance.post(
    baseUrl + 'HICService.y?cmd=editMyInfo',
    jsonToQueryString({
      ...defaultArgs,
      auid: args.auid,
      M2: args.M2,
      nickName: args.nickName /*昵称*/,
      phone: args.phone,
      sex: args.sex /*性别：男，女*/,
      birth: args.birth /*生日*/,
      kkStatus: args.kkStatus /*交友状态，可不传*/,
      markers: args.markers /*标签，可不传*/,
    }),
    config,
  );
}

export function apiEditNickName(args = {}) {
  return instance.post(
    baseUrl + 'HICService.y?cmd=editNickName',
    jsonToQueryString({
      ...defaultArgs,
      auid: args.auid,
      M2: args.M2,
      nickName: args.nickName /*昵称*/,
    }),
    config,
  );
}

export function apiEditFace(args = {}) {
  return instance.post(
    baseUrl + 'HICService.y?cmd=editFace',
    jsonToQueryString({
      ...defaultArgs,
      auid: args.auid,
      M2: args.M2,
      file1: args.file1 /*头像文件*/,
    }),
    config,
  );
}
