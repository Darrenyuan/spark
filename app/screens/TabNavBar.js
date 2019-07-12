import { apiOnStart } from '../services/axios/api';
import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  StatusBar,
} from 'react-native';
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
      activeIndex: 0,
      visible: false,
      latitude: 0,
      longitude: 0,
      coordsStr: '',
      address: '',
    };
  }

  componentWillMount() {
    const { loginInfo } = this.props;
    if (loginInfo.auid) {
      this._netApplyLogon();
    }
  }

  async componentDidMount() {
    let auid = '';
    let M9 = new Date().getTime();
    let strM9 = '' + M9;
    if (Platform.OS === 'ios') {
      init({
        ios: '28d1259434784e7005d8ad3735c66a09',
      }).then(
        res => {
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
    const { fetchConfigInfo, registerLocation } = this.props;
    Geolocation.getCurrentPosition(({ coords, timestamp, location }) => {
      let coordsStr = _this.coordsToString(coords);
      _this.setState({ coordsStr: coordsStr });
      fetchConfigInfo({
        auid: auid,
        M0: Platform.OS === 'ios' ? 'IMMC' : 'MMC',
        M2: '',
        M3: coordsStr,
        M8: md5.hex_md5(auid + strM9),
        M9: strM9,
      });
      registerLocation({
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
    const { loginInfo, applyLogon } = this.props;
    const { coordsStr } = this.state;
    let auid = loginInfo.auid;
    let M2 = loginInfo.loginToken;
    let M3 = coordsStr;
    let M8 = md5.str_md5(auid + new Date().getTime());
    applyLogon({
      auid: auid,
      M2: M2,
      M3: M3,
      M8: M8,
    }).then(res => {
      console.log(res);
      console.log('res res___________________');
    });
  };

  _onClickPublish = () => {
    const { loginInfo, registerLocation } = this.props;
    if (!loginInfo.loginToken) {
      navigate.pushNotNavBar(LoginEnterPhone);
      return;
    } else {
      let _this = this;
      // 添加定位监听函数
      addLocationListener(location => {
        console.log('listener:invoker', location);
        let coordsStr = _this.coordsToString(location);
        registerLocation({
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
    const { loginInfo } = this.props;
    if (!loginInfo.loginToken) {
      return <LoginEnterPhone />;
    }
    let { activeIndex } = this.state;
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
          <Profile style={{ backgroundColor: 'transparent', borderBottomWidth: 0 }} />
        </TabView.Sheet>
      </TabView>
    );
  }
}
function mapStateToProps(state, ownProps) {
  console.log('ownProps=====', JSON.stringify(ownProps));
  const { loginInfo } = state;
  return {
    loginInfo,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  const { fetchConfigInfo, registerLocation, applyLogon } = bindActionCreators(
    { ...actions },
    dispatch,
  );
  return {
    fetchConfigInfo,
    registerLocation,
    applyLogon,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TabNavBar);
