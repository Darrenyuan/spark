import axios from 'axios';

let baseUrl = 'http://kk.melepark.com:8099/kkserver/';

let option = {
  baseURL: baseUrl,
  timeout: 10000,
  // crossdomain: true,
  //withCredentials: true,
};

const getDefaultArgs = (args = {}) => (
    {
    "auid":args.auid,  /*固有参数：用户唯一标识auid,可为空*/
    "M0":args.M0,  /*固有参数：H5前端标识，安卓为MMC，IOS为IMMC*/
    "M2":args.M2,  /*固有参数：登录TOKEN,可为空*/
    "M3":args.M3,  /*固有参数：实时位置经纬度*/
    "M8":args.M8,  /*固有参数：DES.MD5(auid+M9)*/
    "M9":args.M9  /*固有参数：时间戳（毫秒）*/
    } 
)

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

export function apiOnStart(args = {}) {
    let defaultArgs = getDefaultArgs(args);
    return instance.post(baseUrl + 'HICService.y?cmd=onStart',{...defaultArgs});
};

export function apiCheckPhone(args = {}) {
    let defaultArgs = getDefaultArgs(args);
    return instance.post(baseUrl + 'HICService.y?cmd=checkPhone',{...defaultArgs,
    "phone":args.phone
    });
};

export function apiLogin(args = {}) {
    let defaultArgs = getDefaultArgs(args);
    return instance.post(baseUrl + 'HICService.y?cmd=login',{...defaultArgs,
    "phone":args.phone,
    "password":args.password
    });
};

export function apiSendCodeToPhone(args = {}) {
    let defaultArgs = getDefaultArgs(args);
    return instance.post(baseUrl + 'HICService.y?cmd=sendCodeToPhone',{...defaultArgs,
    "phone":args.phone,
    "seq":args.seq,
    });
};

export function apiRegist(args = {}) {
    let defaultArgs = getDefaultArgs(args);
    return instance.post(baseUrl + 'HICService.y?cmd=regist',{...defaultArgs,
    "phone":args.phone,
    "password":args.password
    });
};

export function apiEditRegistInfo1(args = {}) {
    let defaultArgs = getDefaultArgs(args);
    return instance.post(baseUrl + 'HICService.y?cmd=editRegistInfo1',{...defaultArgs,
    "nickName":args.nickName, /*昵称*/
    "face":args.face, /*头像：待上传文件*/
    "sex":args.sex, /*性别：男，女*/
    "birth":args.birth, /*生日*/
    });
};

export function apiEditRegistInfo2(args = {}) {
    let defaultArgs = getDefaultArgs(args);
    return instance.post(baseUrl + 'HICService.y?cmd=editRegistInfo2',{...defaultArgs,
    "kkStatus":args.kkStatus,
    "markers":args.markers
    });
};


export function apiLogout(args = {}) {
    let defaultArgs = getDefaultArgs(args);
    return instance.post(baseUrl + 'HICService.y?cmd=logout',{...defaultArgs});
};

export function apiApplyLogon(args = {}) {
    let defaultArgs = getDefaultArgs(args);
    return instance.post(baseUrl + 'HICService.y?cmd=applyLogon',{...defaultArgs,
    "deviceToken":args.deviceToken
    });
};

export function apiList(args = {}) {
    let defaultArgs = getDefaultArgs(args);
    return instance.post(baseUrl + 'HICService.y?cmd=list',{...defaultArgs,
    "sjType":args.sjType, /*主题分类*/
	"collectFlag":args.collectFlag, /*收藏标记：1-查询我收藏的主题，其他为空*/
	"keyword":args.keyword, /*搜索关键字*/
    });
};

export function apiSjTypeInfo(args = {}) {
    let defaultArgs = getDefaultArgs(args);
    return instance.post(baseUrl + 'HICService.y?cmd=sjTypeInfo',{...defaultArgs,
    "sjType":args.sjType, /*主题分类*/
    });
};

export function apiAdd(args = {}) {
    let defaultArgs = getDefaultArgs(args);
    return instance.post(baseUrl + 'HICService.y?cmd=add',{...defaultArgs,
    "sjType":args.sjType, /*主题分类*/
    "content":args.content, /*主题内容*/
	"areaR":args.areaR, /*辐射半径*/
	"startTime":args.startTime, /*开始时间*/
	"endTime":args.endTime, /*结束时间*/
	"duration":args.duration, /*有效时间*/
	"showPower":args.showPower, /*可见权限*/
	"picfile":args.picfile, /*上传图片1~9*/
    });
};

export function apiDetail(args = {}) {
    let defaultArgs = getDefaultArgs(args);
    return instance.post(baseUrl + 'HICService.y?cmd=detail',{...defaultArgs,
    "sjid":args.sjid, 
    });
};

export function apiAgreeList(args = {}) {
    let defaultArgs = getDefaultArgs(args);
    return instance.post(baseUrl + 'HICService.y?cmd=agreeList',{...defaultArgs,
    "sjid":args.sjid, 
    });
};

export function apiCommentList(args = {}) {
    let defaultArgs = getDefaultArgs(args);
    return instance.post(baseUrl + 'HICService.y?cmd=commentList',{...defaultArgs,
    "sjid":args.sjid, 
    });
};

export function apiCollectList(args = {}) {
    let defaultArgs = getDefaultArgs(args);
    return instance.post(baseUrl + 'HICService.y?cmd=collectList',{...defaultArgs,
    "sjid":args.sjid, 
    });
};

export function apiAgree(args = {}) {
    let defaultArgs = getDefaultArgs(args);
    return instance.post(baseUrl + 'HICService.y?cmd=agree',{...defaultArgs,
    "sjid":args.sjid, 
    "agreeFlag":args.agreeFlag, /*赞标识  1 赞  0 取消赞*/
    });
};

export function apiComment(args = {}) {
    let defaultArgs = getDefaultArgs(args);
    return instance.post(baseUrl + 'HICService.y?cmd=comment',{...defaultArgs,
    "sjid":args.sjid, 
    "content":args.content, /*内容*/
	"replyID":args.replyID, /*若是回复：上级评论的dataid*/
    });
};

export function apiCollect(args = {}) {
    let defaultArgs = getDefaultArgs(args);
    return instance.post(baseUrl + 'HICService.y?cmd=colllect',{...defaultArgs,
    "sjid":args.sjid, 
    "collectFlag":args.collectFlag, /*收藏标识  1 收藏  0 取消收藏*/
    });
};

export function apiMsgList(args = {}) {
    let defaultArgs = getDefaultArgs(args);
    return instance.post(baseUrl + 'HICService.y?cmd=list',{...defaultArgs,
    });
};

export function apiUserInfo(args = {}) {
    let defaultArgs = getDefaultArgs(args);
    return instance.post(baseUrl + 'HICService.y?cmd=userInfo',{...defaultArgs,
    "userAuid":args.userAuid, /*用户auid*/
    });
};

export function apiEditMyInfo(args = {}) {
    let defaultArgs = getDefaultArgs(args);
    return instance.post(baseUrl + 'HICService.y?cmd=editMyInfo',{...defaultArgs,
    "nickName":args.nickName, /*昵称*/
    "phone":args.phone,
    "sex":args.sex, /*性别：男，女*/
    "birth":args.birth, /*生日*/
    "kkStatus":args.kkStatus, /*交友状态，可不传*/
	"markers":args.markers, /*标签，可不传*/
    });
};

export function apiEditNickName(args = {}) {
    let defaultArgs = getDefaultArgs(args);
    return instance.post(baseUrl + 'HICService.y?cmd=editNickName',{...defaultArgs,
    "nickName":args.nickName, /*昵称*/
    });
};

export function apiEditFace(args = {}) {
    let defaultArgs = getDefaultArgs(args);
    return instance.post(baseUrl + 'HICService.y?cmd=editFace',{...defaultArgs,
    "file1":args.file1, /*头像文件*/
    });
};












