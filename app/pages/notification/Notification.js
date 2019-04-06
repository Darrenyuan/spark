import React from "react";

import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  FlatList
} from "react-native";
import styleUtil from "../../common/styleUtil";
import NavigatorPage from "../../components/NavigatorPage";
import LoadingMore from "../../components/load/LoadingMore";
import navigate from "../../screens/navigate";
import { ListRow } from "teaset";
import config from "../../common/config";
import { Icon } from "react-native-elements";

export default class Notification extends NavigatorPage {
  static defaultProps = {
    ...NavigatorPage.navigatorStyle,
    navBarHidden: false,
    navigationBarInsets: true,
    title: "提醒"
  };

  constructor(props) {
    super(props);
    Object.assign(this.state, {
      list: [
        { name: "haha" },
        { name: "haha" },
        { name: "haha" },
        { name: "haha" }
      ]
    });
  }

  _renderRelationshipRows = () => {
    return (
        <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 15,
              paddingTop: 15,
              // opacity: 0.5
              height: 70,
            }}
        >
          <Image
              style={{ marginRight: 15 }}
              source={require("../../assets/image/avatar.png")}
          />
          <View
              style={{
                flex: 1,
                flexDirection: "row",
                paddingBottom: 15,
                borderBottomWidth: 0.5,
                borderBottomColor: "#D8D8D8"
              }}
          >
              <Image
                  style={{ marginRight: 10 }}
                  source={require("../../assets/image/spark_14x20.png")}
              />
              <Text style={{ color: "#454545", fontSize: 16, fontWeight: "600" }}>
                {"你与TA的火花即将熄灭"}
              </Text>
          </View>
        </View>
    );
  };

  _renderHonorRows = () => {
    return (
        <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 15,
              paddingTop: 15,
              height: 70,
              // opacity: 0.5
            }}
        >
          <Image
              style={{ marginRight: 15 }}
              source={require("../../assets/image/avatar.png")}
          />
          <View
              style={{
                flex: 1,
                paddingBottom: 15,
                borderBottomWidth: 0.5,
                borderBottomColor: "#D8D8D8"
              }}
          >
            <View style={{ flexDirection: "row", marginBottom: 8, alignItems:"center" }}>
              <Text style={{ color: "#454545", fontSize: 16, fontWeight: "600" }}>
                {"恭喜！你获得标签"}
              </Text>
              <View style={{backgroundColor:styleUtil.themeColor, marginLeft:10, paddingHorizontal:8, height:24, borderRadius:12, justifyContent:"center" }}><Text style={{fontSize:14, color:"white"}}>{"种子用户"}</Text></View>
            </View>

            <View
                style={{
                  flexDirection: "row",
                  flex: 1
                }}
            >
              <Text style={{ color: "#888787", fontSize: 14 }}>{"前1000名注册用户可获得"}</Text>
            </View>
          </View>
        </View>
    );
  };

  _renderCommentRows = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 15,
          paddingTop: 15,
          height: 70,
          // opacity: 0.5
        }}
      >
        <Image
          style={{ marginRight: 15 }}
          source={require("../../assets/image/avatar.png")}
        />
        <View
          style={{
            flex: 1,
            paddingBottom: 15,
            borderBottomWidth: 0.5,
            borderBottomColor: "#D8D8D8"
          }}
        >
          <View style={{ flexDirection: "row", marginBottom: 8 }}>
            <Image
              style={{ marginRight: 10 }}
              source={require("../../assets/image/heart_1.png")}
            />
            <Text style={{ color: "#454545", fontSize: 16, fontWeight: "600" }}>
              {"《流浪地球》值得一看么？"}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              flex: 1
            }}
          >
            <Text style={{ color: "#888787", fontSize: 14 }}>{"有人"}</Text>
            <Text style={{ color: styleUtil.themeColor, fontSize: 14 }}>
              {"回复"}
            </Text>
            <Text style={{ color: "#888787", fontSize: 14 }}>
              {"了你的留言"}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  _renderEventRows = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 15,
          paddingTop: 15,
          height: 70,
          // opacity: 0.5
        }}
      >
        <Image
          style={{ marginRight: 15 }}
          source={require("../../assets/image/avatar.png")}
        />
        <View
          style={{
            flex: 1,
            paddingBottom: 15,
            borderBottomWidth: 0.5,
            borderBottomColor: "#D8D8D8"
          }}
        >
          <View style={{ flexDirection: "row", marginBottom: 8 }}>
            <Image
              style={{ marginRight: 10 }}
              source={require("../../assets/image/heart_1.png")}
            />
            <Text style={{ color: "#454545", fontSize: 16, fontWeight: "600" }}>
              {"《流浪地球》值得一看么？"}
            </Text>
          </View>
          {false && (
            <View
              style={{
                flexDirection: "row",
                flex: 1,
                justifyContent: "space-between"
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <Image
                  style={{ marginRight: 3 }}
                  source={require("../../assets/image/comment.png")}
                />
                <Text
                  style={{ marginRight: 3, color: "#888787", fontSize: 14 }}
                >
                  {15}
                </Text>
                <Text style={{ color: "#888787", fontSize: 14 }}>{"+1"}</Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Image
                  style={{ marginRight: 3 }}
                  source={require("../../assets/image/comment.png")}
                />
                <Text
                  style={{ marginRight: 3, color: "#888787", fontSize: 14 }}
                >
                  {15}
                </Text>
                <Text style={{ color: "#888787", fontSize: 14 }}>{"+1"}</Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Image
                  style={{ marginRight: 3 }}
                  source={require("../../assets/image/comment.png")}
                />
                <Text
                  style={{ marginRight: 3, color: "#888787", fontSize: 14 }}
                >
                  {15}
                </Text>
                <Text style={{ color: "#888787", fontSize: 14 }}>{"+1"}</Text>
              </View>
            </View>
          )}
          {true && (
            <View
              style={{
                flexDirection: "row",
                flex: 1
              }}
            >
              <Text style={{ color: "#888787", fontSize: 14 }}>
                {"已关闭（时间截止）"}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  _renderRows = (item) => {
    if (item.index==0) {
      return this._renderEventRows();
    }
    if (item.index==1) {
      return this._renderRelationshipRows();
    }
    if (item.index==2) {
      return this._renderHonorRows();
    }
    if (item.index==3) {
      return this._renderCommentRows();
    }
  };

  renderPage() {
    return (
      <View style={{ backgroundColor: "white", flex: 1 }}>
        <FlatList
          extraData={this.state}
          data={this.state.list}
          renderItem={this._renderRows}
          initialNumToRender={config.pageSize}
          keyExtractor={(item, index) => index.toString()}
          onEndReached={this._fetchMoreData}
          onEndReachedThreshold={0.3}
          onRefresh={this._fetchDataWithRefreshing}
          refreshing={this.state.isRefreshing}
          ListHeaderComponent={this._renderHeader}
          ListFooterComponent={this._renderFooter}
          showsVerticalScrollIndicator={false}
        />
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
