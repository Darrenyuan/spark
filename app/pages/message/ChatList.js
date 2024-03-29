import React, { Component } from 'react';
import {
  FlatList,
  DeviceEventEmitter,
  AppState,
  View,
  Text,
  TouchableWithoutFeedback,
  Vibration,
  Image,
} from 'react-native';

import 'prop-types';
import styleUtil from '../../common/styleUtil';

import ChatListRow from './ChatListRow';
import config from '../../common/config';
import TabNavBar, { MessageBadge } from '../../screens/TabNavBar';
import navigate from '../../screens/navigate';
import Chat from './Chat';
import { ActionPopover, ListRow, Badge, NavigationBar } from 'teaset';
import SystemNoticeIndex from './SystemNoticeIndex';
import utils from '../../common/utils';
import NavigatorPage from '../../components/NavigatorPage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NearbyDetail from '../nearby/NearbyDetail';
import FriendList from './FriendList';
import Notification from '../notification/Notification';

let gInstance;

export default class ChatList extends NavigatorPage {
  static defaultProps = {
    ...NavigatorPage.navigatorStyle,
    navBarHidden: false,
    navigationBarInsets: true,
    showBackButton: true,
    title: '消息',
    leftView: (
      <NavigationBar.Button onPress={() => gInstance._onClickNotifications()}>
        <Ionicons name={'ios-notifications-outline'} color={'#666666'} size={25} />
      </NavigationBar.Button>
    ),
    rightView: (
      <NavigationBar.Button onPress={() => gInstance._onClickContact()}>
        <AntDesign name={'contacts'} color={'#666666'} size={22} />
      </NavigationBar.Button>
    ),
  };

  static onReceive = val => {
    DeviceEventEmitter.emit('onReceive', val);
  };
  static updateList = val => {
    DeviceEventEmitter.emit('updateList', val);
  };
  static listenerChatMsg = () => {
    DeviceEventEmitter.emit('listenerChatMsg');
  };

  constructor(props) {
    super(props);
    this.state = {
      list: [],
      noticeCount: 0,
      // list: Array(20).fill('').((_, i) => `item #${i}`),
    };
    this._isMounted = false;
    this.chatList = [];
    this.fromUser = {
      _id: config.user._id,
      username: config.user.username,
      avatar: config.user.avatar,
    };
    this.onReceive = this.onReceive.bind(this);
    this.updateList = this.updateList.bind(this);

    gInstance = this;
  }

  componentDidMount() {
    // config.removeUser()
    // config.removeAllChatList()
    AppState.addEventListener('change', this.handleAppStateChange);
    this._isMounted = true;
    DeviceEventEmitter.addListener('updateList', v => this.updateList(v));
    DeviceEventEmitter.addListener('onReceive', v => this.onReceive(v));
    DeviceEventEmitter.addListener('listenerChatMsg', this.listenerChatMsg);
    this._getChatList();
    config.getSystemNotice().then(list => {
      this.setState({ noticeCount: list.length });
    });
    this.listenerChatMsg();
    this.listenerSystemNotice();
  }

  componentWillUnmount() {
    this._isMounted = false;
    DeviceEventEmitter.removeAllListeners('updateList');
    DeviceEventEmitter.removeAllListeners('onReceive');
    DeviceEventEmitter.removeAllListeners('listenerChatMsg');
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  _onClickContact = () => {
    navigate.pushNotNavBar(FriendList);
  };

  _onClickNotifications = () => {
    navigate.pushNotNavBar(Notification);
  };

  handleAppStateChange = nextAppState => {
    if (!nextAppState.match(/inactive|background|active/)) {
      return;
    }
    // console.warn(nextAppState)
    if (nextAppState === 'active') {
      this.listenerChatMsg();
      this.listenerSystemNotice();
    } else if (nextAppState.match(/inactive|background/)) {
      // iMessage.closeWebSocket(true);
    }
  };

  updateList(list, callback) {
    if (this._isMounted) {
      this.setState(
        {
          list,
        },
        _ => callback && callback(),
      );
    }
  }

  listenerSystemNotice = () => {
    config.getSystemNotice().then(list => {
      this.setState({ noticeCount: list.length });
    });
    //获取系统通知消息
    imessage.onSystemMsgReceive(res => {
      if (res.code !== 0) return;
      config.saveSystemNotice(res.data).then(list => {
        // console.warn(MessageBadge + list.length)
        if (this._isMounted) {
          this.setState({ noticeCount: list.length });
        }
      });
    });
  };

  _getChatList = () => {
    config.getChatList().then(list => {
      if (list) {
        this.setState({
          list: list,
        });
        this._generateChatList(list);
      }
    });
  };

  listenerChatMsg = () => {
    imessage.onReceiveMsg(data => this.onReceive(data));
  };

  onReceive(res) {
    // console.warn(JSON.stringify(data))
    if (res.code !== 0) return;
    let isMuted = false;
    let msg = res.data;
    if (!Array.isArray(msg)) {
      msg = [msg];
    }
    msg.forEach((v, i) => {
      if (v.isMuted && v.mutedUserId === config.user._id) {
        isMuted = true;
      } else if (!v.isMuted && v.mutedUserId === config.user._id) {
        isMuted = false; //如果发现没有静音，直接终止
        return true;
      }
    });
    if (!isMuted && config.user.vibration) {
      Vibration.vibrate();
    }
    config.saveConversation(msg).then(list => {
      let unreadMsg = 0;
      list.forEach((v, i) => {
        unreadMsg += v.unreadMsg;
      });
      // let count = MessageBadge + unreadMsg;
      TabNavBar.updateMessageBadge(unreadMsg);
      if (this._isMounted) {
        let tabs = this.props.tabs;
        tabs[0].badgeCount = MessageBadge;
        this.props.updateTabs(tabs);
        //更新聊天列表list
        this.updateList(list);
        // if (data.toUserId !== config.user._id) {
        // 	//如果接受的用户id不是自己，那么不显示
        // 	return
        // }
      }
    });
  }

  deleteRow = (item, index) => {
    config.getUnreadCount(item.toId).then(count => {
      config.resetUnreadCount(item.toId).then(list => {
        this.updateList(list);
      });
      // console.warn(count)
      if (count > 0) {
        let tabs = this.props.tabs;
        tabs[0].badgeCount = MessageBadge - count;
        this.props.updateTabs(tabs);
        TabNavBar.updateMessageBadge(MessageBadge - count);
      }
    });
    const newData = [...this.state.list];
    newData.splice(index, 1);
    this.setState({
      list: newData,
    });
    config.removeChatListWithToId(item.toId);
  };

  _showPopover = (pressView, item, index) => {
    pressView.measure((ox, oy, width, height, px, py) => {
      let items = [
        {
          title: '标记已读',
          onPress: () => {
            config.getUnreadCount(item.toId).then(count => {
              config.resetUnreadCount(item.toId).then(list => {
                ChatList.updateList(list);
              });
              if (count > 0) {
                let tabs = this.props.tabs;
                tabs[0].badgeCount = MessageBadge - count;
                this.props.updateTabs(tabs);
                TabNavBar.updateMessageBadge(MessageBadge - count);
              }
            });
          },
        },
        {
          title: '标记未读',
          onPress: () => {
            config.setUnreadCount(item.toId, 1).then(list => {
              ChatList.updateList(list);
            });
            if (this.state.list[index].unreadMsg <= 0) {
              let tabs = this.props.tabs;
              tabs[0].badgeCount = MessageBadge + 1;
              this.props.updateTabs(tabs);
              TabNavBar.updateMessageBadge(MessageBadge + 1);
            }
          },
        },
        {
          title: '删除',
          onPress: () => {
            this.deleteRow(item, index);
          },
        },
      ];
      ActionPopover.show(
        {
          x: px,
          y: py,
          width,
          height,
        },
        items,
      );
    });
  };

  pushChat = item => {
    config.resetUnreadCount(item.toId).then(list => {
      let unreadMsg = 0;
      list.forEach(v => {
        unreadMsg += v.unreadMsg;
      });
      let tabs = this.props.tabs;
      if (tabs) {
        tabs[0].badgeCount = unreadMsg;
        this.props.updateTabs(tabs);
        TabNavBar.updateMessageBadge(unreadMsg);
      }
      ChatList.updateList(list);
      config.getConversationWithKey(item.toId).then(map => {
        let list = [];
        Object.keys(map).forEach(key => {
          list.push(map[key]);
        });
        utils.formatData(list);
        let total = list.length;
        list = list.slice(0, config.pageSize);
        let canLoadMore = list.length >= config.pageSize;
        navigate.pushNotNavBar(Chat, {
          ...this.props,
          item,
          messages: list,
          total,
          canLoadMore,
        });
      });
    });
  };

  _renderItem = ({ item, separators, index }) => {
    return (
      <ChatListRow
        {...this.props}
        item={item}
        index={index}
        list={this.state.list}
        onPress={_ => this.pushChat(item)}
        onLongPress={this._showPopover}
        isViewable={item.isViewable}
      />
    );
  };

  setIsSearch = isSearch => {
    this.setState({
      isSearch,
    });
  };

  _generateChatList = list => {
    for (let key in list) {
      this.chatList = this.chatList.concat(list[key]);
    }
  };

  _onViewableItemsChanged = ({ viewableItems, changed }) => {
    // console.log(viewableItems,changed);
    let list = [...this.state.list];
    viewableItems.forEach((v, i) => {
      if (list[v.index].msgId === v.item.msgId) {
        list[v.index].isViewable = v.isViewable;
      }
    });
    this.setState({ list });
  };

  renderHeader = () => {
    return <View />;
  };

  renderPage() {
    return (
      <View style={styleUtil.container}>
        <FlatList
          data={this.state.list}
          extraData={this.state}
          renderItem={this._renderItem}
          initialNumToRender={50}
          keyExtractor={(item, index) => index.toString()}
          // ListEmptyComponent={<Loading/>}
          ListHeaderComponent={this.renderHeader}
          // onEndReached={this._fetchMoreData}
          onViewableItemsChanged={this._onViewableItemsChanged}
          onEndReachedThreshold={0.3}
          // keyboardDismissMode={'on-drag'}
        />
      </View>
    );
  }
}

// const styles = StyleSheet.create({
//
// });
