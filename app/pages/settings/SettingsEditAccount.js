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
import navigate from "../../screens/navigate";
import { ListRow } from "teaset";
import SettingsEditAccountPhone from "./SettingsEditAccountPhone"
import SettingsEditAccountPassword from "./SettingsEditAccountPassword";
// import SettingsEditAccountPassword from "./SettingsEditAccountPassword"


export default class SettingsEditAccount extends NavigatorPage {
  static defaultProps = {
    ...NavigatorPage.navigatorStyle,
    navBarHidden: false,
    navigationBarInsets: true,
    title: "修改账户信息"
  };

  constructor(props) {
    super(props);
    Object.assign(this.state, {
      phone: ""
    });
  }

  _btnStyle = bool => (bool ? styleUtil.themeColor : styleUtil.disabledColor);

  renderPage() {
    const { phone } = this.state;

    return (
      <View style={{ backgroundColor: "white", flex: 1 }}>
        <View style={{ flex: 1 }}>
          <ListRow
            title={"修改手机号码"}
            onPress={_ => {
              navigate.pushNotNavBar(SettingsEditAccountPhone);
            }}
            topSeparator={"none"}
            bottomSeparator={"indent"}
          />
          <ListRow
            title={"修改登录密码"}
            onPress={_ => {
              navigate.pushNotNavBar(SettingsEditAccountPassword);
            }}
            topSeparator={"none"}
            bottomSeparator={"indent"}
          />
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
