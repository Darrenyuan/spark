import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import utils from '../../common/utils';
import styleUtil from '../../common/styleUtil';
import { Avatar, Icon } from 'react-native-elements';
import { Label, Button } from 'teaset';
import navigate from '../../screens/navigate';
import ImageCached from '../../components/ImageCached';
import { ImageCache } from 'react-native-img-cache/build/index';
import NearbyDetail from './NearbyDetail';
import Profile from '../profile/Profile';
import { red } from 'ansi-colors';

const icons = item => [
  {
    name: item.isLike ? 'ios-heart' : 'ios-heart-outline',
    color: item.isLike ? '#FF4500' : 'black',
    count: item.likes,
  },
  { name: 'ios-chatbubbles-outline', count: item.comments },
  { name: 'ios-share-outline', count: item.shares },
];

export default class NearbyItem extends React.Component {
  state = {
    item: this.props.item,
    byId: this.props.byId,
    dimensions: undefined,
  };

  updateItem = item => {
    this.setState({ item });
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.item !== nextProps.item) {
      this.setState({ item: nextProps.item });
    }
  }

  renderLeftImage = sjType => {
    let component = <Image source={require('../../assets/image/dynamic.png')} />;
    switch (sjType) {
      case '200001':
        component = <Image source={require('../../assets/image/activity.png')} />;
        break;
      case '200002':
        component = <Image source={require('../../assets/image/trade.png')} />;
        break;
      case '200003':
        component = <Image source={require('../../assets/image/dynamic.png')} />;
        break;
      case '200004':
        component = <Image source={require('../../assets/image/topic.png')} />;
        break;
      default:
        break;
    }
    return component;
  };

  renderImage = uri => {
    let dimensions = this.state.dimensions;
    let containerWidth = dimensions === undefined ? styleUtil.window.width - 76 : dimensions.width;
    const offsetScreen = 15;
    const imageSpace = 10;
    const imageHeight = Math.floor((containerWidth - imageSpace * 3) / 3);
    return (
      <ImageCached
        style={{
          width: imageHeight,
          height: imageHeight,
          marginRight: imageSpace,
          marginTop: 10,
        }}
        source={{ uri: uri }}
      />
    );
  };

  onLayout = event => {
    if (this.state.dimensions) return; // layout was already called
    let { width, height } = event.nativeEvent.layout;
    this.setState({ dimensions: { width, height } });
  };

  render() {
    const { item, byId } = this.state;
    const simpleData = byId[item];

    const { another, first = false } = this.props;
    const price = simpleData.price;
    const havePrice = simpleData.price !== undefined && simpleData.price !== '';
    const picfile = simpleData.picfile;
    const havePicfile = picfile !== undefined && picfile.length > 0;
    return (
      <TouchableOpacity
        onPress={() => {
          navigate.pushNotNavBar(NearbyDetail, {
            sjid: item,
            simpleData: simpleData,
            sjType: simpleData.sjType,
          });
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            paddingRight: 18,
            paddingLeft: 18,
            backgroundColor: 'white',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginRight: 10,
            }}
          >
            <View style={{ alignItems: 'center' }}>
              <View
                style={{
                  height: 23,
                  width: 0.5,
                  backgroundColor: first ? 'white' : '#D8D8D8',
                  marginBottom: 2,
                }}
              />
              {this.renderLeftImage(simpleData.sjType)}
              <View
                style={{
                  flex: 1,
                  width: 0.5,
                  backgroundColor: '#D8D8D8',
                  marginTop: 2,
                }}
              />
            </View>
          </View>
          <View
            style={{
              flex: 1,
              marginTop: 16,
              paddingBottom: 16,
              borderBottomWidth: 0.5,
              borderBottomColor: '#D8D8D8',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                flex: 1,
                overflow: 'hidden',
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  navigate.pushNotNavBar(Profile);
                }}
              >
                <Avatar size={36} rounded source={{ uri: simpleData.userFace }} />
              </TouchableOpacity>
              <Text
                numberOfLines={2}
                style={{
                  marginLeft: 10,
                  flex: 1,
                  color: '#454545',
                  fontSize: 14,
                }}
              >
                {simpleData.title}
                {havePrice ? (
                  <Text
                    style={{
                      color: styleUtil.themeColor,
                      fontSize: 16,
                      fontWeight: '700',
                      marginLeft: 10,
                    }}
                  >
                    {`  ¥${price}`}
                  </Text>
                ) : null}
              </Text>

              <Text style={{ marginLeft: 10, color: '#C1C1C1', fontSize: 12 }}>
                {simpleData.sjTimeDesc}
              </Text>
            </View>
            {havePicfile ? (
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  flexWrap: 'wrap',
                  marginLeft: 46,
                  marginRight: 10,
                }}
                onLayout={this.onLayout}
              >
                {picfile.map(uri => {
                  return this.renderImage(uri);
                })}
              </View>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    );
    // return (<View style={{flexDirection:"row", backgroundColor: 'red', height: 10}}></View>);
  }
}
