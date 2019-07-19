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
import _ from 'lodash';
const WIDTH = Dimensions.get('window').width;

class NearbyList extends NavigatorPage {
  static defaultProps = {
    ...NavigatorPage.navigatorStyle,
    navBarHidden: true,
    navigationBarInsets: false,
  };
  constructor(props) {
    super(props);
    const { sjType, keyword, nearBys } = this.props;
    this.state = {
      user: props.user,
      another: false,
      isLoading: false, //上拉加载
      isRefreshing: false, //下拉刷新
      collectFlag: '0',
      sjType: sjType,
      page: 1,
      pageSize: 10,
      keyword: keyword,
      prevSearchText: '',
    };
  }

  filter = (byId, keyword, sjType) => {
    if (keyword === '' || keyword === undefined) {
      if (sjType === '' || sjType === undefined) {
        return byId;
      } else {
        return _.pickBy(byId, (item, key) => {
          return item.sjType === sjType;
        });
      }
    } else {
      if (sjType === '' || sjType === undefined) {
        return _.pickBy(byId, (item, key) => {
          return item.title.includes(keyword);
        });
      } else {
        return _.pickBy(byId, (item, key) => {
          return item.sjType === sjType && item.title.includes(keyword);
        });
      }
    }
  };
  componentDidMount() {
    // config.removeUser()
    this.fetchData();
  }

  componentWillUnmount() {}

  fetchData = () => {
    const { loginInfo, locationInfo, sjType, fetchContentList } = this.props;
    const { collectFlag, keyword, page, pageSize } = this.state;
    let auid = '';
    let M2 = '';
    if (loginInfo !== undefined) {
      auid = loginInfo.auid;
      M2 = loginInfo.loginToken;
    }
    let M3 = locationInfo.coordsStr;
    let M8 = md5.hex_md5(auid + new Date().getTime());
    let M9 = new Date().getTime();
    let searchTerm = this.getSearchTerm();
    fetchContentList({
      sjType: sjType,
      collectFlag: collectFlag,
      keyword: keyword,
      auid: auid === undefined ? '' : auid,
      M0: Platform.OS === 'ios' ? 'IMMC' : 'MMC',
      M2: M2,
      M3: M3, //this.props.coordsStr,
      M8: M8,
      M9: M9,
      page: page,
      pageSize: pageSize,
      searchTerm: searchTerm,
    });
  };
  _hasMore = () => {
    const { page, pageSize } = this.state;
    const { nearBys } = this.props;
    let currentTotal = page * pageSize;
    let searchTerm = this.getSearchTerm();
    let totalCount = 0;
    if (nearBys[searchTerm] !== undefined) {
      totalCount = nearBys[searchTerm].totalCount;
    }
    return currentTotal < totalCount;
  };

  _fetchMoreData = () => {
    console.log('____fetchMoreData');
    if (this._hasMore()) {
      let page = this.state.page + 1;
      this.setState({ page: page }, this.fetchData);
    }
  };
  onRefresh = () => {
    this.setState({ page: 1 }, this.fetchData);
  };
  _renderFooter = () => {
    return <LoadingMore hasMore={this._hasMore()} />;
  };

  _renderRows = ({ item, separators, index }) => {
    const byId = this.props.nearBys.byId;
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

  handleSearch = text => {
    if (this.state.prevSearchText !== text) {
      this.setState({ prevSearchText: text, page: 1 }, this.fetchData);
    } else {
      this.setState({ prevSearchText: text }, this.fetchData);
    }
  };
  getSearchTerm = () => {
    const { sjType, keyword, pageSize } = this.state;
    let searchTerm = `search_${keyword}_${sjType}_${pageSize}`;
    return searchTerm;
  };
  renderSearchBar = () => {
    return (
      <SearchInput
        placeholder="搜索"
        style={styleUtil.searchInput}
        onChangeText={text => this.setState({ keyword: text })}
        onBlur={this.handleSearch}
        value={this.state.keyword}
      />
    );
  };

  render() {
    const { fetchContentListPending, nearBys } = this.props;
    const { sjType, keyword, page, pageSize } = this.state;
    const { byId } = nearBys;
    const searchTerm = this.getSearchTerm();
    const allPages = nearBys[searchTerm];
    console.log(allPages);
    console.log(nearBys);
    console.log(searchTerm);
    let items = [];
    if (allPages !== undefined) {
      for (i = 1; i <= page; i++) {
        if (allPages[i] && allPages[i].items) {
          allPages[i].items.forEach(item => {
            items.push(item);
          });
        }
      }
    }
    if (fetchContentListPending) {
      //Loading View while data is loading
      return (
        <View style={{ flex: 1, paddingTop: 20 }}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <View style={styleUtil.container}>
        <FlatList
          // extraData={this.state}
          data={items}
          renderItem={this._renderRows}
          // initialNumToRender={config.pageSize}
          // keyExtractor={(item, index) => index.toString()}
          onEndReached={this._fetchMoreData}
          onEndReachedThreshold={0.2}
          onRefresh={this.onRefresh}
          refreshing={fetchContentListPending}
          ListHeaderComponent={this.renderSearchBar}
          ListFooterComponent={this._renderFooter}
          showsVerticalScrollIndicator={false}
          // onViewableItemsChanged={this._onViewableItemsChanged}
        />
      </View>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { contentList, locationInfo, loginInfo, fetchContentListPending } = state;
  return {
    locationInfo,
    loginInfo,
    fetchContentListPending,
    nearBys: contentList,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    fetchContentList: bindActionCreators({ ...actions }, dispatch).fetchContentList,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NearbyList);
