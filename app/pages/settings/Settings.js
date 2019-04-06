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
import SettingsAbout from "./SettingsAbout"
import SettingsEditAccount from "./SettingsEditAccount";
import SettingsEditProfile from "./SettingsEditProfile";
import ShareWeChat from "../../components/ShareWeChat";

export default class Settings extends NavigatorPage {
  static defaultProps = {
    ...NavigatorPage.navigatorStyle,
    navBarHidden: false,
    navigationBarInsets: true,
    title: "设置"
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
            title={"邀请好友"}
            onPress={_ => {
              ShareWeChat.show({
                type: 'news',
                title: '于何处，寻找价值观一致的同类人',
                description: '有些人，只是我们短暂人生的过客，很快便在我们的记忆中被抹掉；还有些人，却在与我们插肩而过之后，让我们的心为之改变。人生若之如初见，那是怎样的美好。在这里，遇见对的人，就是你一生的幸福……',
                // thumbImage: config.api.imageURI + 'uploads/image/app_icon.png',
                // imageUrl: config.api.imageURI + 'uploads/image/app_icon.png',
                webpageUrl: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.whereapp'
              }, success => {

              })
            }}
            icon={require("../../assets/image/settings_invite.png")}
            topSeparator={"none"}
            bottomSeparator={"indent"}
          />
          <ListRow
            title={"修改个人资料"}
            onPress={_ => {
              navigate.pushNotNavBar(SettingsEditProfile);
            }}
            icon={require("../../assets/image/settings_edit_profile.png")}
            topSeparator={"none"}
            bottomSeparator={"indent"}
          />
          <ListRow
              title={"修改账户信息"}
              onPress={_ => {
                navigate.pushNotNavBar(SettingsEditAccount);
              }}
              icon={require("../../assets/image/settings_edit_account.png")}
              topSeparator={"none"}
              bottomSeparator={"indent"}
          />
          <ListRow
              title={"关于我们"}
              onPress={_ => {
                navigate.pushNotNavBar(SettingsAbout);
              }}
              icon={require("../../assets/image/settings_about.png")}
              topSeparator={"none"}
              bottomSeparator={"indent"}
          />
        </View>
        <TouchableOpacity style={{alignItems: "center", justifyContent:"center", height:80}}><Text style={{fontSize:16, color:styleUtil.themeColor, fontWeight:"700"}}>{"退出登录"}</Text></TouchableOpacity>
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
