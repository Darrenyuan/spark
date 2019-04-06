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
import { Icon } from "react-native-elements";

export default class SettingsAbout extends NavigatorPage {
  static defaultProps = {
    ...NavigatorPage.navigatorStyle,
    navBarHidden: false,
    navigationBarInsets: true,
    title: "关于"
  };

  constructor(props) {
    super(props);
    Object.assign(this.state, {
      phone: ""
    });
  }

  renderPage() {
    const { phone } = this.state;

    return (
      <View
        style={{
          backgroundColor: "white",
          flex: 1,
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <View
          style={{
            alignItems:"center"
          }}
        >
          <View
            style={{
              flexDirection: "row",
              marginTop: 40,
              justifyContent: "center"
            }}
          >
            <Image source={require("../../assets/image/spark.png")} />
            <View style={{ justifyContent: "flex-end", marginLeft: 10 }}>
              <Text
                style={{
                  fontSize: 30,
                  color: styleUtil.themeColor,
                  fontWeight: "500",
                  marginBottom: 8
                }}
              >
                {"火花"}
              </Text>
              <Text style={{ fontSize: 14, color: "#ACABAB", marginBottom: 2 }}>
                {"重新发现身边的世界"}
              </Text>
            </View>
          </View>

          <Text style={{marginTop:20, color:"#000000", fontSize:14, fontWeight:"600"}}>{"V 1.0.0"}</Text>

          <Text style={{marginTop:80, color:"#000000", fontSize:16, fontWeight:"600"}}>{"特别鸣谢"}</Text>
          <Text style={{marginTop:10, color:"#7A7A7A", fontSize:14}}>{"xxx,xxx,xxx,xxx,xxx"}</Text>
        </View>

        <View style={{ alignItems: "center" }}>
          <Text style={{color:"#000000", fontSize:16, fontWeight:"600"}}>{"联系我们"}</Text>
          <Text style={{marginTop:20, fontSize:14, color:styleUtil.themeColor}}>{"www.huohua.club"}</Text>
          <Text style={{marginTop:20, marginBottom:20, color:"#DDDEDE", fontSize:14}}>{"© 2019 火花"}</Text>
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
