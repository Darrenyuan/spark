import React from 'react';
import ReactNative, {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import styleUtil from '../../common/styleUtil';
import NavigatorPage from '../../components/NavigatorPage';
import LoadingMore from '../../components/load/LoadingMore';
import { Image, Icon, Avatar, Divider } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../services/redux/actions';
import { ActionSheet, Overlay, NavigationBar, Input, Button, Label } from 'teaset';
import md5 from 'react-native-md5';
import { default as EntypoIcon } from 'react-native-vector-icons/Entypo';
import { default as OcticonsIcon } from 'react-native-vector-icons/Octicons';
import KeyboardShift from './KeyboardShift';
import { apiComment, apiAgree, apiCommentAgree } from '../../services/axios/api';
import toast from '../../common/toast';
import navigate from '../../screens/navigate';
import NearbyChildrenReply from './NearbyChildrenReply';
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
      agreePage: 1,
      agreePageSize: 10,
      collectPage: 1,
      collectPageSize: 10,
      replyText: 0,
      type: 0,
    };
  }

  componentDidMount() {
    this._reloadAllData();
  }
  _reloadAllData() {
    this.fetchData();
    this.fetchCommentListData();
    this.fetchAgreeListData();
  }

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
      auid = loginInfo.auid || '';
      M2 = loginInfo.loginToken || '';
    }
    const M3 = locationInfo.coordsStr;
    const M8 = md5.hex_md5(auid + new Date().getTime());
    const M9 = new Date().getTime();
    const M0 = Platform.OS === 'ios' ? 'IMMC' : 'MMC';
    fetchNearByDetail({
      sjid,
      auid,
      M0,
      M2,
      M3,
      M8,
      M9,
    });
  };

  fetchAgreeListData = () => {
    const { loginInfo, locationInfo, fetchAgreeList, sjid } = this.props;
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
    let page = this.state.agreePage;
    let pageSize = this.state.agreePageSize;
    fetchAgreeList({
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
    const { commentList, sjid } = this.props;
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
  _hasMoreAgree = () => {
    const { agreePage, agreePageSize } = this.state;
    const { agreeList, sjid } = this.props;
    let currentTotal = agreePage * agreePageSize;
    let searchTerm = `search_${sjid}`;
    let totalCount = 0;
    if (agreeList[searchTerm] !== undefined) {
      totalCount = agreeList[searchTerm].totalCount;
    }
    return currentTotal < totalCount;
  };

  _fetchAgreeMoreData = () => {
    if (this._hasMoreAgree()) {
      agreePage = this.state.agreePage + 1;
      this.setState({ agreePage: agreePage }, this.fetchAgreeListData);
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
        {Boolean(this.state.type === 0) && this._renderOperationBar()}
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
    const { sjid, nearByDetails, agreeList } = this.props;
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
              paddingLeft: 8,
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

  _renderCommentFooter = () => {
    return <LoadingMore hasMore={this._hasMoreComment()} />;
  };
  _renderAgreeFooter = () => {
    return <LoadingMore hasMore={this._hasMoreAgree()} />;
  };
  _renderCommunityContent = () => {
    const { type } = this.state;
    const { sjid, agreeList, commentList } = this.props;
    let renderItem = null;
    let list = [];
    let initialNum = 0;
    let onEndReachedAction = null;
    let page = 1;
    let searchTerm, allPages, byId, items, renderFooter;
    switch (type) {
      case 0:
        renderItem = this._renderReplyRows;
        page = this.state.commentPage;
        searchTerm = `search_${sjid}`;
        allPages = commentList[searchTerm];
        byId = commentList.byId;
        items = [];
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
        renderFooter = this._renderCommentFooter;
        break;
      case 1:
        renderItem = this._renderLikeRows;
        page = this.state.agreePage;
        searchTerm = `search_${sjid}`;
        allPages = agreeList[searchTerm];
        byId = agreeList.byId;
        items = [];
        if (allPages !== undefined) {
          for (i = 1; i <= page; i++) {
            if (allPages[i] && allPages[i].items) {
              allPages[i].items.forEach(item => {
                let data = byId[item];
                items.push(data);
              });
            }
          }
        }
        list = items;
        initialNum = this.state.agreePageSize;
        // initialNum = 1;
        onEndReachedAction = this._fetchAgreeMoreData;
        renderFooter = this._renderAgreeFooter;
        break;
      // case 2:
      //   renderItem = this._renderPinRows;
      //   break;
      // default:
      //   renderItem = this._renderReplyRows;
      // break;
      default:
        renderItem = this._renderReplyRows;
        page = this.state.commentPage;
        searchTerm = `search_${sjid}`;
        allPages = commentList[searchTerm];
        byId = commentList.byId;
        items = [];
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
        initialNum = 1;
        onEndReachedAction = this._fetchCommentMoreData;
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
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
        // onViewableItemsChanged={this._onViewableItemsChanged}
      />
    );
  };

  setNativeProps = nativeProps => {
    this.replyCommentRef.setNativeProps(nativeProps);
  };

  _showPopOver = (data, type, callback) => {
    let items = [];
    if (type === 2) {
      items = [
        {
          title: '回复',
          onPress: () => {
            let overlayView = (
              <Overlay.PopView
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  width: styleUtil.window.width,
                  backgroundColor: 'white',
                }}
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    paddingHorizontal: 15,
                    paddingTop: 10,
                    backgroundColor: 'white',
                  }}
                >
                  <Avatar large rounded source={{ uri: data.userFace }} />
                  <Text style={{ marginLeft: 10 }}>{data.content}</Text>
                </View>
                <Divider style={{ marginTop: 10, marginBottom: 10 }} />
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    backgroundColor: 'white',
                  }}
                >
                  <Input
                    style={{
                      flex: 1,
                      backgroundColor: '#F5F5F5',
                      marginLeft: 10,
                      marginRight: 10,
                      radius: '20',
                    }}
                    rounded
                    size="sm"
                    // value={this.state.replyText}
                    onChangeText={text => this.setState({ replyText: text })}
                    placeholder="写回复"
                    autoFocus={true}
                  />
                  <Button
                    style={{
                      marginRight: 10,
                      color: '#F5F5F5',
                    }}
                    type="link"
                    size="sm"
                    onPress={() => {
                      console.log('hide overlayView');
                      Overlay.hide(this.popViewKey);
                      this._sendReply(data.dataid);
                      if (callback) {
                        callback();
                      }
                    }}
                  >
                    <Label
                      style={{
                        color: 'grey',
                      }}
                      text="发布"
                    />
                  </Button>
                </View>
              </Overlay.PopView>
            );
            this.popViewKey = Overlay.show(overlayView);
          },
        },
        {
          title: '举报',
          onPress: () => {
            toast.success('举报成功');
          },
        },
      ];
    }
    let cancelItem = { title: '取消' };
    ActionSheet.show(items, cancelItem);
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
    let commentId = item;
    let childNum = data.replyNum;
    let hasChildData = childNum && childNum > 0;
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

              <TouchableOpacity
                onPress={() => this._showPopOver(data, 2)}
                ref={c => (_this.replyRef[commentId] = c)}
              >
                <Ionicons name={'ios-more'} size={18} color={'#818181'} />
              </TouchableOpacity>
            </View>
            {Boolean(hasChildData) && (
              <View
                style={{
                  paddingLeft: 8,
                  paddingVertical: 8,
                  backgroundColor: '#f8f8f8',
                  borderRadius: 0,
                  marginTop: 10,
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    navigate.pushNotNavBar(NearbyChildrenReply, {
                      title: `${childNum}条回复`,
                      sjid: sjid,
                      dataid: commentId,
                      auid: auid,
                      _onPressLikeForComment: this._onPressLikeForComment,
                      _showPopOver: this._showPopOver,
                    })
                  }
                >
                  <Text>{`共${childNum}条回复>`}</Text>
                </TouchableOpacity>
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
        <Avatar large rounded source={{ uri: item.userFace }} />
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            paddingVertical: 20,
            borderBottomColor: '#F5F5F5',
            borderBottomWidth: 0.5,
          }}
        >
          <Text style={{ flex: 1, marginLeft: 8, fontSize: 14, color: '#252525' }}>
            {item.userName}
          </Text>
          <Text style={{ fontSize: 12, color: '#C1C1C1' }}>{item.actionTimeDesc}</Text>
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

  render() {
    return <KeyboardShift>{() => super.render()}</KeyboardShift>;
  }
  renderPage() {
    const { fetchNearByDetailPending } = this.props;
    if (fetchNearByDetailPending) {
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
  _showPopOverRightView = () => {
    let items = [
      {
        title: '举报',
        onPress: () => {
          toast.success('举报成功');
        },
      },
    ];
    let cancelItem = { title: '取消' };
    ActionSheet.show(items, cancelItem);
  };

  renderNavigationRightView() {
    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <NavigationBar.Button onPress={() => gInstance._onClickContact()}>
          <OcticonsIcon name="comment" size={styleUtil.headerRight.fontSize} />
        </NavigationBar.Button>
        <NavigationBar.Button onPress={() => this._showPopOverRightView()}>
          <EntypoIcon name="dots-three-horizontal" size={styleUtil.headerRight.fontSize} />
        </NavigationBar.Button>
      </View>
    );
  }
}
function mapStateToProps(state, ownProps) {
  const {
    locationInfo,
    loginInfo,
    fetchNearByDetailPending,
    nearByDetails,
    commentList,
    agreeList,
    collectList,
  } = state;
  return {
    locationInfo,
    loginInfo,
    nearByDetails,
    fetchNearByDetailPending,
    commentList,
    agreeList,
    collectList,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  const {
    fetchNearByDetail,
    fetchCommentList,
    fetchAgreeList,
    fetchCollectList,
  } = bindActionCreators({ ...actions }, dispatch);
  return {
    fetchNearByDetail,
    fetchCommentList,
    fetchAgreeList,
    fetchCollectList,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NearbyDetail);
