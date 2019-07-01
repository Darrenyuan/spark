import React from 'react';

import {
  StyleSheet,
  Text,
  View,
  FlatList,
  DeviceEventEmitter,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import styleUtil from '../../common/styleUtil';
// import LoadingMore from "../components/load/LoadingMore";
import NavigatorPage from '../../components/NavigatorPage';
import NearbyItem from './NearbyItem';
import config from '../../common/config';
import LoadingMore from '../../components/load/LoadingMore';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../services/redux/actions';
import md5 from 'react-native-md5';
import { SearchInput } from 'teaset';
const WIDTH = Dimensions.get('window').width;

class NearbyList extends NavigatorPage {
  static defaultProps = {
    ...NavigatorPage.navigatorStyle,
    navBarHidden: true,
    navigationBarInsets: false,
  };
  constructor(props) {
    super(props);
    this.page = 1;
    this.total = 1;
    this.state = {
      user: props.user,
      list: [{ name: 'haha' }, { name: 'haha' }, { name: 'haha' }, { name: 'haha' }],
      another: false,
      isLoading: false, //上拉加载
      isRefreshing: false, //下拉刷新
      collectFlag: '1',
      keyword: this.props.keyword,
      sjType: this.props.sjType,
      page: 1,
      pageSize: 5,
    };
    this._isMounted = false;
  }

  componentDidMount() {
    // config.removeUser()
    this.fetchData();
    this._isMounted = true;
  }
  // componentDidUpdate(prevProps, prevState) {
  //   if (this.props.sjType != prevProps.sjType || this.props.keyword != prevProps.keyword) {
  //     this.setState({ sjType: this.props.sjType, keyword: this.props.keyword });
  //   }
  // }

  componentWillUnmount() {}

  fetchData = () => {
    const { loginInfo } = this.props.spark;
    let auid = loginInfo.auid;
    let M2 = loginInfo.loginToken;
    let M3 = this.props.spark.locationInfo.coordsStr;
    let M8 = md5.hex_md5(auid + new Date().getTime());
    let M9 = new Date().getTime();
    this.props.actions.fetchContentList({
      sjType: this.props.sjType,
      collectFlag: this.state.collectFlag,
      keyword: this.state.keyword,
      auid: auid,
      M0: Platform.OS === 'ios' ? 'IMMC' : 'MMC',
      M2: M2,
      M3: '114.429636,30.504164', //this.props.coordsStr,
      M8: M8,
      M9: M9,
      page: this.state.page,
      pageSize: this.state.pageSize,
    });
  };
  _hasMore = () => {
    // const { page, pageSize } = this.state;
    // let currentTotal = page * pageSize;
    // let keyword = '';
    // if (this.state.keyword === '') {
    //   keyword = 'default';
    // } else {
    //   keyword = this.state.keyword;
    // }
    // let total = this.props.spark.contentList[keyword].total;
    // if (currentTotal < total) {
    //   return true;
    // }
    return false;
  };

  _fetchMoreData = () => {
    let page = this.state.page + 1;
    this.setState(this.setState({ page: page }));
  };

  _renderFooter = () => {
    return <LoadingMore hasMore={this._hasMore()} />;
  };

  _renderRows = ({ item, separators, index }) => {
    const { byId } = this.getById();
    // return (<View style={{width:100, height:40, backgroundColor:'red'}} />);
    return (
      <NearbyItem
        item={item}
        another={this.state.another}
        first={!index}
        byId={byId}
        key={item}
        // removeTopic={this.removeTopic}
        // deleteRow={this.deleteRow}
        // profileUser={this.props.profileUser}
        // isViewable={item.isViewable}
      />
    );
  };
  getById = () => {
    const contentList = this.props.spark.contentList;
    // console.log('contentList:', JSON.stringify(contentList));
    let { keyword } = this.state;
    if (keyword === undefined || keyword === '') {
      keyword = 'default';
    }
    return contentList[keyword];
  };

  render() {
    if (this.props.spark.fetchContentListPending) {
      //Loading View while data is loading
      return (
        <View style={{ flex: 1, paddingTop: 20 }}>
          <ActivityIndicator />
        </View>
      );
    }
    const { byId } = this.getById();
    const items = Object.keys(byId);
    return (
      <View style={styleUtil.container}>
        <SearchInput
          placeholder="搜索"
          style={styles.searchInput}
          onChangeText={text => this.setState({ keyword: text })}
          // onBlur={() => {
          //   console.log('onblur entered');
          //   this.fetchData;
          // }}
        />
        <FlatList
          extraData={this.state}
          data={items}
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
)(NearbyList);
const styles = StyleSheet.create({
  searchInput: {
    borderWidth: 0,
    width: WIDTH * 0.8,
    backgroundColor: '#F6F6F6',
    alignSelf: 'center',
    marginTop: 15,
    borderRadius: 10,
  },
});
