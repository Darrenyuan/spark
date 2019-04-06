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
import LoadingMore from "../../components/load/LoadingMore";
import { Icon } from "react-native-elements";
import navigate from "../../screens/navigate";
import LoginEnterInfo from "./LoginEnterInfo";
import LoginAgreement from "./LoginAgreement";

export default class LoginSetPassword extends NavigatorPage {
  static defaultProps = {
    ...NavigatorPage.navigatorStyle,
    // navBarHidden: true,
    navigationBarInsets: false,
    style: { backgroundColor: "transparent", borderBottomWidth: 0 },
    scene: navigate.sceneConfig.Suspension,
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
      showPassword: false
    });
  }

  _btnStyle = bool => (bool ? styleUtil.themeColor : styleUtil.disabledColor);

  renderPage() {
    const { verifyCode, password, showPassword } = this.state;

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
              <Text
                style={{
                  color: styleUtil.themeColor,
                  fontSize: 12,
                  position: "absolute"
                }}
              >
                {"*验证码错误"}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 40,
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
              activeOpacity={
                verifyCode.length == 4 && password.length >= 6 ? 0.5 : 1
              }
              style={[
                styles.buttonBox,
                {
                  backgroundColor: this._btnStyle(
                    verifyCode.length == 4 && password.length >= 6
                  ),
                  borderColor: this._btnStyle(
                    verifyCode.length == 4 && password.length >= 6
                  )
                }
              ]}
              onPress={_ => {
                if (verifyCode.length == 4 && password.length >= 6) {
                  navigate.pushNotNavBar(LoginEnterInfo);
                }
              }}
            >
              <Text style={styles.buttonText}>{"注册"}</Text>
            </TouchableOpacity>
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
    width: 110,
    height: 40,
    padding: 10,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: styleUtil.themeColor,
    backgroundColor: styleUtil.themeColor,
    borderRadius: 4
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
