import React from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import md5 from 'react-native-md5';
import * as actions from '../../services/redux/actions';
import styleUtil from '../../common/styleUtil';
import NavigatorPage from '../../components/NavigatorPage';
import navigate from '../../screens/navigate';
import { ListRow } from 'teaset';
import SettingsEditProfileName from './SettingsEditProfileName';
import config from '../../common/config';
import { Avatar } from 'react-native-elements';
import OverlayModal from '../../components/OverlayModal';
import DatePicker from '../../components/DatePicker';
import LoginPersonal from '../user/LoginPersonal';
import ImageCropPicker from 'react-native-image-crop-picker';
import {
  apiUserInfo,
  apiEditMyBackground,
  apiEditFace,
  apiEditMyInfo,
} from '../../services/axios/api';
import toast from '../../common/toast';

let _submit;
class SettingsEditProfile extends NavigatorPage {
  static defaultProps = {
    ...NavigatorPage.navigatorStyle,
    navBarHidden: false,
    navigationBarInsets: true,
    title: '修改个人资料',
    rightView: (
      <TouchableOpacity
        style={{
          backgroundColor: styleUtil.themeColor,
          paddingHorizontal: 15,
          height: 30,
          borderRadius: 15,
          flexDirection: 'row',
          alignItems: 'center',
          marginRight: 10,
        }}
        onPress={_ => {
          _submit();
        }}
      >
        <Text style={{ fontSize: 16, color: '#fff', textAlign: 'center' }}>{'保存'}</Text>
      </TouchableOpacity>
    ),
  };

  constructor(props) {
    super(props);
    userInfo = props.userInfo;
    this.state = {
      avatar: userInfo.face,
      backgroundImage: userInfo.myBackground,
      nickName: userInfo.nickName,
      birth: userInfo.birth,
      sex: userInfo.sex,
      kkStatus: userInfo.kkStatus,
      markers: userInfo.markers,
      markersArr: [],
    };
    kkStatusTypes = props.configInfo.kkStatusTypes;
  }

  componentDidMount() {
    let M9 = new Date().getTime();
    let strM9 = '' + M9;
    let { auid, loginToken } = this.props.loginInfo;
    let { coordsStr } = this.props.locationInfo;
    let { backgroundImage, markers } = this.state;
    let expansionMarkerTypes = [];
    this.props.configInfo.markerTypes.map(item => {
      item.childs.map(item => {
        expansionMarkerTypes.push(item);
      });
    });
    let arr = [];
    if (markers.length > 1 && expansionMarkerTypes.length > 0) {
      expansionMarkerTypes.map(item => {
        markers.split(',').map(v => {
          item.typeID == v && arr.push(item);
        });
      });
    }
    this.setState({ markersArr: arr });
    apiUserInfo({
      userAuid: auid,
      auid: auid,
      M0: Platform.OS === 'ios' ? 'IMMC' : 'MMC',
      M2: loginToken,
      M3: coordsStr,
      M8: md5.hex_md5(auid + strM9),
      M9: strM9,
    }).then(res => {
      console.log(res);
    });
  }

  componentDidUpdate() {
    let M9 = new Date().getTime();
    let strM9 = '' + M9;
    let { auid, loginToken } = this.props.loginInfo;
    let { coordsStr } = this.props.locationInfo;
    let { backgroundImage, avatar, nickName, sex, kkStatus, markers, markersArr } = this.state;
    let markersStr = markersArr.map(item => {
      return item.typeID;
    });
    let M = {
      auid: auid,
      M0: Platform.OS === 'ios' ? 'IMMC' : 'MMC',
      M2: loginToken,
      M3: coordsStr,
      M8: md5.hex_md5(auid + strM9),
      M9: strM9,
    };
    _submit = () => {
      toast.modalLoading();
      const backgroundPromise = apiEditMyBackground({
        file1: backgroundImage,
        ...M,
      });
      const facePromise = apiEditFace({
        file1: avatar,
        ...M,
      });
      const myInfoPromise = apiEditMyInfo({
        nickName: nickName,
        sex: sex,
        kkStatus: kkStatus,
        markers: markersStr,
        ...M,
      });
      const parame = [];
      backgroundImage !== '' && parame.push(backgroundPromise);
      avatar !== '' && parame.push(facePromise);
      parame.push(myInfoPromise);
      Promise.all(parame).then(
        res => {
          toast.modalLoadingHide();
          console.log(res);
          toast.success('修改成功！');
          navigate.pop();
          this.props.actions
            .applyLogon({
              ...M,
            })
            .then(res => {
              console.log(res);
              console.log('res_______________');
            });
        },
        err => {
          toast.modalLoadingHide();
          toast.fail('修改失败！');
        },
      );
    };
  }

  _openCamera = type => {
    ImageCropPicker.openCamera({
      cropping: true,
    }).then(image => {
      type === 'avatar' && this.setState({ avatar: image.path });
      type === 'backgroundImage' && this.setState({ backgroundImage: image.path });
    });
  };

  _selectLibrary = type => {
    ImageCropPicker.openPicker({
      multiple: false,
      mediaType: 'photo',
      compressImageQuality: Platform.OS === 'ios' ? 0 : 1,
      minFiles: 1,
      maxFiles: 1,
    })
      .then(image => {
        type === 'avatar' && this.setState({ avatar: image.path });
        type === 'backgroundImage' && this.setState({ backgroundImage: image.path });
      })
      .catch(err => {
        if (err.code === 'E_PICKER_CANCELLED') {
          return;
        }
        alert('出错啦~');
      });
  };

  _onClickEditImage = type => {
    let items = [
      { title: '拍照', onPress: _ => config.loadData(_ => this._openCamera(type)) },
      { title: '从相册中选取', onPress: _ => config.loadData(_ => this._selectLibrary(type)) },
    ];
    config.showAction(items);
  };

  _btnStyle = bool => (bool ? styleUtil.themeColor : styleUtil.disabledColor);

  _renderTitle = (title, subTitle) => {
    return (
      <View style={{ flexDirection: 'row' }}>
        <Text style={{ color: '#454545', fontSize: 14, fontWeight: '600' }}>{title}</Text>
        <Text style={{ color: '#DFDFDF', fontSize: 14, marginLeft: 15 }}>{subTitle}</Text>
      </View>
    );
  };
  _renderDetail = type => {
    const { avatar, backgroundImage } = this.state;
    if (type === 'avatar') {
      return (
        <Avatar
          size={48}
          rounded
          source={
            avatar === ''
              ? require('../../assets/image/login_default_avatar.png')
              : {
                  uri: avatar && avatar.replace(/cs.png/g, '.png'),
                }
          }
        />
      );
    } else {
      return (
        <Avatar
          size={48}
          source={
            backgroundImage === ''
              ? require('../../assets/image/login_head_background.png')
              : {
                  uri: backgroundImage && backgroundImage.replace(/cs.png/g, '.png'),
                }
          }
        />
      );
    }
  };
  _formatMarkers = () => {
    let string = '';
    const { markersArr } = this.state;
    if (markersArr.length > 0) {
      markersArr.map(item => {
        string = string + item.typeName + ' ';
      });
    }
    return string;
  };
  _formatkkStatus = kkStatus => {
    let string = '';
    if (kkStatusTypes.length > 0) {
      kkStatusTypes.map(v => {
        if (kkStatus == v.typeID) {
          string = v.typeName;
        }
      });
    }
    return string;
  };
  _renderGenderMenu = () => {
    let items = [
      {
        title: '男',
        onPress: _ => this.setState({ sex: '男' }),
      },
      {
        title: '女',
        onPress: _ => this.setState({ sex: '女' }),
      },
    ];
    config.showAction(items);
  };

  _renderDatePicker = () => {
    let birth = this.state.birth;
    let arr = birth ? birth.split('-') : [];
    OverlayModal.show(
      <DatePicker
        selectedYear={arr[0]}
        selectedMonth={arr[1]}
        selectedDate={arr[2]}
        onDone={arr => {
          birth = arr.join('-');
          this.setState({ birth: birth });
        }}
      />,
    );
  };

  _renderRelationshipMenu = () => {
    let items = [];
    for (let item of kkStatusTypes) {
      items.push({
        title: item.typeName,
        onPress: _ => this.setState({ kkStatus: item.typeID }),
      });
    }
    config.showAction(items);
  };
  renderPage() {
    const { nickName, sex, birth, kkStatus, markers, markersArr } = this.state;
    const { markerTypes } = this.props.configInfo;
    return (
      <View style={{ backgroundColor: 'white', flex: 1 }}>
        <View style={{ flex: 1 }}>
          <ListRow
            title={this._renderTitle('修改头像')}
            detail={this._renderDetail('avatar')}
            onPress={_ => {
              this._onClickEditImage('avatar');
            }}
            topSeparator={'none'}
            bottomSeparator={'indent'}
          />
          <ListRow
            title={this._renderTitle('换背景图片')}
            detail={this._renderDetail('backgroundImage')}
            onPress={_ => {
              this._onClickEditImage('backgroundImage');
            }}
            topSeparator={'none'}
            bottomSeparator={'indent'}
          />
          <ListRow
            title={this._renderTitle('昵称', '一个月只能变更1次')}
            detail={nickName}
            onPress={_ => {
              navigate.pushNotNavBar(SettingsEditProfileName, {
                nickName: nickName,
                pageCallback: nickName => {
                  this.setState({ nickName });
                },
              });
            }}
            topSeparator={'none'}
            bottomSeparator={'indent'}
          />
          <ListRow
            title={this._renderTitle('性别', '只能变更1次')}
            detail={sex}
            onPress={_ => {
              this._renderGenderMenu();
            }}
            topSeparator={'none'}
            bottomSeparator={'indent'}
          />
          <ListRow
            title={this._renderTitle('生日', '不能变更')}
            detail={birth}
            // onPress={_ => {
            //   this._renderDatePicker();
            // }}
            topSeparator={'none'}
            bottomSeparator={'indent'}
          />
          <ListRow
            title={this._renderTitle('交友状态')}
            detail={this._formatkkStatus(kkStatus)}
            onPress={_ => {
              this._renderRelationshipMenu();
            }}
            topSeparator={'none'}
            bottomSeparator={'indent'}
          />
          <ListRow
            title={this._renderTitle('个性标签', markersArr.length + '/20')}
            detail={this._formatMarkers()}
            onPress={_ => {
              navigate.pushNotNavBar(LoginPersonal, {
                markers: markersArr,
                markersCategorys: markerTypes,
                pageCallback: markersArr => {
                  this.setState({ markersArr });
                },
              });
            }}
            topSeparator={'none'}
            bottomSeparator={'indent'}
          />
        </View>
      </View>
    );
  }
}
function mapStateToProps(state) {
  return {
    configInfo: state.configInfo,
    userInfo: state.userInfo,
    loginInfo: state.loginInfo,
    locationInfo: state.locationInfo,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...actions }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingsEditProfile);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: styleUtil.backgroundColor,
  },
  signUpBox: {
    marginTop: 10,
    // padding: 10
  },
  title: {
    marginBottom: 20,
    color: '#333',
    fontSize: 20,
    textAlign: 'center',
  },
  inputField: {
    marginLeft: 8,
    height: 35,
    paddingLeft: 8,
    color: '#454545',
    fontSize: 16,
    backgroundColor: 'transparent',
    borderBottomWidth: styleUtil.borderSeparator,
    // borderWidth: styleUtil.borderSeparator,
    borderColor: styleUtil.borderColor,
  },
  buttonBox: {
    marginTop: 80,
    backgroundColor: styleUtil.themeColor,
    height: 48,
    borderWidth: 1,
    borderColor: styleUtil.themeColor,
    borderRadius: 24,
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    marginTop: 12,
  },
  verifyCodeBox: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  countBtn: {
    width: 110,
    height: 40,
    padding: 10,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: styleUtil.themeColor,
    backgroundColor: styleUtil.themeColor,
    borderRadius: 4,
  },
  countBtnText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
  },
  closeModal: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
});
