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
import OverlayModal from "../../components/OverlayModal";
import { Icon } from "react-native-elements";
import { NavigationBar } from "teaset";
import config from "../../common/config";
import ImageCropPicker from "react-native-image-crop-picker";
import navigate from "../../screens/navigate";
import LoginAgreement from "./LoginAgreement";
import DatePicker from "../../components/DatePicker";
import LoginMoreInfo from "./LoginMoreInfo"

export default class LoginEnterInfo extends NavigatorPage {
  static defaultProps = {
    ...NavigatorPage.navigatorStyle,
    navBarHidden: true,
    navigationBarInsets: false
  };

  constructor(props) {
    super(props);
    Object.assign(this.state, {
      nickName: "",
      birthday: "",
      male: true
    });
  }

  _btnStyle = bool => (bool ? styleUtil.themeColor : styleUtil.disabledColor);

  openCamera = type => {
    ImageCropPicker.openCamera({
      cropping: true
      // compressImageQuality: 1
    }).then(image => {
      // console.log(image.path);
      // this._upload(image, type)
    });
  };

  selectLibrary = type => {
    ImageCropPicker.openPicker({
      multiple: false,
      // cropping: true,
      mediaType: "photo",
      compressImageQuality: Platform.OS === "ios" ? 0 : 1,
      minFiles: 1,
      maxFiles: 1
    })
      .then(image => {
        // this._upload(image, type)
      })
      .catch(err => {
        if (err.code === "E_PICKER_CANCELLED") {
          return;
        }
        alert("出错啦~");
      });
  };

  showAction = (type = "avatar") => {
    let items = [
      {
        title: "拍照",
        onPress: _ => config.loadData(_ => this.openCamera(type))
      },
      {
        title: "从相册中选取",
        onPress: _ => config.loadData(_ => this.selectLibrary(type))
      }
    ];
    config.showAction(items);
  };

  showDatePicker = () => {
    let birthday = this.state.birthday;
    let arr = birthday.split("-");
    OverlayModal.show(
      <DatePicker
        selectedYear={arr[0]}
        selectedMonth={arr[1]}
        selectedDate={arr[2]}
        onDone={arr => {
          birthday = arr.join("-");
          this.setState({ birthday: birthday });
        }}
      />
    );
  };

  renderPage() {
    const { nickName, birthday, male } = this.state;

    return (
      <View style={styleUtil.container}>
        <View style={{ overflow: "hidden" }}>
          <ImageBackground
            style={{
              width: styleUtil.window.width,
              height: styleUtil.window.width * (222.0 / 375.0),
              resizeMode: "contain",
              justifyContent: "flex-end",
              alignItems: "center"
            }}
            source={require("../../assets/image/login_head_background.png")}
          >
            <TouchableOpacity
              style={{
                flexDirection: "column",
                alignItems: "center",
                marginBottom: 20
              }}
              onPress={_ => this.showAction("avatar")}
            >
              <Image
                source={require("../../assets/image/login_default_avatar.png")}
              />
              <Text style={{ fontSize: 14, color: "white", marginTop: 10 }}>
                {"修改头像"}
              </Text>
            </TouchableOpacity>
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
                source={require("../../assets/image/login_nick_name.png")}
              />
              <TextInput
                placeholder="请输入你的昵称"
                placeholderTextColor="#E5E5E5"
                autoCorrect={false}
                underlineColorAndroid="transparent"
                keyboardType={"number-pad"}
                style={[styles.inputField, { flex: 1 }]}
                value={nickName}
                maxLength={11}
                autoFocus={true}
                onChangeText={text => {
                  this.setState({ nickName: text });
                }}
              />
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
                source={require("../../assets/image/login_birthday.png")}
              />

              <TextInput
                editable={false}
                placeholder="请选择你的生日"
                placeholderTextColor="#E5E5E5"
                autoCorrect={false}
                underlineColorAndroid="transparent"
                style={[styles.inputField, { flex: 1 }]}
                value={birthday}
                maxLength={11}
              />
              <TouchableOpacity
                style={{
                  width: "100%",
                  height: "100%",
                  position: "absolute"
                }}
                onPress={_ => {
                  this.showDatePicker();
                }}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                marginTop: 30,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center" }}
                onPress={_ => this.setState({ male: !male })}
              >
                <Icon
                  name={male ? "ios-radio-button-on" : "ios-radio-button-off"}
                  type={"ionicon"}
                  color={styleUtil.themeColor}
                  size={25}
                />
                <Text
                  style={{ fontSize: 16, color: "#454545", marginLeft: 15 }}
                >
                  {"男性"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginLeft: 60
                }}
                onPress={_ => this.setState({ male: !male })}
              >
                <Icon
                  name={male ? "ios-radio-button-off" : "ios-radio-button-on"}
                  type={"ionicon"}
                  color={styleUtil.themeColor}
                  size={25}
                />
                <Text
                  style={{ fontSize: 16, color: "#454545", marginLeft: 15 }}
                >
                  {"女性"}
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              activeOpacity={
                nickName.length > 0 && birthday.length > 0 ? 0.5 : 1
              }
              style={[
                styles.buttonBox,
                {
                  backgroundColor: this._btnStyle(
                    nickName.length > 0 && birthday.length > 0
                  ),
                  borderColor: this._btnStyle(
                    nickName.length > 0 && birthday.length > 0
                  )
                }
              ]}
              onPress={_ => {
                if (nickName.length > 0 && birthday.length > 0) {
                  navigate.pushNotNavBar(LoginMoreInfo);
                }
              }}
            >
              <Text style={styles.buttonText}>{"下一步"}</Text>
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