import React from "react";

import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Animated,
  FlatList
} from "react-native";
import styleUtil from "../../common/styleUtil";
import NavigatorPage from "../../components/NavigatorPage";
import LoadingMore from "../../components/load/LoadingMore";
import OverlayModal from "../../components/OverlayModal";
import {Avatar, Icon} from "react-native-elements";
import { NavigationBar } from "teaset";
import config from "../../common/config";
import ImageCropPicker from "react-native-image-crop-picker";
import navigate from "../../screens/navigate";
import DatePicker from "../../components/DatePicker";
import Blank from "../../components/Blank";
import NearbyItem from "../nearby/NearbyList";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import NavBar from "../../components/NavBar";
import Settings from "../settings/Settings";
import UserQRCode from "../message/UserQRCode";

export default class Profile extends NavigatorPage {
  static defaultProps = {
    ...NavigatorPage.navigatorStyle,
    navBarHidden: true,
    navigationBarInsets: false
  };

  constructor(props) {
    super(props);
    Object.assign(this.state, {
      nickName: "",
      birthday: "",
      male: true,
      scrollY: new Animated.Value(0),
      list: [
        { name: "haha" },
        { name: "haha" },
        { name: "haha" },
        { name: "haha" }
      ]
    });
  }

  _btnStyle = bool => (bool ? styleUtil.themeColor : styleUtil.disabledColor);

  openCamera = type => {
    ImageCropPicker.openCamera({
      cropping: true
      // compressImageQuality: 1
    }).then(image => {
      // console.log(image.path);
      // this._upload(image, type)
    });
  };

  selectLibrary = type => {
    ImageCropPicker.openPicker({
      multiple: false,
      // cropping: true,
      mediaType: "photo",
      compressImageQuality: Platform.OS === "ios" ? 0 : 1,
      minFiles: 1,
      maxFiles: 1
    })
      .then(image => {
        // this._upload(image, type)
      })
      .catch(err => {
        if (err.code === "E_PICKER_CANCELLED") {
          return;
        }
        alert("出错啦~");
      });
  };

  showAction = (type = "avatar") => {
    let items = [
      {
        title: "拍照",
        onPress: _ => config.loadData(_ => this.openCamera(type))
      },
      {
        title: "从相册中选取",
        onPress: _ => config.loadData(_ => this.selectLibrary(type))
      }
    ];
    config.showAction(items);
  };

  showDatePicker = () => {
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

  _renderNavBar = () => {
    return (
      <NavBar
        style={{
          position: "absolute",
          backgroundColor: "transparent",
          borderBottomWidth: 0
        }}
        renderLeftView={
          <NavigationBar.Button
            onPress={() => navigate.pushNotNavBar(UserQRCode)}
          >
            <FontAwesome name={"qrcode"} color={"white"} size={22} />
          </NavigationBar.Button>
        }
        renderRightView={
          <NavigationBar.Button
            onPress={() => navigate.pushNotNavBar(Settings)}
          >
            <SimpleLineIcons name={"settings"} color={"white"} size={22} />
          </NavigationBar.Button>
        }
      />
    );
  };

  _renderHeader = () => {
    let { scrollY } = this.state;
    let windowHeight = styleUtil.window.width * (218.0 / 375.0);

    return (
      <View
        style={{
          backgroundColor: "white",
          paddingBottom: 10
        }}
      >
        <View>
          <Animated.Image
            style={{
              width: styleUtil.window.width,
              height: windowHeight,
              resizeMode: "cover",
              transform: [
                {
                  translateY: scrollY.interpolate({
                    inputRange: [-windowHeight, 0, windowHeight, windowHeight],
                    outputRange: [
                      -windowHeight / 2,
                      0,
                      -windowHeight / 3,
                      -windowHeight / 3
                    ]
                  })
                },
                {
                  scale: scrollY.interpolate({
                    inputRange: [-windowHeight, 0, windowHeight],
                    outputRange: [2, 1, 1]
                  })
                }
              ]
            }}
            source={require("../../assets/image/login_head_background.png")}
          />
          <View
            style={{
              position: "absolute",
              width: "100%",
              bottom: 0,
              justifyItem: "flex-end",
              alignItems: "center"
            }}
          >
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                marginBottom: 20
              }}
              onPress={_ => this.showAction("avatar")}
            >
                <Avatar
                    size={57}
                    rounded
                    source={require("../../assets/image/avatar.png")}
                />
              <Text style={{ fontSize: 18, color: "white", marginTop: 3 }}>
                {"Hellen"}
              </Text>
              <Text style={{ fontSize: 14, color: "white", marginTop: 3 }}>
                {"广交天下友"}
              </Text>
              <View style={{ flexDirection: "row", marginTop: 20 }}>
                <View
                  style={{
                    backgroundColor: "rgba(255,255,255,0.4)",
                    height: 26,
                    paddingHorizontal: 10,
                    justifyContent: "center",
                    borderRadius: 13,
                    marginHorizontal: 4
                  }}
                >
                  <Text style={{ fontSize: 14, color: "white" }}>{"摄影"}</Text>
                </View>
                <View
                  style={{
                    backgroundColor: "rgba(255,255,255,0.4)",
                    height: 26,
                    paddingHorizontal: 10,
                    justifyContent: "center",
                    borderRadius: 13,
                    marginHorizontal: 4
                  }}
                >
                  <Text style={{ fontSize: 14, color: "white" }}>{"民谣"}</Text>
                </View>
                <View
                  style={{
                    backgroundColor: "rgba(255,255,255,0.4)",
                    height: 26,
                    paddingHorizontal: 10,
                    justifyContent: "center",
                    borderRadius: 13,
                    marginHorizontal: 4
                  }}
                >
                  <Text style={{ fontSize: 14, color: "white" }}>{"游戏"}</Text>
                </View>
                <View
                  style={{
                    backgroundColor: "rgba(255,255,255,0.4)",
                    height: 26,
                    paddingHorizontal: 10,
                    justifyContent: "center",
                    borderRadius: 13,
                    marginHorizontal: 4
                  }}
                >
                  <Text style={{ fontSize: 14, color: "white" }}>{"撸猫"}</Text>
                </View>
                <View
                  style={{
                    backgroundColor: "rgba(255,255,255,0.4)",
                    height: 26,
                    paddingHorizontal: 10,
                    justifyContent: "center",
                    borderRadius: 13,
                    marginHorizontal: 4
                  }}
                >
                  <Text style={{ fontSize: 14, color: "white" }}>{"旅游"}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            marginTop: 15,
            marginHorizontal: 15,
            alignItems: "center"
          }}
        >
          <Text
            style={{
              fontSize: 18,
              color: "#333333",
              fontWeight: "700",
              marginRight: 10
            }}
          >
            {"所有"}
          </Text>
          <Icon
            name={"ios-arrow-down"}
            type={"ionicon"}
            color={"#BABABA"}
            size={20}
          />
          <Text style={{ fontSize: 14, color: "#333333", marginLeft: 15 }}>
            {"23天，0个时刻"}
          </Text>
        </View>
      </View>
    );
  };

  _renderRows = ({ item, separators, index }) => {
    return <NearbyItem item={item} another={this.state.another} />;
  };

  renderPage() {
    const { nickName, birthday, male, scrollY } = this.state;

    return (
      <View style={styleUtil.container}>
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
          ListEmptyComponent={<Blank title={"在这，记录你的存在"} />}
          ListFooterComponent={this._renderFooter}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={1}
          onScroll={Animated.event([
            {
              nativeEvent: {
                contentOffset: {
                  y: this.state.scrollY
                }
              }
            }
          ])}
        />
        {this._renderNavBar()}
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
