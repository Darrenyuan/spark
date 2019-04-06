import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal
} from "react-native";
import { TabView, NavigationBar } from "teaset";
import Nearby from "../pages/nearby/Nearby";
import { Icon } from "react-native-elements";
import styleUtil from "../common/styleUtil";
import LoginEnterPhone from "../pages/user/LoginEnterPhone";
import LoginSetPassword from "../pages/user/LoginSetPassword";
import LoginEnterInfo from "../pages/user/LoginEnterInfo";
import LoginEnterPassword from "../pages/user/LoginEnterPassword";
import LoginAgreement from "../pages/user/LoginAgreement";
import LoginMoreInfo from "../pages/user/LoginMoreInfo";
import LoginPersonal from "../pages/user/LoginPersonal";
import NearbyDetail from "../pages/nearby/NearbyDetail";
import { BlurView } from "react-native-blur";
import Publish from "../pages/publish/Publish";
import PublishEntrance from "../pages/publish/PublishEntrance";
import Profile from "../pages/profile/Profile"
import Settings from "../pages/settings/Settings"
import SettingsAbout from "../pages/settings/SettingsAbout"
import SettingsEditAccount from "../pages/settings/SettingsEditAccount"
import SettingsEditAccountPhone from "../pages/settings/SettingsEditAccountPhone";
import SettingsEditAccountPassword from "../pages/settings/SettingsEditAccountPassword";
import SettingsEditProfile from "../pages/settings/SettingsEditProfile";
import SettingsEditProfileName from "../pages/settings/SettingsEditProfileName";
import Notification from "../pages/notification/Notification";
import ChatList from "../pages/message/ChatList";
import QRScanner from "../pages/message/QRScanner";
import UserQRCode from "../pages/message/UserQRCode";

export default class TabNavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 2,
      modalVisible: false
    };
  }

  _onClickPublish = () => {
    this.setState({ modalVisible: true });
  };

  _callbackPublishClose = () => {
    this.setState({ modalVisible: false });
  };

  onchangeTab = index => {
    this.setState({ activeIndex: index });
  };

  renderCustomButton() {
    let bigIcon = (
      <View
        style={{
          borderRadius: 31,
          shadowColor: styleUtil.themeColor,
          shadowOffset: { height: -12, width: 0 },
          shadowOpacity: 0.3,
          shadowRadius: 13,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
          padding: 10
        }}
      >
        <PublishEntrance
          modalVisible={this.state.modalVisible}
          callbackPublishClose={this._callbackPublishClose}
        />
        <Image source={require("../assets/image/tarbar_add.png")} />
      </View>
    );
    return (
      <TabView.Sheet
        type="button"
        // title='Custom'
        icon={bigIcon}
        iconContainerStyle={{ justifyContent: "flex-end" }}
        onPress={this._onClickPublish}
      />
    );
  }

  render() {
    let { activeIndex } = this.state;
    let customBarStyle =
      Platform.OS === "android"
        ? null
        : {
            borderTopWidth: 0,
            shadowColor: styleUtil.themeColor,
            shadowOffset: { height: -2 },
            shadowOpacity: 0.4,
            shadowRadius: 13,
            backgroundColor: "white"
          };

    return (
      <TabView
        style={{ flex: 1 }}
        type="projector"
        activeIndex={activeIndex}
        barStyle={customBarStyle}
        onChange={index => this.onchangeTab(index)}
      >
        <TabView.Sheet
          title="附近"
          icon={require("../assets/image/tabbar_home.png")}
          activeIcon={require("../assets/image/tabbar_home_highlight.png")}
        >
          <Nearby
            leftHidden
            renderRightView={
              <NavigationBar.Button
                onPress={_ => {
                  navigate.pushNotNavBar(Search, {
                    selectValue: "题目"
                  });
                }}
              >
                <Icon
                  name={"ios-search"}
                  type={"ionicon"}
                  color={styleUtil.navIconColor}
                  size={30}
                />
              </NavigationBar.Button>
            }
          />
        </TabView.Sheet>
        <TabView.Sheet
          title="钉住"
          icon={require("../assets/image/tabbar_pin.png")}
          activeIcon={require("../assets/image/tabbar_pin_highlight.png")}
        >
          <Nearby
            leftHidden
            renderRightView={
              <NavigationBar.Button
                onPress={_ => {
                  navigate.pushNotNavBar(Search, {
                    selectValue: "题目"
                  });
                }}
              >
                <Icon
                  name={"ios-search"}
                  type={"ionicon"}
                  color={styleUtil.navIconColor}
                  size={30}
                />
              </NavigationBar.Button>
            }
          />
        </TabView.Sheet>
        {this.renderCustomButton()}
        <TabView.Sheet
          title="消息"
          icon={require("../assets/image/tabbar_chat.png")}
          activeIcon={require("../assets/image/tabbar_chat_highlight.png")}
        >
          <UserQRCode />
        </TabView.Sheet>
        <TabView.Sheet
          title="我的"
          icon={require("../assets/image/tabbar_mine.png")}
          activeIcon={require("../assets/image/tabbar_mine_highlight.png")}
        >
          <NearbyDetail />
        </TabView.Sheet>
      </TabView>
    );
  }
}
