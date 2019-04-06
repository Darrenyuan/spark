import React from "react";

import {
  StyleSheet,
  Text,
  View,
  FlatList,
  DeviceEventEmitter,
  TouchableOpacity
} from "react-native";
import styleUtil from "../../common/styleUtil";
// import LoadingMore from "../components/load/LoadingMore";
import NavigatorPage from "../../components/NavigatorPage";
import NearbyItem from "./NearbyItem";
import config from "../../common/config";
import LoadingMore from "../../components/load/LoadingMore";

export default class NearbyList extends NavigatorPage {
  static defaultProps = {
    ...NavigatorPage.navigatorStyle,
    navBarHidden: true,
    navigationBarInsets: false
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
    super(props);
    this.page = 1;
    this.total = 1;
    Object.assign(this.state, {
      user: props.user,
      list: [
        { name: "haha" },
        { name: "haha" },
        { name: "haha" },
        { name: "haha" }
      ],
      another: false,
      isLoading: false, //上拉加载
      isRefreshing: false //下拉刷新
    });
    this._isMounted = false;
  }

  componentDidMount() {
    // config.removeUser()
    this._isMounted = true;
  }

  componentWillUnmount() {}

  _hasMore = () => {
    return this.state.list.length < this.total && this.total > 0;
  };

  _fetchMoreData = () => {
    if (this._hasMore() && !this.state.isLoading) {
    }
  };

  _renderFooter = () => {
    return <LoadingMore hasMore={this._hasMore()} />;
  };

  _renderRows = ({ item, separators, index }) => {
    // return (<View style={{width:100, height:40, backgroundColor:'red'}} />);
    return (
      <NearbyItem
        item={item}
        another={this.state.another}
        // removeTopic={this.removeTopic}
        // deleteRow={this.deleteRow}
        // profileUser={this.props.profileUser}
        // isViewable={item.isViewable}
      />
    );
  };

  renderPage() {
    return (
      <View style={styleUtil.container}>
        <FlatList
          extraData={this.state}
          data={this.state.list}
          renderItem={this._renderRows}
          initialNumToRender={config.pageSize}
          keyExtractor={(item, index) => index.toString()}
          onEndReached={this._fetchMoreData}
          onEndReachedThreshold={0.3}
          onRefresh={this._fetchDataWithRefreshing}
          refreshing={this.state.isRefreshing}
          ListHeaderComponent={this._renderHeader}
          ListFooterComponent={this._renderFooter}
          showsVerticalScrollIndicator={false}
          // onViewableItemsChanged={this._onViewableItemsChanged}
        />
      </View>
    );
  }
}
