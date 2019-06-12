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
import navigate from '../../screens/navigate';
import LoginSetPassword from './LoginSetPassword';
import request from '../../common/request';
import toast from '../../common/toast';
import LoginEnterPassword from './LoginEnterPassword';

export default class LoginEnterPhone extends NavigatorPage {
  static defaultProps = {
    ...NavigatorPage.navigatorStyle,
    navBarHidden: true,
    navigationBarInsets: false,
    scene: navigate.sceneConfig.FloatFromBottom,
  };

  constructor(props) {
    super(props);
    Object.assign(this.state, {
      phone: '',
    });
  }

  _netCheckPhone = () => {
    let body = {
      phone: this.state.phone,
    };

    toast.modalLoading();
    request
      .post(config.api.checkPhone, body)
      .then(res => {
        toast.modalLoadingHide();
        if (res.code === 1) {
          if (res.data.registFlag == 0) {
            navigate.pushNotNavBar(LoginSetPassword, {
              phone: this.state.phone,
            });
          } else {
            navigate.pushNotNavBar(LoginEnterPassword, {
              phone: this.state.phone,
            });
          }
        }
      })
      .catch(err => {
        toast.modalLoadingHide();
      });
  };

  _btnStyle = bool => (bool ? styleUtil.themeColor : styleUtil.disabledColor);

  renderPage() {
    const { phone } = this.state;

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
              <Image source={require('../../assets/image/login_phone.png')} />
              <TextInput
                placeholder="请输入手机号码"
                placeholderTextColor="#E5E5E5"
                autoCorrect={false}
                underlineColorAndroid="transparent"
                keyboardType={'number-pad'}
                style={[styles.inputField, { flex: 1 }]}
                value={phone}
                maxLength={11}
                autoFocus={true}
                onChangeText={text => {
                  this.setState({ phone: text });
                }}
              />
            </View>
            <TouchableOpacity
              activeOpacity={phone.length == 11 ? 0.5 : 1}
              style={[
                styles.buttonBox,
                {
                  backgroundColor: this._btnStyle(phone.length == 11),
                  borderColor: this._btnStyle(phone.length == 11),
                },
              ]}
              onPress={_ => {
                if (phone.length == 11) {
                  this._netCheckPhone();
                  Keyboard.dismiss();
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
