import React from "react";

import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity
} from "react-native";
import styleUtil from "../../common/styleUtil";
import NavigatorPage from "../../components/NavigatorPage";
import navigate from "../../screens/navigate";

let pageCallback = null;
let gNickName = "";

export default class SettingsEditProfileName extends NavigatorPage {
  static defaultProps = {
    ...NavigatorPage.navigatorStyle,
    navBarHidden: false,
    navigationBarInsets: true,
    title: "修改昵称",
    rightView: (
        <TouchableOpacity
            style={{
              backgroundColor: styleUtil.themeColor,
              paddingHorizontal: 15,
              height: 30,
              borderRadius: 15,
              flexDirection: "row",
              alignItems: "center",
              marginRight: 10
            }}
            onPress={_ => {
              pageCallback(gNickName);
              navigate.pop();
            }}
        >
          <Text style={{ fontSize: 16, color: "#fff", textAlign: "center" }}>
            {"保存"}
          </Text>
        </TouchableOpacity>
    )
  };

  constructor(props) {
    super(props);

    pageCallback = props.pageCallback;
  }

  renderPage() {
    return (
      <View
        style={{
          backgroundColor: "white",
          flex: 1,
          paddingHorizontal: 15,
          paddingTop: 30
        }}
      >
        <View style={{ flex: 1 }}>
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
                style={[styles.inputField, { flex: 1 }]}
                defaultValue={this.props.nickName}
                maxLength={100}
                autoFocus={true}
                onChangeText={text => {
                  gNickName = text;
                }}
            />
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
