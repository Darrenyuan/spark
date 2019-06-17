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
} from 'react-native';
import styleUtil from '../../common/styleUtil';
import NavigatorPage from '../../components/NavigatorPage';
import { Icon } from 'react-native-elements';
import navigate from '../../screens/navigate';
import LoginSetPassword from './LoginSetPassword';
import CryptoJS from 'react-native-crypto-js';
import LoginEnterInfo from './LoginEnterInfo';
import config from '../../common/config';
import { apiLogin } from '../../services/axios/api';
import { bindActionCreators } from 'redux';
import * as actions from '../../services/redux/actions';
import { connect } from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import LocationService from '../../screens/LocationService';
import md5 from 'react-native-md5';
import Profile from '../profile/Profile';
import Nearby from '../nearby/Nearby';
import TabNavBar from '../../screens/TabNavBar';

class LoginEnterPassword extends NavigatorPage {
  static defaultProps = {
    ...NavigatorPage.navigatorStyle,
    navigationBarInsets: false,
    style: { backgroundColor: 'transparent', borderBottomWidth: 0 },
    scene: navigate.sceneConfig.PushFromRight,
    leftView: (
      <TouchableOpacity
        style={{ paddingLeft: 10 }}
        onPress={() => {
          navigate.pop();
        }}
      >
        <Icon name={'ios-arrow-back'} type={'ionicon'} color={'white'} size={25} />
      </TouchableOpacity>
    ),
  };

  constructor(props) {
    console.log('LoginEnterPassword');
    super(props);
    this.state = {
      password: '',
    };
  }

  _netApplyLogon = () => {
    const { loginInfo } = this.props.spark;
    let auid = loginInfo.auid;
    let M2 = loginInfo.loginToken;
    let M3 = LocationService.getLocationString();
    let M8 = md5.str_md5(auid + new Date().getTime());
    toast.modalLoading();
    this.props.actions.applyLogon({
      auid: auid,
      M2: M2,
      M3: M3,
      M8: M8,
    });
    // request.post(config.api.applyLogon, {}).then(res => {
    //   toast.modalLoadingHide();
    //   if (res.code === 1) {
    //     config.setUserToStorage(res.data.user);
    //   }
    // });
  };

  _netLogin = () => {
    let auid = '';
    let M2 = '';
    let M3 = LocationService.getLocationString();
    let M8 = md5.str_md5(auid + new Date().getTime());
    let phone = this.props.phone;
    let encoded = CryptoJS.MD5(this.state.password);
    toast.modalLoading();

    this.props.actions.login({ phone, auid, M2, M3, M8, password: encoded }).then(res => {
      toast.modalLoadingHide();
      if (res.data.code === 1) {
        this._netApplyLogon();
        navigate.pushNotNavBar(TabNavBar);
      }
    });

    // request
    //   .post(config.api.login, {
    //     phone,
    //     password: encoded,
    //   })
    //   .then(res => {
    //     toast.modalLoadingHide();
    //     if (res.code === 1) {
    //       config.setLoginInfoToStorage(res.data);
    //       this._netApplyLogin();
    //       navigate.popN(2);
    //     }
    //   });
  };

  _btnStyle = bool => (bool ? styleUtil.themeColor : styleUtil.disabledColor);

  renderPage() {
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
              justifyContent: 'center',
              alignItems: 'center',
            }}
            source={require('../../assets/image/login_head_background.png')}
          >
            <View
              style={{
                flexDirection: 'row',
              }}
            >
              <Image source={require('../../assets/image/login_spark.png')} />
              <View style={{ justifyContent: 'flex-end', marginLeft: 10 }}>
                <Text
                  style={{
                    fontSize: 30,
                    color: 'white',
                    fontWeight: '500',
                    marginBottom: 8,
                  }}
                >
                  {'火花'}
                </Text>
                <Text style={{ fontSize: 14, color: 'white', marginBottom: 2 }}>
                  {'重新发现身边的世界'}
                </Text>
              </View>
            </View>
          </ImageBackground>

          <View style={{ marginTop: 80, marginHorizontal: 40 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={require('../../assets/image/login_password.png')} />
              <TextInput
                placeholder="请输入密码"
                placeholderTextColor="#E5E5E5"
                autoCorrect={false}
                underlineColorAndroid="transparent"
                style={[styles.inputField, { flex: 1 }]}
                autoFocus={true}
                onChangeText={text => {
                  this.setState({ password: text });
                }}
              />
            </View>

            <TouchableOpacity
              activeOpacity={0.5}
              style={[
                styles.buttonBox,
                {
                  backgroundColor: this._btnStyle(true),
                  borderColor: this._btnStyle(true),
                },
              ]}
              onPress={this._netLogin}
            >
              <View>
                <Text style={styles.buttonText}>{'登录'}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                marginTop: 30,
                alignItems: 'center',
              }}
              onPress={() => {
                navigate.pushNotNavBar(LoginSetPassword, {
                  phone: this.props.phone,
                  resetPassword: true,
                });
              }}
            >
              <Text style={{ color: styleUtil.themeColor, fontSize: 14 }}>{'找回密码'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

function mapStateToProps(state) {
  return {
    spark: state,
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
)(LoginEnterPassword);

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
    height: 40,
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
