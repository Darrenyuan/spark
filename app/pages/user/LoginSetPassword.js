import React from "react";

import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity
} from "react-native";
import styleUtil from "../../common/styleUtil";
import NavigatorPage from "../../components/NavigatorPage";
import { Icon } from "react-native-elements";
import navigate from "../../screens/navigate";
import LoginEnterInfo from "./LoginEnterInfo";
import LoginAgreement from "./LoginAgreement";
import CountDownText from "../../components/countdown/countDownText";
import CryptoJS from "react-native-crypto-js";

export default class LoginSetPassword extends NavigatorPage {
  static defaultProps = {
    ...NavigatorPage.navigatorStyle,
    // navBarHidden: true,
    navigationBarInsets: false,
    style: { backgroundColor: "transparent", borderBottomWidth: 0 },
    scene: navigate.sceneConfig.PushFromRight,
    leftView: (
      <TouchableOpacity
        style={{ paddingLeft: 10 }}
        onPress={_ => {
          navigate.pop();
        }}
      >
        <Icon
          name={"ios-arrow-back"}
          type={"ionicon"}
          color={"white"}
          size={25}
        />
      </TouchableOpacity>
    )
  };

  constructor(props) {
    super(props);
    Object.assign(this.state, {
      verifyCode: "",
      password: "",
      showPassword: false,
      isSend: false,
      isCountEnd: false
    });
    this._verifyCode = "1111";
  }

  componentDidMount() {
    super.componentDidMount();

    this._netSendVerifyCode();
  }

  _netSendVerifyCode = () => {
    let phone = this.props.phone;

    toast.loadingShow("获取短信验证码...");
    request
      .post(config.api.sendVerifyCode, {
        phone
      })
      .then(res => {
        toast.loadingHide();
        if (res.code === 1) {
          toast.success("短信验证码已发送");
          // this._verifyCode = res.data.code;
          this.setState({
            isSend: true,
            isCountEnd: false
          });
        }
      });
  };

  _netRegister = () => {
    let phone = this.props.phone;
    let encoded = CryptoJS.MD5(this.state.password);
    toast.modalLoading();
    request
      .post(config.api.register, {
        phone,
        password: encoded
      })
      .then(res => {
        toast.modalLoadingHide();
        if (res.code === 1) {
          navigate.pushNotNavBar(LoginEnterInfo);
        }
      });
  };

  _checkCodeValid = () => {
    const { verifyCode } = this.state;
    if (verifyCode.length == 4 && verifyCode == this._verifyCode) {
      return true;
    }
    return false;
  };

  _checkAllInputValid = () => {
    const { verifyCode, password } = this.state;
    if (
      verifyCode.length == 4 &&
      verifyCode == this._verifyCode &&
      password.length >= 6
    ) {
      return true;
    }
    return false;
  };

  _onCountEnd = () => {
    this.setState({
      isCountEnd: true
    });
  };

  _btnStyle = bool => (bool ? styleUtil.themeColor : styleUtil.disabledColor);

  renderPage() {
    const { verifyCode, password, showPassword } = this.state;
    const { resetPassword } = this.props;

    return (
      <View style={styleUtil.container}>
        <View style={{ overflow: "hidden" }}>
          <ImageBackground
            style={{
              width: styleUtil.window.width,
              height: styleUtil.window.width * (222.0 / 375.0),
              resizeMode: "contain",
              justifyContent: "center",
              alignItems: "center"
            }}
            source={require("../../assets/image/login_head_background.png")}
          >
            <View
              style={{
                flexDirection: "row"
              }}
            >
              <Image source={require("../../assets/image/login_spark.png")} />
              <View style={{ justifyContent: "flex-end", marginLeft: 10 }}>
                <Text
                  style={{
                    fontSize: 30,
                    color: "white",
                    fontWeight: "500",
                    marginBottom: 8
                  }}
                >
                  {"火花"}
                </Text>
                <Text style={{ fontSize: 14, color: "white", marginBottom: 2 }}>
                  {"重新发现身边的世界"}
                </Text>
              </View>
            </View>
          </ImageBackground>

          <View style={{ marginTop: 80, marginHorizontal: 40 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-end"
              }}
            >
              <Image
                source={require("../../assets/image/login_verify_code.png")}
              />
              <TextInput
                placeholder="请输入验证码"
                placeholderTextColor="#E5E5E5"
                autoCorrect={false}
                underlineColorAndroid="transparent"
                keyboardType={"number-pad"}
                style={[styles.inputField, { flex: 1 }]}
                value={verifyCode}
                maxLength={4}
                autoFocus={true}
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
                        : styleUtil.themeColor
                    }
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
                    intervalText={sec => sec + "秒重新获取"} // 定时的文本回调
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
                marginTop: 12,
                marginLeft: 24,
                fontSize: 14,
                height: 15,
                color: this._checkCodeValid() ? "#B6B6B6" : styleUtil.themeColor
              }}
            >
              {verifyCode.length < 4
                ? ""
                : this._checkCodeValid()
                ? "验证码正确"
                : "*验证码错误"}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 20,
                justifyContent: "flex-end"
              }}
            >
              <Image
                source={require("../../assets/image/login_password.png")}
              />
              <TextInput
                placeholder="请输入密码"
                secureTextEntry={!showPassword}
                placeholderTextColor="#E5E5E5"
                autoCorrect={false}
                underlineColorAndroid="transparent"
                keyboardType={"number-pad"}
                style={[styles.inputField, { flex: 1 }]}
                value={password}
                maxLength={30}
                onChangeText={text => {
                  this.setState({ password: text });
                }}
              />
              <TouchableOpacity
                style={{ position: "absolute" }}
                onPress={_ => {
                  this.setState({ showPassword: !showPassword });
                }}
              >
                <Image
                  source={
                    showPassword
                      ? require("../../assets/image/login_close_eye.png")
                      : require("../../assets/image/login_open_eye.png")
                  }
                />
              </TouchableOpacity>
            </View>
            <Text
              style={{
                marginTop: 12,
                marginLeft: 24,
                fontSize: 14,
                color: "#B6B6B6"
              }}
            >
              {"6位以上字母或文字"}
            </Text>
            <TouchableOpacity
              activeOpacity={this._checkAllInputValid() ? 0.5 : 1}
              style={[
                styles.buttonBox,
                {
                  backgroundColor: this._btnStyle(this._checkAllInputValid()),
                  borderColor: this._btnStyle(this._checkAllInputValid())
                }
              ]}
              onPress={_ => {
                if (this._checkAllInputValid()) {
                  this._netRegister();
                }
              }}
            >
              <Text style={styles.buttonText}>
                {resetPassword ? "重置密码并登录" : "注册"}
              </Text>
            </TouchableOpacity>
            {!resetPassword && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  marginTop: 30
                }}
              >
                <Text style={{ fontSize: 14, color: "#939393" }}>
                  {"注册即同意"}
                </Text>
                <TouchableOpacity
                  onPress={_ => {
                    navigate.pushNotNavBar(LoginAgreement);
                  }}
                >
                  <Text style={{ fontSize: 14, color: styleUtil.themeColor }}>
                    {"《用户协议》"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: styleUtil.backgroundColor
  },
  signUpBox: {
    marginTop: 10
    // padding: 10
  },
  title: {
    marginBottom: 20,
    color: "#333",
    fontSize: 20,
    textAlign: "center"
  },
  inputField: {
    marginLeft: 8,
    height: 35,
    paddingLeft: 8,
    color: "#454545",
    fontSize: 16,
    backgroundColor: "transparent",
    borderBottomWidth: styleUtil.borderSeparator,
    // borderWidth: styleUtil.borderSeparator,
    borderColor: styleUtil.borderColor
  },
  buttonBox: {
    marginTop: 80,
    backgroundColor: styleUtil.themeColor,
    height: 48,
    borderWidth: 1,
    borderColor: styleUtil.themeColor,
    borderRadius: 24
  },
  buttonText: {
    fontSize: 20,
    color: "#fff",
    textAlign: "center",
    marginTop: 12
  },
  verifyCodeBox: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between"
  },
  countBtn: {
    width: 100,
    height: 25,
    borderWidth: 1,
    borderColor: styleUtil.themeColor,
    backgroundColor: styleUtil.themeColor,
    borderRadius: 4,
    position: "absolute",
    right: 0,
    justifyContent: "center"
  },
  countBtnText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 16
  },
  closeModal: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center"
  }
});
