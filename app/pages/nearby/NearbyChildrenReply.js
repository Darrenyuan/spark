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
    this.state = {
      commentPage: 1,
      commentPageSize: 10,
      replyText: 0,
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
      _showPopOver,
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
    let rowData = item;
    const { _onPressLikeForComment, _showPopOver } = this.props;
    let commentId = rowData.dataid;
    return (
      <View style={{ flexDirection: 'row' }}>
        <Avatar large rounded source={{ uri: rowData.userFace.replace(/cs.png/g, '.png') }} />
        <View
          style={{
            marginLeft: 10,
            paddingBottom: 10,
            flex: 1,
          }}
        >
          <Text style={{ marginTop: 10, color: '#252525', fontSize: 14 }}>{rowData.content}</Text>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 15,
              alignItems: 'center',
            }}
          >
            {rowData.isOwner === 1 && (
              <Image style={{ marginRight: 8 }} source={require('../../assets/image/host.png')} />
            )}
            <Text style={{ flex: 1, color: '#C1C1C1', fontSize: 12 }}>
              {rowData.actionTimeDesc}
            </Text>
            {rowData.isAgreed === 0 ? (
              <TouchableOpacity
                onPress={() => {
                  _onPressLikeForComment(commentId, rowData.isAgreed === 0 ? 1 : 0),
                    this.fetchCommentListData();
                }}
              >
                <Image style={{ marginRight: 8 }} source={require('../../assets/image/like.png')} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  _onPressLikeForComment(commentId, rowData.isAgreed === 0 ? 1 : 0);
                  this.fetchCommentListData();
                }}
              >
                <Image
                  style={{ marginRight: 8 }}
                  source={require('../../assets/image/like_highlight.png')}
                />
              </TouchableOpacity>
            )}
            <Text style={{ width: 40, fontSize: 12, color: '#252525' }}>{rowData.agreeNum}</Text>
            <TouchableOpacity onPress={() => _showPopOver(rowData, 2, this.fetchCommentListData)}>
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

  renderPage() {
    const {
      auid,
      dataid,
      commentList,
      fetchCommentListPengding,
      fetchCommentListError,
      sjid,
      _onPressLikeForComment,
      _showPopOver,
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
              <Text style={{ width: 40, fontSize: 12, color: '#252525' }}>{data.agreeNum}</Text>

              <TouchableOpacity
                onPress={() => _showPopOver(data, 2, this.fetchCommentListData)}
                // ref={c => (this.replyRef[commentId] = c)}
              >
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
              contentInset={{ bottom: 60 }}
              extraData={this.state}
              data={list}
              renderItem={this.renderItem}
              initialNumToRender={initialNum}
              keyExtractor={(item, index) => index.toString()}
              onEndReached={this.onEndReachedAction}
              onEndReachedThreshold={0.3}
              // ListFooterComponent={this._renderFooter}
              showsVerticalScrollIndicator={false}
              // contentContainerStyle={{ paddingBottom: 80 }}
              // onViewableItemsChanged={this._onViewableItemsChanged}
            />
          </View>
        </View>
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
