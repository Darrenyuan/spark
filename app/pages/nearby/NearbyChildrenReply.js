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
import { Image, Icon, Avatar, Divider } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../services/redux/actions';
import { ActionPopover, PullPicker, ActionSheet, Overlay } from 'teaset';
import md5 from 'react-native-md5';
import { NavigationBar, Input, Button, Label } from 'teaset';
import { default as EntypoIcon } from 'react-native-vector-icons/Entypo';
import { default as OcticonsIcon } from 'react-native-vector-icons/Octicons';
import KeyboardShift from './KeyboardShift';
import TextInputBar from '../../components/TextInputBar';
import { apiComment, apiAgree, apiCommentAgree } from '../../services/axios/api';
import toast from '../../common/toast';
import { isArgumentPlaceholder } from '@babel/types';
import navigate from '../../screens/navigate';
import _ from 'lodash';

class NearbyChildrenReply extends NavigatorPage {
  static defaultProps = {
    ...NavigatorPage.navigatorStyle,
    navBarHidden: false,
    navigationBarInsets: true,
  };

  constructor(props) {
    super(props);
    this.replyRef = {};
    this.state = {
      // visible: false,
      commentPage: 1,
      commentPageSize: 10,
      replyText: '',
      replyID: this.props.dataid,
    };
  }

  componentDidMount() {
    super.componentDidMount();
    this.fetchCommentListData();
  }

  fetchCommentListData = () => {
    const { loginInfo, locationInfo, fetchCommentList, sjid, dataid } = this.props;
    let auid = '';
    let M2 = '';
    if (loginInfo !== undefined) {
      auid = loginInfo.auid;
      M2 = loginInfo.loginToken;
    }
    let M3 = locationInfo.coordsStr;
    let M8 = md5.hex_md5(auid + new Date().getTime());
    let M9 = new Date().getTime();
    let searchTerm = `search_${sjid}_${dataid}`;
    let page = this.state.commentPage;
    let pageSize = this.state.commentPageSize;
    fetchCommentList({
      sjid: sjid,
      page: page,
      replyID: dataid,
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
    const { commentList, dataid } = this.props;
    const { sjid } = this.props;
    let currentTotal = commentPage * commentPageSize;
    let searchTerm = `search_${sjid}_${dataid}`;
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

  renderNavigationTitle() {
    const {
      auid,
      dataid,
      commentList,
      fetchCommentListPengding,
      fetchCommentListError,
      sjid,
      _onPressLikeForComment,
    } = this.props;
    let page = this.state.commentPage;
    if (fetchCommentListPengding) {
      return <ActivityIndicator />;
    }
    const data = commentList.byId[dataid];
    return `${data.replyNum}条回复`;
  }

  componentDidUpdate(prevProps, prevState) {
    if (!_.isEqual(prevState.data, this.props.data)) {
      //Perform some operation here
      this.setState({ data: this.props.data });
    }
  }
  _renderFooter = () => {
    return <LoadingMore hasMore={this._hasMoreComment()} />;
  };
  renderItem = ({ item, seperator, index }) => {
    const { _onPressLikeForComment, commentList } = this.props;
    const childNum = item.replyNum;
    const hasChildData = childNum && childNum > 0;
    return (
      <View style={{ flexDirection: 'row' }}>
        <Avatar large rounded source={{ uri: item.userFace.replace(/cs.png/g, '.png') }} />
        <View
          style={{
            marginLeft: 10,
            paddingBottom: 10,
            flex: 1,
          }}
        >
          <Text style={{ marginTop: 10, color: '#252525', fontSize: 14 }}>{item.content}</Text>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 15,
              alignItems: 'center',
            }}
          >
            {item.isOwner === 1 && (
              <Image style={{ marginRight: 8 }} source={require('../../assets/image/host.png')} />
            )}
            <Text style={{ flex: 1, color: '#C1C1C1', fontSize: 12 }}>{item.actionTimeDesc}</Text>
            {item.isAgreed === 0 ? (
              <TouchableOpacity
                onPress={() => {
                  _onPressLikeForComment(commentId, item.isAgreed === 0 ? 1 : 0),
                    this.fetchCommentListData();
                }}
              >
                <Image style={{ marginRight: 8 }} source={require('../../assets/image/like.png')} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  _onPressLikeForComment(commentId, item.isAgreed === 0 ? 1 : 0);
                  this.fetchCommentListData();
                }}
              >
                <Image
                  style={{ marginRight: 8 }}
                  source={require('../../assets/image/like_highlight.png')}
                />
              </TouchableOpacity>
            )}
            <Text style={{ width: 40, fontSize: 12, color: '#252525' }}>
              {item.agreeNum !== 0 ? item.agreeNum : ''}
            </Text>
            <TouchableOpacity onPress={() => this._showPopOver(item, 2)}>
              <Ionicons name={'ios-more'} size={18} color={'#818181'} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  onEndReachedAction = () => {
    this._fetchCommentMoreData();
  };

  _sendReply = () => {
    const { loginInfo, locationInfo, fetchNearByDetail, sjid } = this.props;
    const { replyText, replyID } = this.state;
    console.log(replyID);
    let auid = '';
    let M2 = '';
    if (loginInfo !== undefined) {
      auid = loginInfo.auid;
      M2 = loginInfo.loginToken;
    }
    const M3 = locationInfo.coordsStr;
    const M8 = md5.hex_md5(auid + new Date().getTime());
    const M9 = new Date().getTime();
    apiComment({
      sjid,
      content: replyText,
      replyID,
      auid: auid === undefined ? '' : auid,
      M0: Platform.OS === 'ios' ? 'IMMC' : 'MMC',
      M2,
      M3,
      M8,
      M9,
    })
      .then(res => {
        if (res.data.code === 1) {
          toast.success('发表评论成功');
          this.myTextInput.blur();
          this.setState({ replyText: '', commentPage: 1, replyID: '' });
          this.fetchCommentListData();
        } else {
          toast.fail('发表评论失败');
        }
      })
      .catch(err => {
        toast.fail('发表评论失败');
      });
  };
  _renderOperationBar = () => {
    const { replyText } = this.state;
    return (
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          width: styleUtil.window.width,
          paddingBottom: styleUtil.window.height * 0.01,
          paddingTop: styleUtil.window.height * 0.01,
          backgroundColor: 'white',
          zIndex: 99999999,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          borderTopColor: '#F7F7F7',
          borderTopWidth: 1,
        }}
      >
        <TextInput
          style={{
            borderRadius: 18,
            backgroundColor: '#F5F5F5',
            marginLeft: 10,
            width: styleUtil.window.width * 0.8,
            fontSize: 17,
            paddingLeft: 10,
          }}
          multiline
          ref={ref => {
            this.myTextInput = ref;
          }}
          value={replyText}
          onChangeText={text => this.setState({ replyText: text })}
          placeholder="写回复"
        />
        <Button type="link" size="sm" onPress={() => this._sendReply()}>
          <Label
            style={{
              color: replyText.length > 0 ? styleUtil.themeColor : 'grey',
              fontSize: 17,
            }}
            text="发布"
          />
        </Button>
      </View>
    );
  };

  _showPopOver = (data, type) => {
    let items = [];
    if (type === 2) {
      items = [
        {
          title: '回复',
          onPress: () => {
            this.setState({
              replyID: data.dataid,
            });
            this.myTextInput.focus();
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
    const cancelItem = { title: '取消' };
    this.setState({ isInPopUpView: true }, () => ActionSheet.show(items, cancelItem));
  };

  renderPage() {
    const {
      auid,
      dataid,
      commentList,
      fetchCommentListPengding,
      fetchCommentListError,
      sjid,
      _onPressLikeForComment,
    } = this.props;
    let page = this.state.commentPage;
    if (fetchCommentListPengding) {
      return <ActivityIndicator />;
    }
    const data = commentList.byId[dataid];
    commentId = data.dataid;
    let searchTerm = `search_${sjid}_${dataid}`;
    let list = [];
    const allPages = commentList[searchTerm];
    const byId = commentList.byId;
    if (allPages !== undefined) {
      for (i = 1; i <= page; i++) {
        if (allPages[i] && allPages[i].items) {
          allPages[i].items.forEach(item => {
            let data = byId[item];
            list.push(data);
          });
        }
      }
    }
    initialNum = this.state.commentPageSize;
    return (
      <View
        style={{
          paddingHorizontal: 15,
          paddingTop: 10,
          backgroundColor: 'white',
          flex: 1,
        }}
      >
        <View style={{ flexDirection: 'row' }}>
          <Avatar large rounded source={{ uri: data.userFace.replace(/cs.png/g, '.png') }} />
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
                  _onPressLikeForComment(commentId, data.isAgreed === 0 ? 1 : 0);
                  this.fetchCommentListData();
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
              <Text style={{ width: 40, fontSize: 12, color: '#252525' }}>
                {data.agreeNum !== 0 ? data.agreeNum : ''}
              </Text>

              <TouchableOpacity onPress={() => this._showPopOver(data, 2)}>
                <Ionicons name={'ios-more'} size={18} color={'#818181'} />
              </TouchableOpacity>
            </View>
            <FlatList
              style={{
                paddingLeft: 8,
                paddingVertical: 8,
                backgroundColor: '#f8f8f8',
                borderRadius: 0,
                marginTop: 10,
              }}
              // contentInset={{ bottom: 60 }}
              extraData={this.state}
              data={list}
              renderItem={this.renderItem}
              initialNumToRender={initialNum}
              keyExtractor={(item, index) => index.toString()}
              onEndReached={this.onEndReachedAction}
              onEndReachedThreshold={0.3}
              // ListFooterComponent={this._renderFooter}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 120 }}
              // onViewableItemsChanged={this._onViewableItemsChanged}
            />
          </View>
        </View>
        {this._renderOperationBar()}
      </View>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const {
    locationInfo,
    loginInfo,
    fetchCommentListPengding,
    fetchCommentListError,
    commentList,
  } = state;
  return {
    locationInfo,
    loginInfo,
    fetchCommentListPengding,
    fetchCommentListError,
    commentList,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  const { fetchCommentList } = bindActionCreators({ ...actions }, dispatch);
  return {
    fetchCommentList,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NearbyChildrenReply);
