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
import { Icon } from "react-native-elements";
import { NavigationBar } from "teaset";
import navigate from "../../screens/navigate";
import LoginPersonal from "./LoginPersonal";
import config from "../../common/config";
import LoginAgreement from "./LoginAgreement";

export default class LoginMoreInfo extends NavigatorPage {
  static defaultProps = {
    ...NavigatorPage.navigatorStyle,
    navBarHidden: false,
    title: "让我更了解你"
  };

  constructor(props) {
    super(props);
    Object.assign(this.state, {
      membership: "寻找另一半",
      markers: []
    });
  }

  componentDidMount() {
    super.componentDidMount();

    config.getStatusAndMarker().then(info => {
      this._status = info.kkStatusTypes;
      if (this._status.length > 0) {
        this.setState({membership: this._status[0]});
      }
      this.markersCategorys = info.markerTypes;
    });
  }

  _netRegisterInfo2 = () => {
    const { membership, markers } = this.state;

    const markerIDs = markers.map(marker => {return marker.typeID});

    toast.modalLoading();
    request
        .post(config.api.registerInfo2, {
          kkStatus: membership.typeID,
          markers: markerIDs,
        })
        .then(res => {
          toast.modalLoadingHide();
          if (res.code === 1) {
            navigate.popN(4);
            this._netApplyLogin();
          }
        });
  };

  _netApplyLogin = () => {
    toast.modalLoading();
    request
        .post(config.api.applyLogon, {})
        .then(res => {
          toast.modalLoadingHide();
          if (res.code === 1) {
            config.setUserToStorage(res.data.user);
          }
        });
  };

  _btnStyle = bool => (bool ? styleUtil.themeColor : styleUtil.disabledColor);

  showAction = () => {
    let items = [];
    for (let item of this._status) {
      console.log(item);
      console.log(item.typeName);
      items.push({
        title: item.typeName,
        onPress: _ => this.setState({ membership: item })
      });
    }
    config.showAction(items);
  };

  showLabels = markers => {
    let string = "";
    markers.forEach((v, i, a) => {
      string = string + v.typeName + "；";
    });
    return string;
  };

  renderPage() {
    const { membership, markers } = this.state;

    return (
      <View style={styleUtil.container}>
        <View
          style={{
            marginHorizontal: 10,
            alignItems: "center"
          }}
        >
          <View
            style={{
              flexDirection: "row",
              paddingVertical: 15,
              borderBottomWidth: styleUtil.borderSeparator,
              borderBottomColor: styleUtil.borderColor,
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Text>{"交友状态"}</Text>
            </View>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                flex: 1,
                justifyContent: "flex-end"
              }}
              onPress={_ => {
                this.showAction();
              }}
            >
              <Text
                style={{
                  marginRight: 10,
                  marginLeft: 40,
                  color: styleUtil.detailTextColor,
                  minWidth: 100,
                  textAlign: "right"
                }}
                numberOfLines={1}
              >
                {membership.typeName}
              </Text>
              <Icon
                name={"ios-arrow-forward"}
                type={"ionicon"}
                size={25}
                color={styleUtil.grayColor}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: "row",
              paddingVertical: 15,
              borderBottomWidth: styleUtil.borderSeparator,
              borderBottomColor: styleUtil.borderColor,
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text>{"个性标签"}</Text>
              <Text
                style={{ marginLeft: 10, color: styleUtil.detailTextColor }}
              >
                {markers.length + "/12"}
              </Text>
            </View>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                flex: 1,
                justifyContent: "flex-end"
              }}
              onPress={_ => {
                navigate.pushNotNavBar(LoginPersonal, {
                  markers,
                  markersCategorys: this.markersCategorys,
                  pageCallback: markers => {
                    this.setState({ markers });
                  }
                });
              }}
            >
              <Text
                style={{
                  marginRight: 10,
                  marginLeft: 40,
                  color: styleUtil.detailTextColor,
                  minWidth: 100,
                  textAlign: "right"
                }}
                numberOfLines={1}
              >
                {this.showLabels(markers)}
              </Text>
              <Icon
                name={"ios-arrow-forward"}
                type={"ionicon"}
                size={25}
                color={styleUtil.grayColor}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            activeOpacity={membership.length > 0 && markers.length > 0 ? 0.5 : 1}
            style={[
              styles.buttonBox,
              {
                backgroundColor: this._btnStyle(
                  markers.length > 0
                ),
                borderColor: this._btnStyle(
                  markers.length > 0
                )
              }
            ]}
            onPress={_ => {
              if (markers.length > 0) {
                this._netRegisterInfo2();
              }
            }}
          >
            <Text style={styles.buttonText}>{"完成"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              navigate.popN(4);
              this._netApplyLogin();
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: styleUtil.themeColor,
                marginTop: 40
              }}
            >
              {"跳过，稍后完善"}
            </Text>
          </TouchableOpacity>
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
    marginTop: 40,
    backgroundColor: styleUtil.themeColor,
    height: 48,
    borderWidth: 1,
    borderColor: styleUtil.themeColor,
    borderRadius: 24,
    width: "80%"
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
