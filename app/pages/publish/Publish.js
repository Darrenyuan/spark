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
import LoginPersonal from "../user/LoginPersonal";
import { Icon } from "react-native-elements";
import config from "../../common/config";

let gType;

export default class Publish extends NavigatorPage {
  static defaultProps = {
    ...NavigatorPage.navigatorStyle,
    navBarHidden: false,
    navigationBarInsets: true,
    scene: navigate.sceneConfig.FloatFromBottom,
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
          navigate.pop();
        }}
      >
        <Text style={{ fontSize: 16, color: "#fff", textAlign: "center" }}>
          {"发布"}
        </Text>
      </TouchableOpacity>
    )
  };

  constructor(props) {
    super(props);
    Object.assign(this.state, {
      timer: "7天"
    });
  }

  _onClickTimer = () => {
    let items = [
      {
        title: "7天",
        onPress: _ => this.setState({ timer: "7天" })
      },
      {
        title: "一个月",
        onPress: _ => this.setState({ timer: "一个月" })
      }
    ];
    config.showAction(items);
  };

  _renderLine1Input = (placeholder1, placeholder2) => {
    return (
      <View style={{ flexDirection: "row" }}>
        <TextInput
          placeholder={placeholder1}
          placeholderTextColor="#E5E5E5"
          autoCorrect={false}
          underlineColorAndroid="transparent"
          style={[styles.inputField, { flex: 3 }]}
          // value={}
          maxLength={100}
          autoFocus={true}
          onChangeText={text => {
            this.setState({ nickName: text });
          }}
        />
        {placeholder2 && (
          <View style={{ flex: 2, flexDirection: "row", alignItems: "center" }}>
            <TextInput
              placeholder={placeholder2}
              placeholderTextColor="#E5E5E5"
              autoCorrect={false}
              underlineColorAndroid="transparent"
              style={[
                styles.inputField,
                { flex: 1, marginLeft: 15, paddingLeft: 30 }
              ]}
              // value={}
              maxLength={100}
              onChangeText={text => {
                this.setState({ nickName: text });
              }}
            />
            <Image
              style={{ position: "absolute", marginLeft: 28 }}
              source={require("../../assets/image/publish_yuan.png")}
            />
          </View>
        )}
      </View>
    );
  };

  _renderLine2Input = placeholder => {
    return (
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#E5E5E5"
        autoCorrect={false}
        underlineColorAndroid="transparent"
        style={[styles.input2Field]}
        // value={}
        multiline={true}
        onChangeText={text => {
          this.setState({ nickName: text });
        }}
      />
    );
  };

  _renderImageAdd = () => {
    return (
      <View
        style={{
          alignSelf: "flex-start",
          width: 50,
          height: 50,
          backgroundColor: "#F6F6F6",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 2
        }}
      >
        <Icon name={"ios-add"} type={"ionicon"} size={40} color={"#D8D8D8"} />
      </View>
    );
  };

  _renderTimer = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center"
        }}
      >
        <View style={{ width: 25, alignItems: "flex-start" }}>
          <Icon
            name={"md-time"}
            type={"ionicon"}
            size={20}
            color={styleUtil.themeColor}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            flex: 1,
            paddingVertical: 8,
            borderBottomWidth: styleUtil.borderSeparator,
            borderBottomColor: styleUtil.borderColor,
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <Text style={{ color: "#454545", fontSize: 14 }}>{"多久后关闭"}</Text>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              flex: 1,
              justifyContent: "flex-end"
            }}
            onPress={_ => {
              this._onClickTimer();
            }}
          >
            <Text
              style={{
                marginRight: 10,
                marginLeft: 40,
                color: "#454545",
                minWidth: 100,
                textAlign: "right",
                fontSize: 14
              }}
              numberOfLines={1}
            >
              {this.state.timer}
            </Text>
            <Icon
              name={"ios-arrow-forward"}
              type={"ionicon"}
              size={25}
              color={styleUtil.grayColor}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  _renderAddress = note => {
    return (
      <View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          <View style={{ width: 25, alignItems: "flex-start" }}>
            <Icon
              name={"ios-pin"}
              type={"ionicon"}
              size={20}
              color={styleUtil.themeColor}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              flex: 1,
              paddingVertical: 8,
              borderBottomWidth: styleUtil.borderSeparator,
              borderBottomColor: styleUtil.borderColor,
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <Text style={{ color: "#454545", fontSize: 14 }}>
              {"上海市浦东新区梅花路"}
            </Text>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                flex: 1,
                justifyContent: "flex-end"
              }}
              onPress={_ => {
                navigate.pushNotNavBar(LoginPersonal, {
                  labels,
                  pageCallback: labels => {
                    this.setState({ labels });
                  }
                });
              }}
            >
              <Icon
                name={"ios-arrow-forward"}
                type={"ionicon"}
                size={25}
                color={styleUtil.grayColor}
              />
            </TouchableOpacity>
          </View>
        </View>
        <Text
          style={{
            fontSize: 12,
            color: "#C1C1C1",
            marginLeft: 25,
            marginTop: 5
          }}
        >
          {note}
        </Text>
      </View>
    );
  };

  renderPage() {
    const { type } = this.props;

    let placeholder1;
    let placeholder2;
    let placeholder;
    let note;
    if (type == 0) {
      placeholder1 = "简要描述你想讨论的话题";
      placeholder = "你的观点/补充（选填）";
      note = "*当前位置3km范围可被发现";
    } else if (type == 1) {
      placeholder1 = "一起做点啥";
      placeholder = "补充描述（选填）";
      note = "*当前位置1km范围可被发现";
    } else if (type == 2) {
      placeholder1 = "你要交易什么物品？";
      placeholder2 = "请输入价格";
      placeholder = "型号？几成新？怎么交付？等详细描述（选填）";
      note = "*当前位置10km范围可被发现";
    } else if (type == 3) {
      placeholder = "你想留下点什么";
      note = "*当前位置200m范围可被发现";
    }

    return (
      <View style={styles.container}>
        {(placeholder1 || placeholder2) &&
          this._renderLine1Input(placeholder1, placeholder2)}
        {(placeholder1 || placeholder2) && <View style={{ height: 10 }} />}
        {this._renderLine2Input(placeholder)}
        {type != 1 && <View style={{ height: 10 }} />}
        {type != 1 && this._renderImageAdd()}
        <View style={{ height: 30 }} />
        {this._renderTimer()}
        <View style={{ height: 10 }} />
        {this._renderAddress(note)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "flex-start",
    paddingHorizontal: 15,
    paddingTop: 15
  },
  title: {
    marginBottom: 20,
    color: "#333",
    fontSize: 20,
    textAlign: "center"
  },
  inputField: {
    height: 36,
    paddingLeft: 15,
    color: "#D8D8D8",
    fontSize: 14,
    backgroundColor: "#F6F6F6",
    borderRadius: 18
  },
  input2Field: {
    height: 80,
    paddingLeft: 15,
    color: "#D8D8D8",
    fontSize: 14,
    backgroundColor: "#F6F6F6",
    borderRadius: 4,
    textAlignVertical: "top"
  }
});
