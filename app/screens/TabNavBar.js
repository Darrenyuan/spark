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
import PublishEntrance from "../pages/publish/PublishEntrance";
import Profile from "../pages/profile/Profile";
import ChatList from "../pages/message/ChatList";
import navigate from "./navigate";
import Search from "../pages/discovery/Search";
import config from "../common/config";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../services/redux/actions';
import DeviceInfo from "react-native-device-info"; 
import LocationService from "./LocationService"; 

// import MoreInfo from "../pages/discovery/Search";

 class TabNavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
      modalVisible: false
    };
  }

  componentWillMount() {
    config.getLoginInfoFromStorage().then(loginInfo => {
      config.loginInfo = loginInfo;
      if (loginInfo.auid) {
        this._netApplyLogin();
      }
    });

    LocationService.init();
  }
  componentDidMount(){
    let auid='';
    let M9 = new Date().getTime();
    this.props.actions.fetchConfigInfo({
     'auid' : auid,
    'M0' : DeviceInfo.getUniqueID(),
    'M2' :"",
    'M3' : LocationService.getLocationString(),
    'M8':DES.MD5(auid+M9),
    'M9' :M9
    });

  }
  componentWillUnmount() {
    LocationService.destroy();
  }

  _netApplyLogin = () => {
    toast.modalLoading();
    request.post(config.api.applyLogon, {}).then(res => {
      toast.modalLoadingHide();
      if (res.code === 1) {
        config.setUserToStorage(res.data.user);
      }
    });
  };

  _onClickPublish = () => {
    if (config.getUserThenLoginIfNil()) {
      this.setState({ modalVisible: true });
    }
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
          shadowColor: "#e8e8e8",
          shadowOffset: { height: -0.5, width: 0 },
          shadowOpacity: 1,
          shadowRadius: 0,
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
            borderTopWidth: 0.5,
            borderTopColor: "#e8e8e8",
            backgroundColor: "white"
          };
          console.log("11111111111111111111111111")
    console.log(JSON.stringify(this.props.spark.configInfo));
    return (
      <TabView
        style={{ flex: 1, backgroundColor: "white" }}
        type="projector"
        activeIndex={activeIndex}
        barStyle={customBarStyle}
        onChange={index => this.onchangeTab(index)}
      >
        <TabView.Sheet
          title="附近"
          icon={<Image source={require("../assets/image/tabbar_home.png")} />}
          activeIcon={
            <Image
              source={require("../assets/image/tabbar_home_highlight.png")}
            />
          }
        >
          <Nearby
            leftHidden
            renderRightView={
              <NavigationBar.Button
                onPress={_ => {
                  navigate.pushNotNavBar(Search);
                }}
              >
                <Icon
                  name={"ios-search"}
                  type={"ionicon"}
                  color={styleUtil.navIconColor}
                  size={22}
                />
              </NavigationBar.Button>
            }
          />
        </TabView.Sheet>
        <TabView.Sheet
          title="钉住"
          icon={<Image source={require("../assets/image/tabbar_pin.png")} />}
          activeIcon={
            <Image
              source={require("../assets/image/tabbar_pin_highlight.png")}
            />
          }
        >
          <Nearby
            leftHidden
            renderRightView={
              <NavigationBar.Button
                onPress={_ => {
                  navigate.pushNotNavBar(Search);
                }}
              >
                <Icon
                  name={"ios-search"}
                  type={"ionicon"}
                  color={styleUtil.navIconColor}
                  size={22}
                />
              </NavigationBar.Button>
            }
          />
        </TabView.Sheet>
        {this.renderCustomButton()}
        <TabView.Sheet
          title="消息"
          icon={<Image source={require("../assets/image/tabbar_chat.png")} />}
          activeIcon={
            <Image
              source={require("../assets/image/tabbar_chat_highlight.png")}
            />
          }
        >
          <ChatList />
        </TabView.Sheet>
        <TabView.Sheet
          title="我的"
          icon={<Image source={require("../assets/image/tabbar_mine.png")} />}
          activeIcon={
            <Image
              source={require("../assets/image/tabbar_mine_highlight.png")}
            />
          }
        >
          <Profile
            style={{ backgroundColor: "transparent", borderBottomWidth: 0 }}
          />
        </TabView.Sheet>
      </TabView>
    );
  }
}
function mapStateToProps(state) {
  return {
    spark: state,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...actions }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TabNavBar);

