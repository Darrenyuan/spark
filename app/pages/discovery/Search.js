import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity
} from "react-native";

import NavigatorPage from "../../components/NavigatorPage";
import request from "../../common/request";
import toast from "../../common/toast";
import styleUtil from "../../common/styleUtil";
import navigate from "../../screens/navigate";
import config from "../../common/config";
import utils from "../../common/utils";
import ScrollableTabView from "react-native-scrollable-tab-view";
import NearbyList from "../nearby/NearbyList";
import NavBar from "../../components/NavBar";
import TabBar from "../../components/tabbar/TabBar";
import { NavigationBar, Button } from "teaset";
import { Icon } from "react-native-elements";
import AntDesign from "react-native-vector-icons/AntDesign";

export default class Search extends NavigatorPage {
  static defaultProps = {
    ...NavigatorPage.navigatorStyle,
    title: "好友",
    showBackButton: true,
    navBarHidden: true,
    navigationBarInsets: false
  };

  constructor(props) {
    super(props);
    let tabs = [
      { name: "所有", uri: "xxx" },
      { name: "话题", uri: "xxx" },
      { name: "一起", uri: "xxx" },
      { name: "二手", uri: "xxx" },
      { name: "时刻", uri: "xxx" }
    ];
    Object.assign(this.state, {
      tabs,
      activeIndex: 0,
      fromIndex: 0
    });
  }

  componentWillMount() {}

  onChangeTab = ({ i, ref, from }) => {
    if (this.state.activeIndex !== i) {
      this.setState({
        activeIndex: i,
        fromIndex: from
      });
    }
  };

  _renderTabBar = props => {
    return (
      <View
        style={{
          backgroundColor: "white",
          borderBottomWidth: 0.5,
          borderBottomColor: "#e8e8e8"
        }}
      >
        <TabBar
          backgroundColor={null}
          // textStyle={styles.label}
          activeTextColor={styleUtil.activeTextColor}
          inactiveTextColor={styleUtil.inactiveTextColor}
          underlineStyle={styleUtil.underlineStyle}
          fromIndex={this.state.fromIndex}
          tabContainerWidth={styleUtil.window.width - 50}
          style={{
            width: styleUtil.window.width - 50,
            paddingTop: 10,
            alignSelf: "center"
          }}
          {...props}
          tabs={this.state.tabs}
        />
      </View>
    );
  };

  _renderNavBar = () => {
    return (
      <NavBar
        renderLeftView={
          <NavigationBar.BackButton onPress={_ => navigate.pop()} />
        }
        renderTitleView={
          <View style={{ flex: 1, justifyContent: "center" }}>
            <TextInput
              placeholder="搜索"
              placeholderTextColor="#D8D8D8"
              autoCorrect={false}
              underlineColorAndroid="transparent"
              style={styles.inputField}
              autoFocus={false}
              onChangeText={text => {
                // this.setState({verifyCode: text})
              }}
            />
            <View style={{ position: "absolute", left: 20 }}>
              <Icon
                name={"ios-search"}
                type={"ionicon"}
                color={"#979797"}
                size={22}
              />
            </View>
          </View>
        }
        style={{ borderBottomWidth: 0 }}
        leftHidden={true}
        renderRightView={
          <TouchableOpacity onPress={_ => navigate.pop()}>
            <Text style={{ color: styleUtil.themeColor, fontSize: 16 }}>
              {"取消"}
            </Text>
          </TouchableOpacity>
        }
      />
    );
  };

  _renderResult = () => {
    return (
      <ScrollableTabView
        tabBarPosition={"top"}
        renderTabBar={this._renderTabBar}
        onChangeTab={this.onChangeTab}
        initialPage={0}
        prerenderingSiblingsNumber={1}
      >
        {this.state.tabs.map((v, i) => (
          <NearbyList
            key={v.name}
            // {...this.props}
            tabLabel={v.name}
            // uri={v.uri}
            activeIndex={this.state.activeIndex}
            leftHidden={this.props.leftHidden}
            // getListType={this.props.getListType}
          />
        ))}
      </ScrollableTabView>
    );
  };

  _renderHistroy = () => {
    return (
      <View
        style={{
          paddingHorizontal: 15,
          backgroundColor: "white",
          flex: 1,
          borderTopColor: "#e8e8e8",
          borderTopWidth: 0.5
        }}
      >
        <View style={{ flexDirection: "row", marginTop: 15 }}>
          <Text style={{ flex: 1, color: "#040404", fontSize: 14 }}>
            {"最近搜索"}
          </Text>
          <AntDesign name={"delete"} color={"#666666"} size={16} />
        </View>
        <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10 }}>
          <View
            style={{
              backgroundColor: "#F6F6F6",
              paddingHorizontal: 8,
              borderRadius: 5,
              marginRight: 10,
              height: 25,
              justifyContent: "center"
            }}
          >
            <Text style={{ color: "#585858", fontSize: 12 }}>{"一起打球"}</Text>
          </View>
          <View
            style={{
              backgroundColor: "#F6F6F6",
              paddingHorizontal: 8,
              borderRadius: 5,
              marginRight: 10,
              height: 25,
              justifyContent: "center"
            }}
          >
            <Text style={{ color: "#585858", fontSize: 12 }}>{"手机"}</Text>
          </View>
        </View>
      </View>
    );
  };

  renderPage() {
    return (
      <View style={{ flex: 1, backgroundColor:"white" }}>
        {this._renderNavBar()}
        {true && this._renderResult()}
        {false && this._renderHistroy()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputField: {
    marginLeft: 8,
    marginRight: 10,
    height: 32,
    paddingLeft: 35,
    color: "#454545",
    fontSize: 16,
    backgroundColor: "#F6F6F6",
    borderRadius: 16
  }
});
