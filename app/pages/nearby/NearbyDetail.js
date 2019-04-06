import React from "react";

import {
  StyleSheet,
  Text,
  View,
  FlatList,
  DeviceEventEmitter,
  TouchableOpacity
} from "react-native";
import styleUtil from "../../common/styleUtil";
// import LoadingMore from "../components/load/LoadingMore";
import NavigatorPage from "../../components/NavigatorPage";
import NearbyItem from "./NearbyItem";
import config from "../../common/config";
import LoadingMore from "../../components/load/LoadingMore";
import { Image, Icon } from "react-native-elements";

export default class NearbyList extends NavigatorPage {
  static defaultProps = {
    ...NavigatorPage.navigatorStyle,
    navBarHidden: false,
    navigationBarInsets: true
  };
  //
  // static fetchNewTopicWithRefreshing = () => {
  // 	DeviceEventEmitter.emit('fetchNewTopicWithRefreshing')
  // };
  //
  // static removeTopicWithUserId = (val) => {
  // 	DeviceEventEmitter.emit('removeTopicWithUserId', val)
  // };
  //
  constructor(props) {
    super(props);
    this.page = 1;
    this.total = 1;
    Object.assign(this.state, {
      user: props.user,
      list: [
        { name: "haha" },
        { name: "haha" },
        { name: "haha" },
        { name: "haha" }
      ],
      another: false,
      isLoading: false, //上拉加载
      isRefreshing: false, //下拉刷新
      type: 0
    });
    this._isMounted = false;
  }

  componentDidMount() {
    // config.removeUser()
    this._isMounted = true;
  }

  componentWillUnmount() {}

  _hasMore = () => {
    return this.state.list.length < this.total && this.total > 0;
  };

  _fetchMoreData = () => {
    if (this._hasMore() && !this.state.isLoading) {
    }
  };

  _renderHeaderContent = () => {
    const offsetScreen = 15;
    const imageSpace = 10;
    const imageHeight = Math.floor(
      (styleUtil.window.width - offsetScreen * 2 - imageSpace * 2) / 3
    );

    return (
      <View
        style={{
          paddingTop: 15,
          paddingBottom: 10,
          paddingHorizontal: 15,
          backgroundColor: "white"
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image source={require("../../assets/image/avatar.png")} />
          <View
            style={{
              flexDirection: "column",
              alignItems: "flex-start",
              marginLeft: 15
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#252525" }}>
              {"Alexander"}
            </Text>
            <Text style={{ fontSize: 12, color: "#c1c1c1", marginTop: 1 }}>
              {"2018/03/23 发布"}
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            marginTop: 15
          }}
        >
          <View
            style={{
              height: 24,
              paddingHorizontal: 10,
              backgroundColor: "#828282",
              justifyContent: "center",
              borderRadius: 12
            }}
          >
            <Text style={{ color: "white" }}>{"话题"}</Text>
          </View>
          <Text
            style={{
              flex: 1,
              marginLeft: 10,
              fontSize: 22,
              lineHeight: 25,
              fontWeight: "700"
            }}
          >
            {"《流浪地球》值得一看么"}
          </Text>
          {false ? (
            <Text
              style={{
                color: styleUtil.themeColor,
                fontSize: 16,
                fontWeight: "700",
                marginLeft: 10
              }}
            >
              {"¥1999.00"}
            </Text>
          ) : null}
        </View>

        <Text
          style={{
            marginTop: 10,
            fontSize: 14,
            lineHeight: 18,
            letterSpacing: 1,
            color: "#252525"
          }}
        >
          {
            "最近貌似很火，但是对国产科幻没有信心最近貌似很火，但是对国产科幻没有信心最近貌似很火，但是对国产科幻没有信心最近貌似很火，但是对国产科幻没有信心。。。"
          }
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10 }}>
          <Image
            style={{
              width: imageHeight,
              height: imageHeight,
              marginRight: imageSpace
            }}
            source={require("../../assets/image/example.png")}
          />
          <Image
            style={{
              width: imageHeight,
              height: imageHeight,
              marginRight: imageSpace
            }}
            source={require("../../assets/image/example.png")}
          />
          <Image
            style={{ width: imageHeight, height: imageHeight }}
            source={require("../../assets/image/example.png")}
          />
          {/*<Image style={{width:imageHeight, height:imageHeight, marginRight:imageSpace, marginTop:imageSpace}} source={require("../../assets/image/example.png")} />*/}
          {/*<Image style={{width:imageHeight, height:imageHeight, marginRight:imageSpace, marginTop:imageSpace}} source={require("../../assets/image/example.png")} />*/}
          {/*<Image style={{width:imageHeight, height:imageHeight, marginTop:imageSpace}} source={require("../../assets/image/example.png")} />*/}
          {/*<Image style={{width:imageHeight, height:imageHeight, marginRight:imageSpace, marginTop:imageSpace}} source={require("../../assets/image/example.png")} />*/}
          {/*<Image style={{width:imageHeight, height:imageHeight, marginRight:imageSpace, marginTop:imageSpace}} source={require("../../assets/image/example.png")} />*/}
          {/*<Image style={{width:imageHeight, height:imageHeight, marginTop:imageSpace}} source={require("../../assets/image/example.png")} />*/}
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            marginTop: 10
          }}
        >
          <Icon
            name={"ios-pin"}
            type={"ionicon"}
            size={18}
            color={styleUtil.themeColor}
          />
          <Text style={{ fontsize: 12, color: "#C1C1C1", marginLeft: 5 }}>
            {"上海市浦东新区梅花路 附近"}
          </Text>
        </View>
      </View>
    );
  };

  _renderHeaderTab = () => {
    const tabs = [
      { show: true, selected: true, title: "回复", count: 3 },
      { show: true, selected: false, title: "赞", count: 3 },
      { show: true, selected: false, title: "钉住", count: 3 }
    ];

    return (
      <View
        style={{
          flexDirection: "row",
          marginTop: 10,
          backgroundColor: "white",
          paddingHorizontal: 15,
          paddingTop: 10,
          paddingBottom: 5
        }}
      >
        {tabs.map(
          (v, i) =>
            v.show && (
              <TouchableOpacity
                onPress={_ => {
                  this.setState({ type: i });
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-end",
                    paddingRight: 30
                  }}
                >
                  <View>
                    <Text
                      style={{
                        fontSize: 18,
                        color: this.state.type == i ? "#252525" : "#888888",
                        fontWeight: v.selected ? "600" : "normal"
                      }}
                    >
                      {v.title}
                    </Text>
                    <View
                      style={{
                        height: 3,
                        backgroundColor:
                          this.state.type == i
                            ? styleUtil.themeColor
                            : "transparent",
                        borderRadius: 1.5,
                        marginTop: 4
                      }}
                    />
                  </View>
                  <Text
                    style={{
                      height: 28,
                      fontsize: 12,
                      color: this.state.type == i ? "#252525" : "#888888",
                      fontWeight: this.state.type == i ? "600" : "normal"
                    }}
                  >
                    {v.count}
                  </Text>
                </View>
              </TouchableOpacity>
            )
        )}
      </View>
    );
  };

  _renderHeader = () => {
    return (
      <View>
        {this._renderHeaderContent()}
        {this._renderHeaderTab()}
      </View>
    );
  };

  _renderFooter = () => {
    return <LoadingMore hasMore={this._hasMore()} />;
  };

  _renderReplyRows = ({ item, separators, index }) => {
    return (
      <View
        style={{
          paddingHorizontal: 15,
          paddingTop: 10,
          backgroundColor: "white"
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Image source={require("../../assets/image/avatar.png")} />
          <View
            style={{
              marginLeft: 10,
              paddingBottom: 10,
              flex: 1,
              borderBottomWidth: 0.5,
              borderBottomColor: "#D8D8D8"
            }}
          >
            <Text style={{ marginTop: 10, color: "#252525", fontSize: 14 }}>
              {"还可以吧，国产片拍成这样已经不错了。"}
            </Text>
            <View
              style={{
                flexDirection: "row",
                marginTop: 15,
                alignItems: "center"
              }}
            >
              <Image
                style={{ marginRight: 8 }}
                source={require("../../assets/image/host.png")}
              />
              <Text style={{ flex: 1, color: "#C1C1C1", fontSize: 12 }}>
                {"3分钟"}
              </Text>
              <Image
                style={{ marginRight: 8 }}
                source={require("../../assets/image/like.png")}
              />
              <Text style={{ width: 40, fontSize: 12, color: "#252525" }}>
                {3}
              </Text>
              <Image source={require("../../assets/image/more.png")} />
            </View>

            <View
              style={{
                paddingLeft: 8,
                paddingVertical: 8,
                backgroundColor: "#f8f8f8",
                borderRadius: 0,
                marginTop: 10
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <Image source={require("../../assets/image/avatar.png")} />
                <View
                  style={{
                    marginLeft: 10,
                    paddingBottom: 10,
                    flex: 1
                  }}
                >
                  <Text
                    style={{ marginTop: 10, color: "#252525", fontSize: 14 }}
                  >
                    {"还可以吧，国产片拍成这样已经不错了。"}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      marginTop: 15,
                      alignItems: "center"
                    }}
                  >
                    <Image
                      style={{ marginRight: 8 }}
                      source={require("../../assets/image/host.png")}
                    />
                    <Text style={{ flex: 1, color: "#C1C1C1", fontSize: 12 }}>
                      {"3分钟"}
                    </Text>
                    <Image
                      style={{ marginRight: 8 }}
                      source={require("../../assets/image/like.png")}
                    />
                    <Text style={{ width: 40, fontSize: 12, color: "#252525" }}>
                      {3}
                    </Text>
                    <Image source={require("../../assets/image/more.png")} />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  _renderLikeRows = ({ item, separators, index }) => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 15,
          backgroundColor: "white"
        }}
      >
        <Image source={require("../../assets/image/avatar.png")} />
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            paddingVertical: 20,
            borderBottomColor: "#F5F5F5",
            borderBottomWidth: 0.5
          }}
        >
          <Text
            style={{ flex: 1, marginLeft: 8, fontSize: 14, color: "#252525" }}
          >
            {"老大"}
          </Text>
          <Text style={{ fontSize: 12, color: "#C1C1C1" }}>{"刚刚"}</Text>
        </View>
      </View>
    );
  };

  _renderPinRows = ({ item, separators, index }) => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 15,
          backgroundColor: "white"
        }}
      >
        <Image source={require("../../assets/image/avatar.png")} />
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            paddingVertical: 20,
            borderBottomColor: "#F5F5F5",
            borderBottomWidth: 0.5
          }}
        >
          <Text
            style={{ flex: 1, marginLeft: 8, fontSize: 14, color: "#252525" }}
          >
            {"老大"}
          </Text>
          <Text style={{ fontSize: 12, color: "#C1C1C1" }}>{"刚刚"}</Text>
        </View>
      </View>
    );
  };

  renderPage() {
    return (
      <View style={styleUtil.container}>
        <FlatList
          extraData={this.state}
          data={this.state.list}
          renderItem={
            this.state.type == 0
              ? this._renderReplyRows
              : this.state.type == 1
              ? this._renderLikeRows
              : this._renderPinRows
          }
          initialNumToRender={config.pageSize}
          keyExtractor={(item, index) => index.toString()}
          onEndReached={this._fetchMoreData}
          onEndReachedThreshold={0.3}
          onRefresh={this._fetchDataWithRefreshing}
          refreshing={this.state.isRefreshing}
          ListHeaderComponent={this._renderHeader}
          ListFooterComponent={this._renderFooter}
          showsVerticalScrollIndicator={false}
          // onViewableItemsChanged={this._onViewableItemsChanged}
        />
      </View>
    );
  }
}
