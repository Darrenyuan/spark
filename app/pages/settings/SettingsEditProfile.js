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
import SettingsAbout from "./SettingsAbout";
import SettingsEditAccount from "./SettingsEditAccount";
import SettingsEditProfileName from "./SettingsEditProfileName";
import config from "../../common/config";
import OverlayModal from "../../components/OverlayModal";
import DatePicker from "../../components/DatePicker";
import LoginPersonal from "../user/LoginPersonal";

export default class SettingsEditProfile extends NavigatorPage {
  static defaultProps = {
    ...NavigatorPage.navigatorStyle,
    navBarHidden: false,
    navigationBarInsets: true,
    title: "修改个人资料"
  };

  constructor(props) {
    super(props);
    Object.assign(this.state, {
      gender: "男性",
      birthday: "",
      labels: [],
      membership: "",
      nickName:""
    });
  }

  _btnStyle = bool => (bool ? styleUtil.themeColor : styleUtil.disabledColor);

  _renderTitle = (title, subTitle) => {
    return (
      <View style={{ flexDirection: "row" }}>
        <Text style={{ color: "#454545", fontSize: 14, fontWeight: "600" }}>
          {title}
        </Text>
        <Text style={{ color: "#DFDFDF", fontSize: 14, marginLeft: 15 }}>
          {subTitle}
        </Text>
      </View>
    );
  };

  _formatLabels = () => {
    let string = "";
    this.state.labels.forEach((v, i, a) => {
      string = string + v + "；";
    });
    return string;
  };

  _renderGenderMenu = () => {
    let items = [
      {
        title: "男性",
        onPress: _ => this.setState({ gender: "男性" })
      },
      {
        title: "女性",
        onPress: _ => this.setState({ gender: "女性" })
      }
    ];
    config.showAction(items);
  };

  _renderDatePicker = () => {
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

  _renderRelationshipMenu = () => {
    let items = [
      {
        title: "寻找另一半",
        onPress: _ => this.setState({ membership: "寻找另一半" })
      },
      {
        title: "玩友",
        onPress: _ => this.setState({ membership: "玩友" })
      }
    ];
    config.showAction(items);
  };

  renderPage() {
    const { phone } = this.state;

    return (
      <View style={{ backgroundColor: "white", flex: 1 }}>
        <View style={{ flex: 1 }}>
          <ListRow
            title={this._renderTitle("修改头像")}
            onPress={_ => {
              navigate.pushNotNavBar(SettingsEditAccount);
            }}
            topSeparator={"none"}
            bottomSeparator={"indent"}
          />
          <ListRow
            title={this._renderTitle("更换背景图片")}
            onPress={_ => {
              navigate.pushNotNavBar(SettingsAbout);
            }}
            topSeparator={"none"}
            bottomSeparator={"indent"}
          />
          <ListRow
            title={this._renderTitle("昵称", "一个月只能变更1次")}
            detail={this.state.nickName}
            onPress={_ => {
              navigate.pushNotNavBar(SettingsEditProfileName, {
                nickName: this.state.nickName,
                pageCallback: nickName => {
                  this.setState({ nickName });
                }
              });
            }}
            topSeparator={"none"}
            bottomSeparator={"indent"}
          />
          <ListRow
            title={this._renderTitle("性别", "只能变更1次")}
            detail={this.state.gender}
            onPress={_ => {
              this._renderGenderMenu();
            }}
            topSeparator={"none"}
            bottomSeparator={"indent"}
          />
          <ListRow
            title={this._renderTitle("生日", "不能变更")}
            detail={this.state.birthday}
            onPress={_ => {
              this._renderDatePicker();
            }}
            topSeparator={"none"}
            bottomSeparator={"indent"}
          />
          <ListRow
            title={this._renderTitle("交友状态")}
            detail={this.state.membership}
            onPress={_ => {
              this._renderRelationshipMenu();
            }}
            topSeparator={"none"}
            bottomSeparator={"indent"}
          />
          <ListRow
            title={this._renderTitle(
              "个性标签",
              this.state.labels.length + "/20"
            )}
            detail={this._formatLabels()}
            onPress={_ => {
              navigate.pushNotNavBar(LoginPersonal, {
                labels: this.state.labels,
                pageCallback: labels => {
                  this.setState({ labels });
                }
              });
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
