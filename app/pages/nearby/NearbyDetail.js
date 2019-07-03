import React from 'react';
import ReactNative from 'react-native';
import {
  StyleSheet,
  Text,
  TextInput,
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
  Animated,
  Keyboard,
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
import { ActionPopover, PullPicker } from 'teaset';
import md5 from 'react-native-md5';
import { NavigationBar, Input, Button, Label } from 'teaset';
import { default as EntypoIcon } from 'react-native-vector-icons/Entypo';
import { default as OcticonsIcon } from 'react-native-vector-icons/Octicons';
import logo from './logo.png';
import { red } from 'ansi-colors';
import KeyboardShift from './KeyboardShift';
import TextInputBar from '../../components/TextInputBar';
import { apiComment, apiAgree, apiCommentAgree } from '../../services/axios/api';
import toast from '../../common/toast';
import { isArgumentPlaceholder } from '@babel/types';
const UIManager = require('NativeModules').UIManager;
class NearbyDetail extends NavigatorPage {
  static defaultProps = {
    ...NavigatorPage.navigatorStyle,
    navBarHidden: false,
    navigationBarInsets: true,
  };

  constructor(props) {
    super(props);
    this.replyRef = {};

    this.state = {
      sjid: props.sjid,
      simpleData: props.simpleData,
      nearByType: this.getNearByDetailType(props.sjType),
      containerHeight: 0,
      page: 1,
      pageSize: 10,
      commentPage: 1,
      commentPageSize: 10,
      replyText: 0,
      list: [{ name: 'haha' }, { name: 'haha' }, { name: 'haha' }, { name: 'haha' }],
    };
  }

  componentDidMount() {
    this.fetchData();
    this.fetchCommentListData();
  }
  _reloadAllData() {
    this.fetchData();
    this.fetchCommentListData();
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
  fetchCommentListData = () => {
    const { loginInfo, locationInfo, fetchCommentList, sjid } = this.props;
    let auid = '';
    let M2 = '';
    if (loginInfo !== undefined) {
      auid = loginInfo.auid;
      M2 = loginInfo.loginToken;
    }
    let M3 = locationInfo.coordsStr;
    let M8 = md5.hex_md5(auid + new Date().getTime());
    let M9 = new Date().getTime();
    let searchTerm = `search_${sjid}`;
    let page = this.state.commentPage;
    let pageSize = this.state.commentPageSize;
    fetchCommentList({
      sjid: sjid,
      page: page,
      pageSize: pageSize,
      auid: auid === undefined ? '' : auid,
      M0: Platform.OS === 'ios' ? 'IMMC' : 'MMC',
      M2: M2,
      M3: M3,
      M8: M8,
      M9: M9,
      searchTerm: searchTerm,
    });
  };
  _hasMoreComment = () => {
    const { commentPage, commentPageSize } = this.state;
    const { commentList } = this.props;
    const { sjid } = this.props;
    let currentTotal = commentPage * commentPageSize;
    let searchTerm = `search_${sjid}`;
    let totalCount = 0;
    if (commentList[searchTerm] !== undefined) {
      totalCount = commentList[searchTerm].totalCount;
    }
    return currentTotal < totalCount;
  };

  _fetchCommentMoreData = () => {
    if (this._hasMoreComment()) {
      commentPage = this.state.commentPage + 1;
      this.setState({ commentPage: commentPage }, this.fetchCommentListData);
    }
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
  _sendReply = replyID => {
    const { loginInfo, locationInfo, fetchNearByDetail, sjid } = this.props;
    const { replyText } = this.state;
    let auid = '';
    let M2 = '';
    if (loginInfo !== undefined) {
      auid = loginInfo.auid;
      M2 = loginInfo.loginToken;
    }
    let M3 = locationInfo.coordsStr;
    let M8 = md5.hex_md5(auid + new Date().getTime());
    let M9 = new Date().getTime();
    apiComment({
      sjid: sjid,
      content: replyText,
      replyID: replyID,
      auid: auid === undefined ? '' : auid,
      M0: Platform.OS === 'ios' ? 'IMMC' : 'MMC',
      M2: M2,
      M3: M3,
      M8: M8,
      M9: M9,
    })
      .then(res => {
        if (res.data.code === 1) {
          toast.success('发表评论成功');
          this.setState({ replyText: '', commentPage: 1 });
          this._reloadAllData();
        } else {
          toast.fail('发表评论失败');
        }
      })
      .catch(err => {
        toast.fail('发表评论失败');
      });
  };

  _onPressLikeForComment = (commentId, like) => {
    const { loginInfo, locationInfo, fetchNearByDetail, sjid } = this.props;
    const { replyText } = this.state;
    let auid = '';
    let M2 = '';
    if (loginInfo !== undefined) {
      auid = loginInfo.auid;
      M2 = loginInfo.loginToken;
    }
    let M3 = locationInfo.coordsStr;
    let M8 = md5.hex_md5(auid + new Date().getTime());
    let M9 = new Date().getTime();
    apiCommentAgree({
      sjid: sjid,
      commentDataid: commentId,
      agreeFlag: like,
      auid: auid === undefined ? '' : auid,
      M0: Platform.OS === 'ios' ? 'IMMC' : 'MMC',
      M2: M2,
      M3: M3,
      M8: M8,
      M9: M9,
    })
      .then(res => {
        if (res.data.code === 1) {
          toast.success('点赞成功');
          this._reloadAllData();
        } else {
          toast.fail('点赞失败');
        }
      })
      .catch(err => {
        toast.fail('点赞失败');
      });
  };
  _onPressLike = like => {
    const { loginInfo, locationInfo, fetchNearByDetail, sjid } = this.props;
    const { replyText } = this.state;
    let auid = '';
    let M2 = '';
    if (loginInfo !== undefined) {
      auid = loginInfo.auid;
      M2 = loginInfo.loginToken;
    }
    let M3 = locationInfo.coordsStr;
    let M8 = md5.hex_md5(auid + new Date().getTime());
    let M9 = new Date().getTime();
    apiAgree({
      sjid: sjid,
      agreeFlag: like,
      auid: auid === undefined ? '' : auid,
      M0: Platform.OS === 'ios' ? 'IMMC' : 'MMC',
      M2: M2,
      M3: M3,
      M8: M8,
      M9: M9,
    })
      .then(res => {
        if (res.data.code === 1) {
          toast.success('点赞成功');
          this.fetchData();
        } else {
          toast.fail('点赞失败');
        }
      })
      .catch(err => {
        toast.fail('点赞失败');
      });
  };

  _renderOperationBar = () => {
    const { sjid, nearByDetails } = this.props;
    const { nearByType } = this.state;
    const nearByDetail = nearByDetails.byId[sjid];
    let isAgreed = 0;
    let isCollected = 0;
    if (nearByDetail !== undefined) {
      isAgreed = nearByDetail.isAgreed;
      isCollected = nearByDetail.isCollected;
    }
    return (
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          width: styleUtil.window.width,
          height: styleUtil.window.height * 0.05,
          backgroundColor: 'white',
          zIndex: 99999999,
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Input
          style={{
            flex: 1,
            backgroundColor: '#F5F5F5',
            marginLeft: 10,
            radius: '10',
          }}
          rounded
          size="sm"
          value={this.state.replyText}
          onChangeText={text => this.setState({ replyText: text })}
          placeholder="写回复"
        />
        <Button
          sylte={{
            marginRigth: 8,
            color: '#F5F5F5',
            justifyContent: 'flex-start',
          }}
          type="link"
          size="sm"
          onPress={() => this._sendReply('')}
        >
          <Label
            style={{
              color: 'grey',
              fontSize: 16,
              paddingLeft: 8,
              //borderWidth: 1,
              //borderColor: 'red',
            }}
            text="发布"
          />
        </Button>
        <TouchableOpacity onPress={() => this._onPressLike(isAgreed === 0 ? 1 : 0)}>
          <Image
            style={{ marginRight: 8, paddingTop: 10 }}
            source={
              isAgreed === 0
                ? require('../../assets/image/like.png')
                : require('../../assets/image/like_highlight.png')
            }
          />
        </TouchableOpacity>
        <Image
          style={{ marginRight: 8 }}
          source={
            isCollected === 0
              ? require('../../assets/image/pin.png')
              : require('../../assets/image/tabbar_pin_highlight.png')
          }
        />
      </View>
    );
  };
  _renderCommunityContent = () => {
    const { type } = this.state;
    const { sjid } = this.props;
    let renderItem = null;
    let list = [];
    let initialNum = 0;
    let onEndReachedAction = null;
    let { commentList } = this.props;
    let page = this.state.commentPage;
    switch (type) {
      case 0:
      default:
        renderItem = this._renderReplyRows;
        let searchTerm = `search_${sjid}`;
        const allPages = commentList[searchTerm];
        const byId = commentList.byId;
        let items = [];
        if (allPages !== undefined) {
          for (i = 1; i <= page; i++) {
            if (allPages[i] && allPages[i].items) {
              allPages[i].items.forEach(item => {
                let data = byId[item];
                if (data.level === 1) {
                  items.push(item);
                }
              });
            }
          }
        }
        list = items;
        initialNum = this.state.commentPageSize;
        onEndReachedAction = this._fetchCommentMoreData;
        break;
        // case 1:
        //   renderItem = this._renderLikeRows;
        //   break;
        // case 2:
        //   renderItem = this._renderPinRows;
        //   break;
        // default:
        //   renderItem = this._renderReplyRows;
        break;
    }
    return (
      <FlatList
        ref={ref => (this.flatListRef = ref)}
        style={{
          backgroundColor: 'white',
          width: styleUtil.window.width,
          height: styleUtil.window.height * 0.95 - this.state.containerHeight,
        }}
        contentInset={{ bottom: 60 }}
        extraData={this.state}
        data={list}
        renderItem={renderItem}
        initialNumToRender={initialNum}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={onEndReachedAction}
        onEndReachedThreshold={0.3}
        // ListFooterComponent={this._renderFooter}
        showsVerticalScrollIndicator={false}
        // onViewableItemsChanged={this._onViewableItemsChanged}
      />
    );
  };

  _showPopOver = (commentId, type) => {
    let items = [];
    if (type === 2) {
      items = [
        {
          title: '回复',
          onPress: () => {
            this._removeOnPress(item, removeCommentUri);
          },
        },
        {
          title: '举报',
          onPress: () => {
            this._removeOnPress(item, removeCommentUri);
          },
        },
      ];
    }
    const handle = ReactNative.findNodeHandle(this.replyRef[commentId]);
    UIManager.measure(handle, (x, y, width, height, fx, fy) => {
      ActionPopover.show({ x, y, width, height }, items);
    });
  };
  // handleLayoutChange(event, commentId) {
  //   this.replyRef[commentId].measure((fx, fy, width, height, px, py) => {
  //     console.log('Component width is: ' + width);
  //     console.log('Component height is: ' + height);
  //     console.log('X offset to page: ' + px);
  //     console.log('Y offset to page: ' + py);
  //   });
  // }
  handleReplyLayout = event => {
    console.log('handleReplyLayouthandleReplyLayouthandleReplyLayout');
    const layout = event.nativeEvent.layout;
    console.log('layout:', JSON.stringify(layout));
    console.log('height:', layout.height);
    console.log('width:', layout.width);
    console.log('x:', layout.x);
    console.log('y:', layout.y);
  };
  _renderReplyRows = ({ item, separators, index }) => {
    let _this = this;
    const { loginInfo } = this.props;
    const { sjid, nearByDetails } = this.props;
    const { nearByType } = this.state;
    const nearByDetail = nearByDetails.byId[sjid];
    const { replyText } = this.state;
    let auid = '';
    if (nearByDetail !== undefined) {
      auid = nearByDetail.userAuid;
    }
    const { commentList } = this.props;
    const byId = commentList.byId;
    const data = byId[item];
    commentId = data.dataid;
    let childData = [];
    Object.keys(byId).forEach(key => {
      let value = byId[key];
      if (value.replyID === commentId) {
        childData.push(value);
      }
    });
    let hasChildData = childData.length > 0;
    return (
      <View
        style={{
          paddingHorizontal: 15,
          paddingTop: 10,
          backgroundColor: 'white',
        }}
      >
        <View style={{ flexDirection: 'row' }}>
          <Avatar large rounded source={{ uri: data.userFace }} />
          <View
            style={{
              marginLeft: 10,
              paddingBottom: 10,
              flex: 1,
              borderBottomWidth: 0.5,
              borderBottomColor: '#D8D8D8',
            }}
          >
            <Text style={{ marginTop: 10, color: '#252525', fontSize: 14 }}>{data.content}</Text>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 15,
                alignItems: 'center',
              }}
            >
              {data.userAuid === auid && (
                <Image style={{ marginRight: 8 }} source={require('../../assets/image/host.png')} />
              )}
              <Text style={{ flex: 1, color: '#C1C1C1', fontSize: 12 }}>{data.actionTimeDesc}</Text>
              <TouchableOpacity
                onPress={() => {
                  this._onPressLikeForComment(commentId, data.isAgreed === 0 ? 1 : 0);
                }}
              >
                <Image
                  style={{ marginRight: 8 }}
                  source={
                    data.isAgreed === 0
                      ? require('../../assets/image/like.png')
                      : require('../../assets/image/like_highlight.png')
                  }
                />
              </TouchableOpacity>
              <Text style={{ width: 40, fontSize: 12, color: '#252525' }}>{data.agreeNum}</Text>
              <View
                onLayout={this.handleReplyLayout.bind(this)}
                collapsable={false}
                renderToHardwareTextureAndroid={true}
                ref={c => (_this.replyRef[commentId] = c)}
              >
                <TouchableOpacity onPress={() => this._showPopOver(commentId, 2)}>
                  <Ionicons name={'ios-more'} size={18} color={'#818181'} />
                </TouchableOpacity>
              </View>
            </View>
            {hasChildData && (
              <View
                style={{
                  paddingLeft: 8,
                  paddingVertical: 8,
                  backgroundColor: '#f8f8f8',
                  borderRadius: 0,
                  marginTop: 10,
                }}
              >
                {childData.map(rowData => {
                  return (
                    <View style={{ flexDirection: 'row' }}>
                      <Avatar large rounded source={{ uri: rowData.userFace }} />
                      <View
                        style={{
                          marginLeft: 10,
                          paddingBottom: 10,
                          flex: 1,
                        }}
                      >
                        <Text style={{ marginTop: 10, color: '#252525', fontSize: 14 }}>
                          {rowData.content}
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            marginTop: 15,
                            alignItems: 'center',
                          }}
                        >
                          {rowData.isOwner === 1 && (
                            <Image
                              style={{ marginRight: 8 }}
                              source={require('../../assets/image/host.png')}
                            />
                          )}

                          <Text style={{ flex: 1, color: '#C1C1C1', fontSize: 12 }}>
                            {rowData.actionTimeDesc}
                          </Text>
                          {rowData.isAgreed === 0 ? (
                            <Image
                              style={{ marginRight: 8 }}
                              source={require('../../assets/image/like.png')}
                            />
                          ) : (
                            <Image
                              style={{ marginRight: 8 }}
                              source={require('../../assets/image/like_highlight.png')}
                            />
                          )}
                          <Text style={{ width: 40, fontSize: 12, color: '#252525' }}>
                            {rowData.agreeNum}
                          </Text>
                          <Ionicons name={'ios-more'} size={18} color={'#818181'} />
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  _renderLikeRows = ({ item, separators, index }) => {
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

  render() {
    return <KeyboardShift>{() => super.render()}</KeyboardShift>;
    // return super.render();
  }
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
    return (
      <KeyboardAvoidingView style={styleUtil.container} behavior="padding">
        {this._renderDetails()}
      </KeyboardAvoidingView>
    );
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
  const { locationInfo, loginInfo, fetchNearByDetailPending, nearByDetails, commentList } = state;
  return {
    locationInfo,
    loginInfo,
    nearByDetails,
    fetchNearByDetailPending,
    commentList,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  const { fetchNearByDetail, fetchCommentList } = bindActionCreators({ ...actions }, dispatch);
  return {
    fetchNearByDetail: fetchNearByDetail,
    fetchCommentList,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NearbyDetail);
