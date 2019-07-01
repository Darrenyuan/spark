import React from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Animated,
  FlatList,
} from 'react-native';
import styleUtil from '../../common/styleUtil';
import NavigatorPage from '../../components/NavigatorPage';
import LoadingMore from '../../components/load/LoadingMore';
import OverlayModal from '../../components/OverlayModal';
import { Avatar, Icon } from 'react-native-elements';
import { NavigationBar } from 'teaset';
import config from '../../common/config';
import ImageCropPicker from 'react-native-image-crop-picker';
import navigate from '../../screens/navigate';
import DatePicker from '../../components/DatePicker';
import Blank from '../../components/Blank';
import NearbyItem from '../nearby/NearbyItem';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import NavBar from '../../components/NavBar';
import Settings from '../settings/Settings';
import UserQRCode from '../message/UserQRCode';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../services/redux/actions';
import { getApiVersion } from 'react-native-wechat';

class Profile extends NavigatorPage {
  static defaultProps = {
    ...NavigatorPage.navigatorStyle,
    navBarHidden: true,
    navigationBarInsets: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      nickName: '',
      birthday: '',
      markersArr: [],
      male: true,
      scrollY: new Animated.Value(0),
      list: [{ name: 'haha' }, { name: 'haha' }, { name: 'haha' }, { name: 'haha' }],
    };
  }

  _btnStyle = bool => (bool ? styleUtil.themeColor : styleUtil.disabledColor);
  componentDidMount() {
    let { markers } = this.props.userInfo;
    let expansionMarkerTypes = [];
    this.props.configInfo.markerTypes.map(item => {
      item.childs.map(item => {
        expansionMarkerTypes.push(item);
      });
    });
    let arr = [];
    if (markers.length > 1 && expansionMarkerTypes.length > 0) {
      expansionMarkerTypes.map(item => {
        markers.split(',').map(v => {
          item.typeID == v && arr.push(item);
        });
      });
    }
    this.setState({ markersArr: arr });
    console.log(arr);
    console.log('arr arr arr');
  }
  openCamera = type => {
    ImageCropPicker.openCamera({
      cropping: true,
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
      mediaType: 'photo',
      compressImageQuality: Platform.OS === 'ios' ? 0 : 1,
      minFiles: 1,
      maxFiles: 1,
    })
      .then(image => {
        // this._upload(image, type)
      })
      .catch(err => {
        if (err.code === 'E_PICKER_CANCELLED') {
          return;
        }
        alert('出错啦~');
      });
  };

  showAction = (type = 'avatar') => {
    let items = [
      {
        title: '拍照',
        onPress: _ => config.loadData(_ => this.openCamera(type)),
      },
      {
        title: '从相册中选取',
        onPress: _ => config.loadData(_ => this.selectLibrary(type)),
      },
    ];
    config.showAction(items);
  };

  showDatePicker = () => {
    let birthday = this.state.birthday;
    let arr = birthday.split('-');
    OverlayModal.show(
      <DatePicker
        selectedYear={arr[0]}
        selectedMonth={arr[1]}
        selectedDate={arr[2]}
        onDone={arr => {
          birthday = arr.join('-');
          this.setState({ birthday: birthday });
        }}
      />,
    );
  };

  _renderNavBar = () => {
    return (
      <NavBar
        style={{
          position: 'absolute',
          backgroundColor: 'transparent',
          borderBottomWidth: 0,
        }}
        renderLeftView={
          <NavigationBar.Button onPress={() => navigate.pushNotNavBar(UserQRCode)}>
            <FontAwesome name={'qrcode'} color={'white'} size={22} />
          </NavigationBar.Button>
        }
        renderRightView={
          <NavigationBar.Button onPress={() => navigate.pushNotNavBar(Settings)}>
            <SimpleLineIcons name={'settings'} color={'white'} size={22} />
          </NavigationBar.Button>
        }
      />
    );
  };

  _renderHeader = () => {
    let { scrollY, markersArr } = this.state;
    let windowHeight = styleUtil.window.width * (218.0 / 375.0);
    const { userInfo, configInfo } = this.props;

    return (
      <View
        style={{
          backgroundColor: 'white',
          paddingBottom: 10,
        }}
      >
        <View>
          <Animated.Image
            style={{
              width: styleUtil.window.width,
              height: windowHeight,
              transform: [
                {
                  translateY: scrollY.interpolate({
                    inputRange: [-windowHeight, 0, windowHeight, windowHeight],
                    outputRange: [-windowHeight / 2, 0, -windowHeight / 3, -windowHeight / 3],
                  }),
                },
                {
                  scale: scrollY.interpolate({
                    inputRange: [-windowHeight, 0, windowHeight],
                    outputRange: [2, 1, 1],
                  }),
                },
              ],
            }}
            source={
              userInfo.myBackground === ''
                ? require('../../assets/image/login_head_background.png')
                : {
                    uri: userInfo.myBackground && userInfo.myBackground.replace(/cs.png/g, '.png'),
                  }
            }
          />
          <View
            style={{
              position: 'absolute',
              width: '100%',
              bottom: 0,
              justifyItem: 'flex-end',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                flexDirection: 'column',
                alignItems: 'center',
                marginBottom: 20,
              }}
              onPress={_ => this.showAction('avatar')}
            >
              <Avatar
                size={57}
                rounded
                source={
                  userInfo.face === ''
                    ? require('../../assets/image/avatar.png')
                    : {
                        uri: userInfo.face && userInfo.face.replace(/cs.png/g, '.png'),
                      }
                }
              />
              <Text style={{ fontSize: 18, color: 'white', marginTop: 3 }}>
                {userInfo.nickName}
              </Text>
              <Text style={{ fontSize: 14, color: 'white', marginTop: 3 }}>
                {configInfo.kkStatusTypes.map(v => {
                  if (v.typeID == userInfo.kkStatus) {
                    return v.typeName;
                  }
                })}
              </Text>
              <View style={{ flexDirection: 'row', marginTop: 20 }}>
                {markersArr.map((v, i) => {
                  return (
                    <View
                      key={i}
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.4)',
                        height: 26,
                        paddingHorizontal: 10,
                        justifyContent: 'center',
                        borderRadius: 13,
                        marginHorizontal: 4,
                      }}
                    >
                      <Text style={{ fontSize: 14, color: 'white' }}>{v.typeName}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            marginTop: 15,
            marginHorizontal: 15,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 18,
              color: '#333333',
              fontWeight: '700',
              marginRight: 10,
            }}
          >
            {'所有'}
          </Text>
          <Icon name={'ios-arrow-down'} type={'ionicon'} color={'#BABABA'} size={20} />
          <Text style={{ fontSize: 14, color: '#333333', marginLeft: 15 }}>{'23天，0个时刻'}</Text>
        </View>
      </View>
    );
  };

  _renderRows = ({ item, separators, index }) => {
    return <NearbyItem item={item} another={this.state.another} />;
  };

  renderPage() {
    const { nickName, birthday, male, scrollY } = this.state;
    console.log(this.props.configInfo);
    console.log(this.props.userInfo);
    return (
      <View style={styleUtil.container}>
        <FlatList
          // extraData={this.state}
          // data={this.state.list}
          renderItem={this._renderRows}
          initialNumToRender={config.pageSize} //一开始渲染的元素数量
          // keyExtractor={(item, index) => index.toString()}
          onEndReached={this._fetchMoreData}
          onEndReachedThreshold={0.3}
          onRefresh={this._fetchDataWithRefreshing} //下拉刷新
          refreshing={this.state.isRefreshing}
          ListHeaderComponent={this._renderHeader}
          ListEmptyComponent={<Blank title={'在这，记录你的存在'} />}
          ListFooterComponent={this._renderFooter}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={1}
          onScroll={Animated.event([
            {
              nativeEvent: {
                contentOffset: {
                  y: this.state.scrollY,
                },
              },
            },
          ])}
        />
        {this._renderNavBar()}
      </View>
    );
  }
}
function mapStateToProps(state) {
  return {
    userInfo: state.userInfo,
    configInfo: state.configInfo,
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
)(Profile);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: styleUtil.backgroundColor,
  },
  signUpBox: {
    marginTop: 10,
    // padding: 10
  },
  title: {
    marginBottom: 20,
    color: '#333',
    fontSize: 20,
    textAlign: 'center',
  },
  inputField: {
    marginLeft: 8,
    height: 35,
    paddingLeft: 8,
    color: '#454545',
    fontSize: 16,
    backgroundColor: 'transparent',
    borderBottomWidth: styleUtil.borderSeparator,
    // borderWidth: styleUtil.borderSeparator,
    borderColor: styleUtil.borderColor,
  },
  buttonBox: {
    marginTop: 80,
    backgroundColor: styleUtil.themeColor,
    height: 48,
    borderWidth: 1,
    borderColor: styleUtil.themeColor,
    borderRadius: 24,
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    marginTop: 12,
  },
  verifyCodeBox: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  countBtn: {
    width: 110,
    height: 40,
    padding: 10,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: styleUtil.themeColor,
    backgroundColor: styleUtil.themeColor,
    borderRadius: 4,
  },
  countBtnText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
  },
  closeModal: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
});
