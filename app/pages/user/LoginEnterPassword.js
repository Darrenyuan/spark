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

export default class LoginEnterPassword extends NavigatorPage {
  static defaultProps = {
    ...NavigatorPage.navigatorStyle,
    // navBarHidden: true,
    navigationBarInsets: false,
    style: { backgroundColor: "transparent", borderBottomWidth: 0 },
    leftView: (
      <TouchableOpacity style={{ paddingLeft: 10 }}>
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
      user: props.user
    });
  }

  _btnStyle = bool => (bool ? styleUtil.themeColor : styleUtil.disabledColor);

  renderPage() {
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
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={require("../../assets/image/login_password.png")}
              />
              <TextInput
                placeholder="请输入密码"
                placeholderTextColor="#E5E5E5"
                autoCorrect={false}
                underlineColorAndroid="transparent"
                keyboardType={"number-pad"}
                style={[styles.inputField, { flex: 1 }]}
                // value={this.state.verifyCode}
                maxLength={11}
                autoFocus={true}
                onChangeText={text => {
                  // this.setState({verifyCode: text})
                }}
              />
            </View>
            <TouchableOpacity
              activeOpacity={0.5}
              style={[
                styles.buttonBox,
                {
                  backgroundColor: this._btnStyle(false),
                  borderColor: this._btnStyle(false)
                }
              ]}
            >
              <Text style={styles.buttonText}>{"登录"}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                marginTop: 30,
                alignItems: "center"
              }}
            >
              <Text style={{ color: styleUtil.themeColor, fontSize: 14 }}>
                {"找回密码"}
              </Text>
            </TouchableOpacity>
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