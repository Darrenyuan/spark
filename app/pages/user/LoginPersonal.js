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
import { Icon } from "react-native-elements";
import TabBar from "../../components/tabbar/TabBar";
import ScrollableTabView from "react-native-scrollable-tab-view";
import navigate from "../../screens/navigate";

const tabs = [
  { name: "性格", labels: ["开朗", "抑郁"] },
  { name: "兴趣", labels: ["篮球", "排球"] },
  { name: "游戏", labels: ["王者荣耀", "吃鸡"] },
  { name: "运动", labels: ["跑步", "打球"] },
  { name: "追星", labels: ["权志龙", "胡一天"] },
  { name: "工作", labels: ["程序员", "财务", "人事"] }
];

let pageCallback = null;
let callbackParam = [];

export default class LoginPersonal extends NavigatorPage {
  static defaultProps = {
    ...NavigatorPage.navigatorStyle,
    navBarHidden: false,
    title: "你的个性标签",
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
          pageCallback(callbackParam);
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

    this.state = { labels: props.labels };
  }

  componentDidUpdate(
    prevProps: Readonly<P>,
    prevState: Readonly<S>,
    snapshot: SS
  ): void {
    callbackParam = this.state.labels;
  }

  renderNavBar = props => {
    return (
      <TabBar
        backgroundColor={"white"}
        activeTextColor={styleUtil.activeTextColor}
        fromIndex={0}
        inactiveTextColor={styleUtil.inactiveTextColor}
        underlineStyle={styleUtil.underlineStyle}
        // tabContainerWidth={"100%"}
        style={{
          width: "100%",
          paddingTop: 10,
          borderBottomWidth: 0,
          justifyContent: "space-between"
        }}
        tabs={tabs}
      />
    );
  };

  renderPage() {
    const { labels } = this.state;

    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <View style={{ marginHorizontal: 10, marginTop: 10, flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text>{"已选择"}</Text>
            <Text style={{ marginLeft: 10, color: styleUtil.grayColor }}>
              {labels.length + "/12"}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              alignItems: "flex-start",
              marginTop: 10,
              height: 180
            }}
          >
            {this.state.labels.map((v, i) => (
              <TouchableOpacity
                style={styles.buttonBox}
                onPress={_ => {
                  labels.splice(labels.indexOf(v), 1);
                  this.setState({ labels: labels });
                }}
              >
                <Text style={styles.buttonText}>{v}</Text>
                <View style={{ marginLeft: 8 }}>
                  <Icon
                    name={"md-close"}
                    type={"ionicon"}
                    size={16}
                    color={"white"}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <ScrollableTabView
            style={{ marginTop: 10 }}
            scrollWithoutAnimation={true}
            tabBarPosition={"top"}
            renderTabBar={this.renderNavBar}
            onChangeTab={this.onChangeTab}
            initialPage={0}
          >
            {tabs.map((v, i) => (
              <View
                style={{ flex: 1, flexDirection: "row", flexWrap: "wrap" }}
                key={v.name}
                tabLabel={v.name}
              >
                {v.labels.map((v, i) => (
                  <TouchableOpacity
                    style={
                      labels.indexOf(v) > -1
                        ? styles.buttonBox
                        : styles.unselectBox
                    }
                    onPress={_ => {
                      let index = labels.indexOf(v);
                      if (index > -1) {
                        labels.splice(index, 1);
                      } else {
                        if (labels.length < 12) {
                          labels.push(v);
                        }
                      }
                      this.setState({ labels: labels });
                    }}
                  >
                    <Text style={styles.buttonText}>{v}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </ScrollableTabView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonBox: {
    backgroundColor: styleUtil.themeColor,
    height: 34,
    borderWidth: 1,
    borderColor: styleUtil.themeColor,
    borderRadius: 17,
    paddingHorizontal: 17,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
    marginBottom: 10
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center"
  },
  unselectBox: {
    backgroundColor: styleUtil.grayColor,
    height: 34,
    borderWidth: 1,
    borderColor: styleUtil.grayColor,
    borderRadius: 17,
    paddingHorizontal: 17,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
    marginBottom: 10
  }
});
