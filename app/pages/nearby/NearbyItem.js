import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import utils from "../../common/utils";
import styleUtil from "../../common/styleUtil";
import { Avatar, Icon } from "react-native-elements";
import { Label, Button } from "teaset";
import navigate from "../../screens/navigate";
import ImageCached from "../../components/ImageCached";
import { ImageCache } from "react-native-img-cache/build/index";
import NearbyDetail from "./NearbyDetail";
import Profile from "../profile/Profile";

const icons = item => [
  {
    name: item.isLike ? "ios-heart" : "ios-heart-outline",
    color: item.isLike ? "#FF4500" : "black",
    count: item.likes
  },
  { name: "ios-chatbubbles-outline", count: item.comments },
  { name: "ios-share-outline", count: item.shares }
];

export default class NearbyItem extends React.Component {
  state = {
    item: this.props.item
  };

  updateItem = item => {
    this.setState({ item });
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.item !== nextProps.item) {
      this.setState({ item: nextProps.item });
    }
  }

  render() {
    const { item } = this.state;
    const { another } = this.props;
    return (
      <TouchableOpacity
        onPress={() => {
          navigate.pushNotNavBar(NearbyDetail);
        }}
      >
        <View
          style={{
            flexDirection: "row",
            paddingRight: 18,
            paddingLeft: 18,
            backgroundColor: "white"
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              width: 30
            }}
          >
            <View style={{ width: 1, backgroundColor: "#D8D8D8" }} />
            <Image
              style={{ marginTop: 26, position: "absolute" }}
              source={require("../../assets/image/heart_1.png")}
            />
          </View>
          <View
            style={{
              flex: 1,
              marginTop: 16,
              paddingBottom: 16,
              borderBottomWidth: 0.5,
              borderBottomColor: "#D8D8D8"
            }}
          >
            <View
              style={{
                flexDirection: "row",
                flex: 1,
                overflow: "hidden"
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  navigate.pushNotNavBar(Profile);
                }}
              >
                <Image
                  style={{ width: 36, height: 36 }}
                  source={require("../../assets/image/avatar.png")}
                />
              </TouchableOpacity>
              <Text
                numberOfLines={2}
                style={{
                  marginLeft: 10,
                  flex: 1,
                  color: "#454545",
                  fontSize: 14
                }}
              >
                {another
                  ? "这家火锅很好吃，食材很新鲜，品种齐全，下次再来…"
                  : "这家火锅很好吃，食材很新鲜，品种齐全，下次再来…"}
              </Text>
              <Text style={{ marginLeft: 10, color: "#C1C1C1", fontSize: 12 }}>
                {"3小时前"}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                flex: 1,
                flexWrap: "wrap",
                marginLeft: 46
              }}
            >
              <ImageCached
                source={require("../../assets/image/example.png")}
                images={[require("../../assets/image/example.png")]}
                isOnPress
                style={{
                  marginTop: 10,
                  marginRight: 10,
                  width: 50,
                  height: 50
                }}
              />
              <ImageCached
                source={require("../../assets/image/example.png")}
                images={[require("../../assets/image/example.png")]}
                isOnPress
                style={{
                  marginTop: 10,
                  marginRight: 10,
                  width: 50,
                  height: 50
                }}
              />
              <ImageCached
                source={require("../../assets/image/example.png")}
                images={[require("../../assets/image/example.png")]}
                isOnPress
                style={{
                  marginTop: 10,
                  marginRight: 10,
                  width: 50,
                  height: 50
                }}
              />
              <ImageCached
                source={require("../../assets/image/example.png")}
                images={[require("../../assets/image/example.png")]}
                isOnPress
                style={{
                  marginTop: 10,
                  marginRight: 10,
                  width: 50,
                  height: 50
                }}
              />
              <ImageCached
                source={require("../../assets/image/example.png")}
                images={[require("../../assets/image/example.png")]}
                isOnPress
                style={{
                  marginTop: 10,
                  marginRight: 10,
                  width: 50,
                  height: 50
                }}
              />
              <ImageCached
                source={require("../../assets/image/example.png")}
                images={[require("../../assets/image/example.png")]}
                isOnPress
                style={{
                  marginTop: 10,
                  marginRight: 10,
                  width: 50,
                  height: 50
                }}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
    // return (<View style={{flexDirection:"row", backgroundColor: 'red', height: 10}}></View>);
  }
}
