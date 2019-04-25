import React from "react";

import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Platform
} from "react-native";
import styleUtil from "../../common/styleUtil";
import NavigatorPage from "../../components/NavigatorPage";
import navigate from "../../screens/navigate";
import { ListRow } from "teaset";
import SettingsEditProfileName from "./SettingsEditProfileName";
import config from "../../common/config";
import OverlayModal from "../../components/OverlayModal";
import DatePicker from "../../components/DatePicker";
import LoginPersonal from "../user/LoginPersonal";
import ImageCropPicker from "react-native-image-crop-picker";

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
      ...config.user
    });
  }

  componentDidMount() {
    config.getStatusAndMarker().then(info => {
      this._status = info.kkStatusTypes;
      this.markersCategorys = info.markerTypes;
    });
  }

  _openCamera = (type) => {
    ImageCropPicker.openCamera({
      cropping: true,
    }).then(image => {
      // console.log(image.path);
      // this._upload(image, type)
    });
  }

  _selectLibrary = (type) => {
    ImageCropPicker.openPicker({
      multiple: false,
      mediaType: 'photo',
      compressImageQuality: Platform.OS === 'ios' ? 0 : 1,
      minFiles: 1,
      maxFiles: 1,
    }).then(image => {
      // this._upload(image, type)
    }).catch(err => {
      if (err.code === 'E_PICKER_CANCELLED') {
        return
      }
      alert('出错啦~')
    })
  }

  _onClickEditImage = (type = 'avatar') => {
    let items = [
      {title: '拍照', onPress: _ => config.loadData(_ => this._openCamera(type))},
      {title: '从相册中选取', onPress: _ => config.loadData(_ => this._selectLibrary(type))}
    ];
    config.showAction(items)
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

  _formatMarkers = () => {
    let string = "";
    this.state.markers?.forEach((v, i, a) => {
      string = string + v.typeName + "；";
    });
    return string;
  };

  _renderGenderMenu = () => {
    let items = [
      {
        title: "男",
        onPress: _ => this.setState({ sex: "男" })
      },
      {
        title: "女",
        onPress: _ => this.setState({ sex: "女" })
      }
    ];
    config.showAction(items);
  };

  _renderDatePicker = () => {
    let birth = this.state.birth;
    let arr = birth ? birth.split("-") : [];
    OverlayModal.show(
      <DatePicker
        selectedYear={arr[0]}
        selectedMonth={arr[1]}
        selectedDate={arr[2]}
        onDone={arr => {
          birth = arr.join("-");
          this.setState({ birth: birth });
        }}
      />
    );
  };

  _renderRelationshipMenu = () => {
    let items = [];
    for (let item of this._status) {
      items.push({
        title: item.typeName,
        onPress: _ => this.setState({ kkStatus: item })
      });
    }
    config.showAction(items);
  };

  renderPage() {
    return (
      <View style={{ backgroundColor: "white", flex: 1 }}>
        <View style={{ flex: 1 }}>
          <ListRow
            title={this._renderTitle("修改头像")}
            onPress={_ => {
              this._onClickEditImage('avatar');
            }}
            topSeparator={"none"}
            bottomSeparator={"indent"}
          />
          <ListRow
            title={this._renderTitle("更换背景图片")}
            onPress={_ => {
              this._onClickEditImage('backgroundImage');
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
            detail={this.state.sex}
            onPress={_ => {
              this._renderGenderMenu();
            }}
            topSeparator={"none"}
            bottomSeparator={"indent"}
          />
          <ListRow
            title={this._renderTitle("生日", "不能变更")}
            detail={this.state.birth}
            onPress={_ => {
              this._renderDatePicker();
            }}
            topSeparator={"none"}
            bottomSeparator={"indent"}
          />
          <ListRow
            title={this._renderTitle("交友状态")}
            detail={this.state.kkStatus?.typeName}
            onPress={_ => {
              this._renderRelationshipMenu();
            }}
            topSeparator={"none"}
            bottomSeparator={"indent"}
          />
          <ListRow
            title={this._renderTitle(
              "个性标签",
              this.state.markers?.length + "/20"
            )}
            detail={this._formatMarkers()}
            onPress={_ => {
              navigate.pushNotNavBar(LoginPersonal, {
                markers: this.state.markers ? this.state.markers : [],
                markersCategorys: this.markersCategorys,
                pageCallback: markers => {
                  this.setState({ markers });
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
