import React from 'react';

import {
  StyleSheet,
  Text,
  View,
  FlatList,
  DeviceEventEmitter,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  StatusBar,
} from 'react-native';
import styleUtil from '../../common/styleUtil';
// import LoadingMore from "../components/load/LoadingMore";
import NavigatorPage from '../../components/NavigatorPage';
import NearbyItem from './NearbyItem';
import config from '../../common/config';
import LoadingMore from '../../components/load/LoadingMore';
import { Image, Icon, Avatar } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../services/redux/actions';
import md5 from 'react-native-md5';
import { NavigationBar, Input } from 'teaset';
import { default as EntypoIcon } from 'react-native-vector-icons/Entypo';
import { default as OcticonsIcon } from 'react-native-vector-icons/Octicons';

class NearbyDetail extends NavigatorPage {
  static defaultProps = {
    ...NavigatorPage.navigatorStyle,
    navBarHidden: false,
    navigationBarInsets: true,
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
    console.log('aaa:constructor');
    super(props);
    this.state = {
      sjid: props.sjid,
      simpleData: props.simpleData,
      nearByType: this.getNearByDetailType(props.sjType),
      containerHeight: 0,
      btnLocation: 0,
      list: [{ name: 'haha' }, { name: 'haha' }, { name: 'haha' }, { name: 'haha' }],
    };
  }

  componentDidMount() {
    console.log('aaa:111111111111');
    console.log('aaa:componenetDidMount');
    this.fetchData();
  }

  _hasMore = () => {
    return false;
  };

  _fetchMoreData = () => {
    if (this._hasMore() && !this.state.isLoading) {
    }
  };

  getNearByDetailType = sjType => {
    let type = '话题';
    switch (sjType) {
      case '200001':
        type = '一起';
        break;
      case '200002':
        type = '二手';
        break;
      case '200003':
        type = '时刻';
        break;
      case '200004':
        type = '话题';
        break;
      default:
        break;
    }
    return type;
  };

  fetchData = () => {
    const { loginInfo, locationInfo, fetchNearByDetail, sjid } = this.props;
    let auid = '';
    let M2 = '';
    if (loginInfo !== undefined) {
      auid = loginInfo.auid;
      M2 = loginInfo.loginToken;
    }
    let M3 = locationInfo.coordsStr;
    let M8 = md5.hex_md5(auid + new Date().getTime());
    let M9 = new Date().getTime();
    fetchNearByDetail({
      sjid: sjid,
      auid: auid === undefined ? '' : auid,
      M0: Platform.OS === 'ios' ? 'IMMC' : 'MMC',
      M2: M2,
      M3: M3,
      M8: M8,
      M9: M9,
    });
  };
  renderImage = uri => {
    const offsetScreen = 15;
    const imageSpace = 10;
    const imageHeight = Math.floor(
      (styleUtil.window.width - offsetScreen * 2 - imageSpace * 3) / 3,
    );
    return (
      <Image
        style={{
          width: imageHeight,
          height: imageHeight,
          marginRight: imageSpace,
        }}
        source={{ uri: uri }}
      />
    );
  };

  _renderNearByContent = () => {
    console.log('aaa:_renderHeaderConetent');
    const offsetScreen = 15;
    const imageSpace = 10;
    const imageHeight = Math.floor(
      (styleUtil.window.width - offsetScreen * 2 - imageSpace * 2) / 3,
    );

    const { sjid, nearByDetails } = this.props;
    const { nearByType } = this.state;
    const nearByDetail = nearByDetails.byId[sjid];
    if (!nearByDetail) {
      //Loading View while data is loading
      return (
        <View style={{ flex: 1, paddingTop: 20 }}>
          <ActivityIndicator />
        </View>
      );
    }
    console.log('nearByDetail:', JSON.stringify(nearByDetail));
    const userFace = nearByDetail.userFace || '';
    const userName = nearByDetail.userName || '';
    const sjTimeDesc = nearByDetail.sjTimeDesc || '';
    const title = nearByDetail.title || '';
    const content = nearByDetail.content || '';
    const price = nearByDetail.price || '';
    const location = nearByDetail.location || '';
    const picfile = nearByDetail.picfile || '';
    const havePrice = nearByDetail.price === undefined;
    return (
      <View
        style={{
          paddingTop: 15,
          paddingBottom: 10,
          paddingHorizontal: 15,
          backgroundColor: 'white',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Avatar size={43} rounded source={{ uri: userFace }} />
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'flex-start',
              marginLeft: 15,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#252525' }}>{userName}</Text>
            <Text style={{ fontSize: 12, color: '#c1c1c1', marginTop: 1 }}>{sjTimeDesc}</Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginTop: 15,
          }}
        >
          <View
            style={{
              height: 24,
              paddingHorizontal: 10,
              backgroundColor: '#828282',
              justifyContent: 'center',
              borderRadius: 12,
            }}
          >
            <Text style={{ color: 'white' }}>{nearByType}</Text>
          </View>
          <Text
            style={{
              flex: 1,
              marginLeft: 10,
              fontSize: 22,
              lineHeight: 25,
              fontWeight: '700',
            }}
          >
            {title}
          </Text>
          {havePrice ? (
            <Text
              style={{
                color: styleUtil.themeColor,
                fontSize: 16,
                fontWeight: '700',
                marginLeft: 10,
              }}
            >
              {price}
            </Text>
          ) : null}
        </View>

        <Text
          style={{
            marginTop: 10,
            fontSize: 14,
            lineHeight: 18,
            letterSpacing: 1,
            color: '#252525',
          }}
        >
          {content}
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
          {picfile.map(uri => {
            console.log('renderImage:uri:', uri);
            return this.renderImage(uri);
          })}
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            marginTop: 10,
          }}
        >
          <Icon name={'ios-pin'} type={'ionicon'} size={18} color={styleUtil.themeColor} />
          <Text style={{ fontsize: 12, color: '#C1C1C1', marginLeft: 5 }}>{location}</Text>
        </View>
      </View>
    );
  };

  _renderCommunityTab = () => {
    const { sjid, nearByDetails } = this.props;
    const nearByDetail = nearByDetails.byId[sjid] || { agreeNum: 0, commentNum: 0, collectNum: 0 };
    const { agreeNum, commentNum, collectNum } = nearByDetail;

    const tabs = [
      { show: true, selected: true, title: '回复', count: commentNum },
      { show: true, selected: false, title: '赞', count: agreeNum },
      { show: true, selected: false, title: '钉住', count: collectNum },
    ];

    return (
      <View
        style={{
          flexDirection: 'row',
          marginTop: 10,
          backgroundColor: 'white',
          paddingHorizontal: 15,
          paddingTop: 10,
          paddingBottom: 5,
        }}
      >
        {tabs.map(
          (v, i) =>
            v.show && (
              <TouchableOpacity
                onPress={_ => {
                  this.setState({ type: i, bottomDistance: 0 });
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                    paddingRight: 30,
                  }}
                >
                  <View>
                    <Text
                      style={{
                        fontSize: 18,
                        color: this.state.type == i ? '#252525' : '#888888',
                        fontWeight: v.selected ? '600' : 'normal',
                      }}
                    >
                      {v.title}
                    </Text>
                    <View
                      style={{
                        height: 3,
                        backgroundColor:
                          this.state.type == i ? styleUtil.themeColor : 'transparent',
                        borderRadius: 1.5,
                        marginTop: 4,
                      }}
                    />
                  </View>
                  <Text
                    style={{
                      height: 28,
                      fontsize: 12,
                      color: this.state.type == i ? '#252525' : '#888888',
                      fontWeight: this.state.type == i ? '600' : 'normal',
                    }}
                  >
                    {v.count}
                  </Text>
                </View>
              </TouchableOpacity>
            ),
        )}
      </View>
    );
  };

  _renderDetails = () => {
    const { fetchNearByDetailPending } = this.props;
    if (fetchNearByDetailPending) {
      //Loading View while data is loading
      return (
        <View style={{ flex: 1, paddingTop: 20 }}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View>
        <View onLayout={this._onLayoutContainer}>
          {this._renderNearByContent()}
          {this._renderCommunityTab()}
        </View>
        {this._renderCommunityContent()}
        {this._renderOperationBar()}
      </View>
    );
  };
  _onLayoutContainer = event => {
    const { x, y, width, height } = event.nativeEvent.layout;
    this.setState({ containerHeight: height });
  };

  _renderOperationBar = () => {
    return (
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          width: styleUtil.window.width,
          height: styleUtil.window.height * 0.05,
          backgroundColor: 'red',
          zIndex: 99999999,
        }}
      >
        <Input
          style={{ width: 200, padding: 20 }}
          size="sm"
          value={this.state.value}
          onChangeText={text => this.setState({ value: text })}
        />
      </View>
    );
  };
  _renderCommunityContent = () => {
    const { type } = this.state;
    let renderItem = null;
    switch (type) {
      case 0:
        renderItem = this._renderReplyRows;
        break;
      case 1:
        renderItem = this._renderLikeRows;
        break;
      case 2:
        renderItem = this._renderPinRows;
        break;
      default:
        renderItem = this._renderReplyRows;
        break;
    }
    return (
      <FlatList
        style={{
          width: styleUtil.window.width,
          height: styleUtil.window.height * 0.95 - this.state.containerHeight,
        }}
        contentInset={{ bottom: 60 }}
        extraData={this.state}
        data={this.state.list}
        renderItem={renderItem}
        initialNumToRender={config.pageSize}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={this._fetchMoreData}
        onEndReachedThreshold={0.3}
        onRefresh={this._fetchDataWithRefreshing}
        refreshing={this.state.isRefreshing}
        ListHeaderComponent={this._renderHeader}
        // ListFooterComponent={this._renderFooter}
        showsVerticalScrollIndicator={false}
        // onViewableItemsChanged={this._onViewableItemsChanged}
      />
    );
  };
  _renderReplyRows = ({ item, separators, index }) => {
    console.log('aaa:_renderReplyRows');
    return (
      <View
        style={{
          paddingHorizontal: 15,
          paddingTop: 10,
          backgroundColor: 'white',
        }}
      >
        <View style={{ flexDirection: 'row' }}>
          <Avatar large rounded source={require('../../assets/image/avatar.png')} />
          <View
            style={{
              marginLeft: 10,
              paddingBottom: 10,
              flex: 1,
              borderBottomWidth: 0.5,
              borderBottomColor: '#D8D8D8',
            }}
          >
            <Text style={{ marginTop: 10, color: '#252525', fontSize: 14 }}>
              {'还可以吧，国产片拍成这样已经不错了。'}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 15,
                alignItems: 'center',
              }}
            >
              <Image style={{ marginRight: 8 }} source={require('../../assets/image/host.png')} />
              <Text style={{ flex: 1, color: '#C1C1C1', fontSize: 12 }}>{'3分钟'}</Text>
              <Image style={{ marginRight: 8 }} source={require('../../assets/image/like.png')} />
              <Text style={{ width: 40, fontSize: 12, color: '#252525' }}>{3}</Text>
              <Ionicons name={'ios-more'} size={18} color={'#818181'} />
            </View>

            <View
              style={{
                paddingLeft: 8,
                paddingVertical: 8,
                backgroundColor: '#f8f8f8',
                borderRadius: 0,
                marginTop: 10,
              }}
            >
              <View style={{ flexDirection: 'row' }}>
                <Avatar large rounded source={require('../../assets/image/avatar.png')} />
                <View
                  style={{
                    marginLeft: 10,
                    paddingBottom: 10,
                    flex: 1,
                  }}
                >
                  <Text style={{ marginTop: 10, color: '#252525', fontSize: 14 }}>
                    {'还可以吧，国产片拍成这样已经不错了。'}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 15,
                      alignItems: 'center',
                    }}
                  >
                    <Image
                      style={{ marginRight: 8 }}
                      source={require('../../assets/image/host.png')}
                    />
                    <Text style={{ flex: 1, color: '#C1C1C1', fontSize: 12 }}>{'3分钟'}</Text>
                    <Image
                      style={{ marginRight: 8 }}
                      source={require('../../assets/image/like.png')}
                    />
                    <Text style={{ width: 40, fontSize: 12, color: '#252525' }}>{3}</Text>
                    <Ionicons name={'ios-more'} size={18} color={'#818181'} />
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
    console.log('aaa:_renderLikeRows');
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 15,
          backgroundColor: 'white',
        }}
      >
        <Avatar large rounded source={require('../../assets/image/avatar.png')} />
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            paddingVertical: 20,
            borderBottomColor: '#F5F5F5',
            borderBottomWidth: 0.5,
          }}
        >
          <Text style={{ flex: 1, marginLeft: 8, fontSize: 14, color: '#252525' }}>{'老大'}</Text>
          <Text style={{ fontSize: 12, color: '#C1C1C1' }}>{'刚刚'}</Text>
        </View>
      </View>
    );
  };

  _renderPinRows = ({ item, separators, index }) => {
    console.log('aaa:_renderPinRows');
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 15,
          backgroundColor: 'white',
        }}
      >
        <Avatar large rounded source={require('../../assets/image/avatar.png')} />
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            paddingVertical: 20,
            borderBottomColor: '#F5F5F5',
            borderBottomWidth: 0.5,
          }}
        >
          <Text style={{ flex: 1, marginLeft: 8, fontSize: 14, color: '#252525' }}>{'老大'}</Text>
          <Text style={{ fontSize: 12, color: '#C1C1C1' }}>{'刚刚'}</Text>
        </View>
      </View>
    );
  };

  renderPage() {
    const { fetchNearByDetailPending } = this.props;
    if (fetchNearByDetailPending) {
      //Loading View while data is loading
      return (
        <View style={{ flex: 1, paddingTop: 20 }}>
          <ActivityIndicator />
        </View>
      );
    }
    return <View style={styleUtil.container}>{this._renderDetails()}</View>;
  }

  renderNavigationRightView() {
    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <NavigationBar.Button onPress={() => gInstance._onClickContact()}>
          <OcticonsIcon name="comment" size={styleUtil.headerRight.fontSize} />
        </NavigationBar.Button>
        <NavigationBar.Button onPress={() => gInstance._onClickContact()}>
          <EntypoIcon name="dots-three-horizontal" size={styleUtil.headerRight.fontSize} />
        </NavigationBar.Button>
      </View>
    );
  }
}
function mapStateToProps(state, ownProps) {
  const { locationInfo, loginInfo, fetchNearByDetailPending, nearByDetails } = state;
  return {
    locationInfo,
    loginInfo,
    nearByDetails,
    fetchNearByDetailPending,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  const { fetchNearByDetail } = bindActionCreators({ ...actions }, dispatch);
  return {
    fetchNearByDetail: fetchNearByDetail,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NearbyDetail);
