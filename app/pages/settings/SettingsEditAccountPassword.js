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
import { apiEditPassword } from '../../services/axios/api';
import CryptoJS from 'react-native-crypto-js';
import toast from '../../common/toast';

class SettingsEditAccountPassword extends NavigatorPage {
  static defaultProps = {
    ...NavigatorPage.navigatorStyle,
    navBarHidden: false,
    navigationBarInsets: true,
    title: '修改登录密码',
  };

  constructor(props) {
    super(props);
    this.state = {
      password: '',
      showPassword: false,
      newPassword: '',
      showNewPassword: false,
    };
  }

  _btnStyle = bool => (bool ? styleUtil.themeColor : styleUtil.disabledColor);
  _editPassword = () => {
    const { password, newPassword } = this.state;
    let M9 = new Date().getTime();
    let strM9 = '' + M9;
    let { auid, loginToken } = this.props.loginInfo;
    let { coordsStr } = this.props.locationInfo;
    let { phone } = this.props.userInfo;
    apiEditPassword({
      phone: phone,
      oldPassword: CryptoJS.MD5(password),
      password: CryptoJS.MD5(newPassword),
      auid: auid,
      M0: Platform.OS === 'ios' ? 'IMMC' : 'MMC',
      M2: loginToken,
      M3: coordsStr,
      M8: md5.hex_md5(auid + strM9),
      M9: strM9,
    }).then(res => {
      if (res.data.code === 1) {
        // navigate.pushNotNavBar(LoginEnterInfo);
        toast.success('修改密码成功');
        navigate.pop();
      } else {
        toast.info(res.data.msg);
      }
    });
  };
  renderPage() {
    const { showNewPassword, password, showPassword, newPassword } = this.state;

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
              placeholder="请输入当前密码"
              secureTextEntry={!showPassword}
              placeholderTextColor="#E5E5E5"
              // autoCorrect={false}
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
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
              marginTop: 15,
            }}
          >
            <Image source={require('../../assets/image/login_password.png')} />
            <TextInput
              placeholder="请输入新密码"
              secureTextEntry={!showNewPassword}
              placeholderTextColor="#E5E5E5"
              // autoCorrect={false}
              underlineColorAndroid="transparent"
              keyboardType={'number-pad'}
              style={[styles.inputField, { flex: 1 }]}
              value={newPassword}
              maxLength={30}
              onChangeText={text => {
                this.setState({ newPassword: text });
              }}
            />
            <TouchableOpacity
              style={{ position: 'absolute' }}
              onPress={_ => {
                this.setState({ showNewPassword: !showNewPassword });
              }}
            >
              <Image
                source={
                  showNewPassword
                    ? require('../../assets/image/login_close_eye.png')
                    : require('../../assets/image/login_open_eye.png')
                }
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            activeOpacity={newPassword.length >= 6 && password.length >= 6 ? 0.5 : 1}
            style={[
              styles.buttonBox,
              {
                backgroundColor: this._btnStyle(newPassword.length >= 6 && password.length >= 6),
                borderColor: this._btnStyle(newPassword.length >= 6 && password.length >= 6),
              },
            ]}
            onPress={_ => {
              if (newPassword.length >= 6 && password.length >= 6) {
                this._editPassword();
                // navigate.pushNotNavBar(LoginEnterInfo);
              }
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
    actions: bindActionCreators({ ...actions }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingsEditAccountPassword);
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
