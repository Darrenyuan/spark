import React from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Platform,
} from 'react-native';
import { Avatar, Icon } from 'react-native-elements';
import md5 from 'react-native-md5';
import ImageCropPicker from 'react-native-image-crop-picker';
import styleUtil from '../../common/styleUtil';
import NavigatorPage from '../../components/NavigatorPage';
import OverlayModal from '../../components/OverlayModal';
import config from '../../common/config';
import navigate from '../../screens/navigate';
import DatePicker from '../../components/DatePicker';
import LoginMoreInfo from './LoginMoreInfo';
import { apiEditRegistInfo1 } from '../../services/axios/api';

export default class LoginEnterInfo extends NavigatorPage {
  static defaultProps = {
    ...NavigatorPage.navigatorStyle,
    navigationBarInsets: false,
    style: { backgroundColor: 'transparent', borderBottomWidth: 0 },
    scene: navigate.sceneConfig.PushFromRight,
    leftView: (
      <TouchableOpacity
        style={{ paddingLeft: 10 }}
        onPress={_ => {
          navigate.pop();
        }}
      >
        <Icon name="ios-arrow-back" type="ionicon" color="white" size={25} />
      </TouchableOpacity>
    ),
  };

  constructor(props) {
    super(props);
    this.state = {
      face: null,
      nickName: '',
      birth: '',
      sex: '男',
    };
  }

  // TODO
  _netRegisterInfo1 = () => {
    const { face, nickName, birth, sex } = this.state;
    console.log(face);
    const auid = '';
    const M9 = new Date().getTime();
    const strM9 = `${M9}`;
    const option = {
      nickName,
      birth,
      sex,
      face: {},
      auid,
      M0: Platform.OS === 'ios' ? 'IMMC' : 'MMC',
      M2: '',
      M3: '120.45435,132.32424',
      M8: md5.hex_md5(auid + strM9),
      M9: strM9,
    };
    if (face !== null) {
      option.face.uri = face.path;
    } else {
      option.face.uri = '../../assets/image/login_default_avatar.png';
    }
    toast.modalLoading();
    console.log(option);

    apiEditRegistInfo1(option).then(res => {
      toast.modalLoadingHide();
      console.log(res.data);
      console.log('qqqqqqqqqqq');
      if (res.data.code === 1) {
        // TODO  同步redux
        // config.setStatusAndMarker(res.data);
        navigate.pushNotNavBar(LoginMoreInfo, {
          phone: this.props.phone,
        });
      }
    });
  };

  _btnStyle = bool => (bool ? styleUtil.themeColor : styleUtil.disabledColor);

  _openCamera = type => {
    ImageCropPicker.openCamera({
      cropping: true,
      // compressImageQuality: 1
    }).then(image => {
      this.setState({ face: image });
    });
  };

  _selectLibrary = type => {
    ImageCropPicker.openPicker({
      multiple: false,
      // cropping: true,
      mediaType: 'photo',
      compressImageQuality: Platform.OS === 'ios' ? 0 : 1,
      minFiles: 1,
      maxFiles: 1,
    })
      .then(image => {
        this.setState({ face: image });
      })
      .catch(err => {
        if (err.code === 'E_PICKER_CANCELLED') {
        }
      });
  };

  _onClickAvatar = (type = 'avatar') => {
    const items = [
      {
        title: '拍照',
        onPress: _ => config.loadData(_ => this._openCamera(type)),
      },
      {
        title: '从相册中选取',
        onPress: _ => config.loadData(_ => this._selectLibrary(type)),
      },
    ];
    config.showAction(items);
  };

  showDatePicker = () => {
    let { birth } = this.state;
    const arr = birth.split('/');
    OverlayModal.show(
      <DatePicker
        selectedYear={arr[0]}
        selectedMonth={arr[1]}
        selectedDate={arr[2]}
        onDone={arr => {
          birth = arr.join('/');
          this.setState({ birth });
        }}
      />,
    );
  };

  renderPage() {
    const { face, nickName, birth, sex } = this.state;

    return (
      <TouchableOpacity
        style={styleUtil.container}
        activeOpacity={1}
        onPress={_ => {
          Keyboard.dismiss();
        }}
      >
        <View style={{ overflow: 'hidden' }}>
          <ImageBackground
            style={{
              width: styleUtil.window.width,
              height: styleUtil.window.width * (222.0 / 375.0),
              resizeMode: 'contain',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
            source={require('../../assets/image/login_head_background.png')}
          >
            <TouchableOpacity
              style={{
                flexDirection: 'column',
                alignItems: 'center',
                marginBottom: 20,
              }}
              onPress={_ => {
                this._onClickAvatar();
                Keyboard.dismiss();
              }}
            >
              <Avatar size={71} rounded source={config.defaultAvatar(face ? face.path : '')} />
              <Text style={{ fontSize: 14, color: 'white', marginTop: 10 }}>修改头像</Text>
            </TouchableOpacity>
          </ImageBackground>

          <View style={{ marginTop: 80, marginHorizontal: 40 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}
            >
              <Image source={require('../../assets/image/login_nick_name.png')} />
              <TextInput
                placeholder="请输入你的昵称"
                placeholderTextColor="#E5E5E5"
                autoCorrect={false}
                underlineColorAndroid="transparent"
                style={[styles.inputField, { flex: 1 }]}
                value={nickName}
                maxLength={11}
                onChangeText={text => {
                  this.setState({ nickName: text });
                }}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 40,
                justifyContent: 'flex-end',
              }}
            >
              <Image source={require('../../assets/image/login_birthday.png')} />

              <TextInput
                editable={false}
                placeholder="请选择你的生日"
                placeholderTextColor="#E5E5E5"
                autoCorrect={false}
                underlineColorAndroid="transparent"
                style={[styles.inputField, { flex: 1 }]}
                value={birth}
                maxLength={11}
              />
              <TouchableOpacity
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                }}
                onPress={_ => {
                  this.showDatePicker();
                  Keyboard.dismiss();
                }}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 30,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center' }}
                onPress={_ => {
                  this.setState({ sex: '男' });
                  Keyboard.dismiss();
                }}
              >
                <Icon
                  name={sex == '男' ? 'ios-radio-button-on' : 'ios-radio-button-off'}
                  type="ionicon"
                  color={styleUtil.themeColor}
                  size={25}
                />
                <Text style={{ fontSize: 16, color: '#454545', marginLeft: 15 }}>男性</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: 60,
                }}
                onPress={_ => {
                  this.setState({ sex: '女' });
                  Keyboard.dismiss();
                }}
              >
                <Icon
                  name={sex == '女' ? 'ios-radio-button-on' : 'ios-radio-button-off'}
                  type="ionicon"
                  color={styleUtil.themeColor}
                  size={25}
                />
                <Text style={{ fontSize: 16, color: '#454545', marginLeft: 15 }}>女性</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              activeOpacity={nickName.length > 0 && birth.length > 0 ? 0.5 : 1}
              style={[
                styles.buttonBox,
                {
                  backgroundColor: this._btnStyle(nickName.length > 0 && birth.length > 0),
                  borderColor: this._btnStyle(nickName.length > 0 && birth.length > 0),
                },
              ]}
              onPress={_ => {
                if (nickName.length > 0 && birth.length > 0) {
                  this._netRegisterInfo1();
                }
              }}
            >
              <Text style={styles.buttonText}>下一步</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

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
    height: 44,
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
