import { apiOnStart } from '../services/axios/api';
import React from 'react';
import { Platform, StyleSheet, Text, View, Image, TouchableOpacity, Modal } from 'react-native';
import { TabView, NavigationBar } from 'teaset';
import Nearby from '../pages/nearby/Nearby';
import { Icon } from 'react-native-elements';
import styleUtil from '../common/styleUtil';
import PublishEntrance from '../pages/publish/PublishEntrance';
import Profile from '../pages/profile/Profile';
import ChatList from '../pages/message/ChatList';
import navigate from './navigate';
import Search from '../pages/discovery/Search';
import LoginEnterPhone from '../pages/user/LoginEnterPhone';
import config from '../common/config';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../services/redux/actions';
import DeviceInfo from 'react-native-device-info';
import LocationService from './LocationService';
import md5 from 'react-native-md5';
import { PermissionsAndroid } from 'react-native';
import {
  init,
  Geolocation,
  setLocatingWithReGeocode,
  setNeedAddress,
  addLocationListener,
  start,
  stop,
  setDistanceFilter,
  setInterval,
} from 'react-native-amap-geolocation';
// import MoreInfo from "../pages/discovery/Search";

class TabNavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPermission: false,
      activeIndex: 0,
      visible: false,
      latitude: 0,
      longitude: 0,
      coordsStr: '',
      address: '',
    };
  }

  componentWillMount() {
    if (this.props.spark.loginInfo.auid) {
      this._netApplyLogon();
    }
  }

  async componentDidMount() {
    if (this.props.spark.loginInfo.loginToken) {
      this.setState({ isPermission: true });
    }
    let auid = '';
    let M9 = new Date().getTime();
    let strM9 = '' + M9;
    this.props.actions.fetchConfigInfo({
      auid: auid,
      M0: Platform.OS === 'ios' ? 'IMMC' : 'MMC',
      M2: '',
      M3: '',
      M8: md5.hex_md5(auid + strM9),
      M9: strM9,
    });
    if (Platform.OS === 'ios') {
      init({
        ios: '28d1259434784e7005d8ad3735c66a09',
      }).then(
        res => {
          console.log('geo location111111');
          setDistanceFilter(10);
        },
        error => console.log(error),
      );
    } else {
      let permissionPromise = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      );
      let initPromise = await init({
        android: '3085d854c06796863a9d8e1612905405',
      });
    }
    let _this = this;
    Geolocation.getCurrentPosition(({ coords, timestamp, location }) => {
      console.log('coords=', JSON.stringify(coords));
      let coordsStr = _this.coordsToString(coords);
      _this.setState({ coordsStr: coordsStr });
      _this.props.actions.fetchConfigInfo({
        auid: auid,
        M0: Platform.OS === 'ios' ? 'IMMC' : 'MMC',
        M2: '',
        M3: coordsStr,
        M8: md5.hex_md5(auid + strM9),
        M9: strM9,
      });
      _this.props.actions.registerLocation({
        latitude: coords.latitude,
        longitude: coords.longitude,
        coordsStr: coordsStr,
        address: '',
      });
    });
  }

  componentWillUnmount() {}

  coordsToString(coords) {
    return '' + coords.longitude + ',' + coords.latitude;
  }

  _netApplyLogon = () => {
    const { loginInfo } = this.props.spark;
    let auid = loginInfo.auid;
    let M2 = loginInfo.loginToken;
    let M3 = this.state.coordsStr;
    let M8 = md5.str_md5(auid + new Date().getTime());
    this.props.actions.applyLogon({
      auid: auid,
      M2: M2,
      M3: M3,
      M8: M8,
    });
  };

  _onClickPublish = () => {
    const { isPermission } = this.state;
    if (!isPermission) {
      navigate.pushNotNavBar(LoginEnterPhone);
    } else {
      let _this = this;
      // 添加定位监听函数
      addLocationListener(location => {
        console.log('listener:invoker', location);
        let coordsStr = _this.coordsToString(location);
        this.props.actions.registerLocation({
          latitude: location.latitude,
          longitude: location.longitude,
          address: location.address,
          coordsStr: coordsStr,
        });
      });

      // 开始连续定位
      start();
      if (Platform.OS === 'ios') {
        setLocatingWithReGeocode(true);
      } else {
        setNeedAddress(true);
      }
      this.setState({ visible: true });
    }
  };

  _callbackPublishClose = () => {
    this.setState({ visible: false });
    stop();
  };

  onchangeTab = index => {
    this.setState({ activeIndex: index });
  };

  renderCustomButton() {
    let bigIcon = (
      <View
        style={{
          borderRadius: 31,
          shadowColor: '#e8e8e8',
          shadowOffset: { height: -0.5, width: 0 },
          shadowOpacity: 1,
          shadowRadius: 0,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
          padding: 10,
        }}
      >
        <PublishEntrance
          modalVisible={this.state.visible}
          callbackPublishClose={this._callbackPublishClose}
        />
        <Image source={require('../assets/image/tarbar_add.png')} />
      </View>
    );
    return (
      <TabView.Sheet
        type="button"
        icon={bigIcon}
        iconContainerStyle={{ justifyContent: 'flex-end' }}
        onPress={this._onClickPublish}
      />
    );
  }

  render() {
    let { activeIndex, isPermission } = this.state;
    let customBarStyle =
      Platform.OS === 'android'
        ? null
        : {
            borderTopWidth: 0.5,
            borderTopColor: '#e8e8e8',
            backgroundColor: 'white',
          };
    return (
      <TabView
        style={{ flex: 1, backgroundColor: 'white' }}
        type="projector"
        activeIndex={activeIndex}
        barStyle={customBarStyle}
        onChange={index => this.onchangeTab(index)}
      >
        <TabView.Sheet
          title="附近"
          icon={<Image source={require('../assets/image/tabbar_home.png')} />}
          activeIcon={<Image source={require('../assets/image/tabbar_home_highlight.png')} />}
        >
          <Nearby leftHidden rightHidden />
        </TabView.Sheet>
        <TabView.Sheet
          title="钉住"
          icon={<Image source={require('../assets/image/tabbar_pin.png')} />}
          activeIcon={<Image source={require('../assets/image/tabbar_pin_highlight.png')} />}
        >
          <Nearby
            leftHidden
            renderRightView={
              <NavigationBar.Button
                onPress={_ => {
                  navigate.pushNotNavBar(Search);
                }}
              >
                <Icon
                  name={'ios-search'}
                  type={'ionicon'}
                  color={styleUtil.navIconColor}
                  size={22}
                />
              </NavigationBar.Button>
            }
          />
        </TabView.Sheet>
        {this.renderCustomButton()}
        <TabView.Sheet
          title="消息"
          icon={<Image source={require('../assets/image/tabbar_chat.png')} />}
          activeIcon={<Image source={require('../assets/image/tabbar_chat_highlight.png')} />}
        >
          <ChatList />
        </TabView.Sheet>
        <TabView.Sheet
          title="我的"
          icon={<Image source={require('../assets/image/tabbar_mine.png')} />}
          activeIcon={<Image source={require('../assets/image/tabbar_mine_highlight.png')} />}
        >
          {isPermission ? (
            <Profile style={{ backgroundColor: 'transparent', borderBottomWidth: 0 }} />
          ) : (
            <LoginEnterPhone />
          )}
        </TabView.Sheet>
      </TabView>
    );
  }
}
function mapStateToProps(state) {
  return {
    spark: state,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...actions }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TabNavBar);
