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
} from 'react-native';
import md5 from 'react-native-md5';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../services/redux/actions';
import styleUtil from '../../common/styleUtil';
import NavigatorPage from '../../components/NavigatorPage';
import LoadingMore from '../../components/load/LoadingMore';
import navigate from '../../screens/navigate';
import { ListRow } from 'teaset';
import SettingsAbout from './SettingsAbout';
import LoginEnterInfo from '../user/LoginEnterInfo';
import CountDownText from '../../components/countdown/countDownText';
import { apiSendCodeToPhone, apiEditPhone } from '../../services/axios/api';
import CryptoJS from 'react-native-crypto-js';
import LoginEnterPhone from '../user/LoginEnterPhone';

class SettingsEditAccountPhone extends NavigatorPage {
  static defaultProps = {
    ...NavigatorPage.navigatorStyle,
    navBarHidden: false,
    navigationBarInsets: true,
    title: '修改手机号码',
  };

  constructor(props) {
    super(props);
    this.state = {
      verifyCode: '',
      password: '',
      showPassword: false,
      phone: '',
      isCountEnd: true,
    };
    this._verifyCode = '';
  }

  _btnStyle = bool => (bool ? styleUtil.themeColor : styleUtil.disabledColor);
  _onCountEnd = () => {
    this.setState({
      isCountEnd: true,
    });
  };
  _editPhone = () => {
    const { phone, password } = this.state;
    let M9 = new Date().getTime();
    let strM9 = '' + M9;
    let { auid, loginToken } = this.props.loginInfo;
    let { coordsStr } = this.props.locationInfo;
    apiEditPhone({
      phone: phone,
      password: CryptoJS.MD5(password),
      auid: auid,
      M0: Platform.OS === 'ios' ? 'IMMC' : 'MMC',
      M2: loginToken,
      M3: coordsStr,
      M8: md5.hex_md5(auid + strM9),
      M9: strM9,
    }).then(res => {
      if (res.data.code === 1) {
        toast.success('手机号修改成功！');
        this.props.applyLogon({
          auid: auid,
          M2: loginToken,
          M3: coordsStr,
          M8: md5.hex_md5(auid + strM9),
        });
        navigate.pop();
      } else {
        toast.info(res.data.msg);
      }
    });
  };
  _checkAllInputValid = () => {
    const { verifyCode, password, phone } = this.state;
    if (
      password.length >= 6 &&
      phone.length == 11 &&
      verifyCode !== '' &&
      verifyCode === this._verifyCode
    ) {
      return true;
    }

    return false;
  };
  _netSendVerifyCode = () => {
    let M9 = new Date().getTime();
    let strM9 = '' + M9;
    let { auid, loginToken } = this.props.loginInfo;
    let { coordsStr } = this.props.locationInfo;
    let { phone } = this.props.userInfo;
    apiSendCodeToPhone({
      phone: phone,
      auid: auid,
      M0: Platform.OS === 'ios' ? 'IMMC' : 'MMC',
      M2: loginToken,
      M3: coordsStr,
      M8: md5.hex_md5(auid + strM9),
      M9: strM9,
    }).then(res => {
      toast.modalLoadingHide();
      console.log(res);
      if (res.data.code === 1) {
        toast.success('短信验证码已发送');
        this._verifyCode = res.data.data.code;
        this.setState({
          // isSend: true,
          isCountEnd: false,
        });
      }
    });
  };
  renderPage() {
    const { verifyCode, password, showPassword, phone } = this.state;

    return (
      <View
        style={{
          backgroundColor: 'white',
          flex: 1,
          paddingHorizontal: 30,
          paddingTop: 30,
        }}
      >
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <Image source={require('../../assets/image/login_password.png')} />
            <TextInput
              placeholder="请输入密码"
              secureTextEntry={!showPassword}
              placeholderTextColor="#E5E5E5"
              // autoCorrect={true}
              autoFocus={true}
              underlineColorAndroid="transparent"
              keyboardType={'number-pad'}
              style={[styles.inputField, { flex: 1 }]}
              value={password}
              maxLength={30}
              onChangeText={text => {
                this.setState({ password: text });
              }}
            />
            <TouchableOpacity
              style={{ position: 'absolute' }}
              onPress={_ => {
                this.setState({ showPassword: !showPassword });
              }}
            >
              <Image
                source={
                  showPassword
                    ? require('../../assets/image/login_close_eye.png')
                    : require('../../assets/image/login_open_eye.png')
                }
              />
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
            <Image source={require('../../assets/image/login_phone.png')} />
            <TextInput
              placeholder="请输入新的手机号码"
              placeholderTextColor="#E5E5E5"
              // autoCorrect={false}
              underlineColorAndroid="transparent"
              keyboardType={'number-pad'}
              style={[styles.inputField, { flex: 1 }]}
              value={phone}
              maxLength={11}
              onChangeText={text => {
                this.setState({ phone: text });
              }}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
              marginTop: 15,
            }}
          >
            <Image source={require('../../assets/image/login_verify_code.png')} />
            <TextInput
              placeholder="请输入验证码"
              placeholderTextColor="#E5E5E5"
              // autoCorrect={false}
              underlineColorAndroid="transparent"
              keyboardType={'number-pad'}
              style={[styles.inputField, { flex: 1 }]}
              value={verifyCode}
              maxLength={4}
              onChangeText={text => {
                this.setState({ verifyCode: text });
              }}
            />
            {!this.state.isCountEnd ? (
              <View
                style={[
                  styles.countBtn,
                  {
                    backgroundColor: !this.state.isCountEnd
                      ? styleUtil.disabledColor
                      : styleUtil.themeColor,
                    borderColor: !this.state.isCountEnd
                      ? styleUtil.disabledColor
                      : styleUtil.themeColor,
                  },
                ]}
              >
                <CountDownText
                  style={[styles.countBtnText, { fontSize: 12 }]}
                  countType="seconds" // 计时类型：seconds / date
                  auto={true} // 自动开始
                  afterEnd={this._onCountEnd} // 结束回调
                  timeLeft={60} // 正向计时 时间起点为0秒
                  step={-1} // 计时步长，以秒为单位，正数则为正计时，负数为倒计时
                  startText="获取验证码" // 开始的文本
                  endText="获取验证码" // 结束的文本
                  intervalText={sec => sec + '秒重新获取'} // 定时的文本回调
                />
              </View>
            ) : (
              <TouchableOpacity
                activeOpacity={0.5}
                style={styles.countBtn}
                onPress={this._netSendVerifyCode}
              >
                <Text style={styles.countBtnText}>获取验证码</Text>
              </TouchableOpacity>
            )}
          </View>
          <Text
            style={{
              marginTop: 10,
              marginLeft: 24,
              fontSize: 14,
              height: 18,
              color: verifyCode === this._verifyCode ? '#B6B6B6' : styleUtil.themeColor,
            }}
          >
            {verifyCode.length < 4
              ? ''
              : verifyCode === this._verifyCode
              ? '验证码正确'
              : '*验证码错误'}
          </Text>
          <TouchableOpacity
            activeOpacity={this._checkAllInputValid() ? 0.5 : 1}
            style={[
              styles.buttonBox,
              {
                backgroundColor: this._btnStyle(this._checkAllInputValid()),
                borderColor: this._btnStyle(this._checkAllInputValid()),
              },
            ]}
            onPress={_ => {
              // if (verifyCode.length == 4 && password.length >= 6) {
              //   navigate.pushNotNavBar(LoginEnterInfo);
              // }
              this._checkAllInputValid() && this._editPhone();
            }}
          >
            <Text style={styles.buttonText}>{'确定变更'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
function mapStateToProps(state) {
  return {
    userInfo: state.userInfo,
    loginInfo: state.loginInfo,
    locationInfo: state.locationInfo,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    applyLogon: bindActionCreators({ ...actions }, dispatch).applyLogon,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingsEditAccountPhone);

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
    height: 46,
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
