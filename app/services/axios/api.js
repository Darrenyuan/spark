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

export function apiOnStart(args = {}) {
  let defaultArgs = getDefaultArgs(args);
  return instance.post(
    baseUrl + 'HICService.y?cmd=onStart',
    jsonToQueryString({ ...defaultArgs, M0: DeviceInfo.getUniqueID(), M9: new Date().getTime() }),
    config,
  );
}

export function apiCheckPhone(args = {}) {
  let defaultArgs = getDefaultArgs(args);
  return instance.post(
    baseUrl + 'HICService.y?cmd=checkPhone',
    jsonToQueryString({
      ...defaultArgs,
      M0: DeviceInfo.getUniqueID(),
      M9: new Date().getTime(),
      phone: args.phone,
    }),
    config,
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

export function apiSendCodeToPhone(args = {}) {
  let defaultArgs = getDefaultArgs(args);
  return instance.post(
    baseUrl + 'HICService.y?cmd=sendCodeToPhone',
    jsonToQueryString({
      ...defaultArgs,
      M0: DeviceInfo.getUniqueID(),
      M9: new Date().getTime(),
      phone: args.phone,
      seq: args.seq,
    }),
    config,
  );
}

export function apiRegist(args = {}) {
  let defaultArgs = getDefaultArgs(args);
  return instance.post(
    baseUrl + 'HICService.y?cmd=regist',
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

export function apiEditRegistInfo1(args = {}) {
  let defaultArgs = getDefaultArgs(args);
  return instance.post(
    baseUrl + 'HICService.y?cmd=editRegistInfo1',
    jsonToQueryString({
      ...defaultArgs,
      M0: DeviceInfo.getUniqueID(),
      M9: new Date().getTime(),
      nickName: args.nickName /*昵称*/,
      face: args.face /*头像：待上传文件*/,
      sex: args.sex /*性别：男，女*/,
      birth: args.birth /*生日*/,
    }),
    config,
  );
}

export function apiEditRegistInfo2(args = {}) {
  let defaultArgs = getDefaultArgs(args);
  return instance.post(
    baseUrl + 'HICService.y?cmd=editRegistInfo2',
    jsonToQueryString({
      ...defaultArgs,
      M0: DeviceInfo.getUniqueID(),
      M9: new Date().getTime(),
      kkStatus: args.kkStatus,
      markers: args.markers,
    }),
    config,
  );
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

export function apiSjTypeInfo(args = {}) {
  return instance.post(
    baseUrl + 'HICService.y?cmd=sjTypeInfo',
    jsonToQueryString({
      ...defaultArgs,
      auid: args.auid,
      M2: args.M2,
      sjType: args.sjType /*主题分类*/,
    }),
    config,
  );
}

export function apiAdd(args = {}) {
  return instance.post(
    baseUrl + 'HICService.y?cmd=add',
    jsonToQueryString({
      ...defaultArgs,
      auid: args.auid,
      M2: args.M2,
      sjType: args.sjType /*主题分类*/,
      content: args.content /*主题内容*/,
      areaR: args.areaR /*辐射半径*/,
      startTime: args.startTime /*开始时间*/,
      endTime: args.endTime /*结束时间*/,
      duration: args.duration /*有效时间*/,
      showPower: args.showPower /*可见权限*/,
      picfile: args.picfile /*上传图片1~9*/,
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
