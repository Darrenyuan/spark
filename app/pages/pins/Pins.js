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
import NavigatorPage from '../../components/NavigatorPage';
import NearbyItem from '../nearby/NearbyItem';
import config from '../../common/config';
import LoadingMore from '../../components/load/LoadingMore';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../services/redux/actions';
import md5 from 'react-native-md5';
import _ from 'lodash';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { NavigationBar, SearchInput, ActionSheet } from 'teaset';

class Pins extends NavigatorPage {
  static defaultProps = {
    ...NavigatorPage.navigatorStyle,
    navigationBarInsets: false,
    navBarHidden: false,
    statusBarStyle: 'default',
  };
  constructor(props) {
    super(props);
    this.state = {
      user: props.user,
      another: false,
      isLoading: false, //上拉加载
      isRefreshing: false, //下拉刷新
      collectFlag: '1',
      sjType: '',
      displaySjType: '所有',
      page: 1,
      pageSize: 10,
      keyword: '',
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
    this.fetchData();
  }

  componentWillUnmount() {}

  fetchData = () => {
    const { loginInfo, locationInfo, fetchContentList } = this.props;
    const { collectFlag, keyword, page, pageSize, sjType } = this.state;
    let auid = '';
    let M2 = '';
    if (loginInfo !== undefined) {
      auid = loginInfo.auid;
      M2 = loginInfo.loginToken;
    }
    let M3 = locationInfo.coordsStr;
    let M8 = md5.hex_md5(auid + new Date().getTime());
    let M9 = new Date().getTime();
    console.log('fetchData In near by list:M2:', M2, ':auid:', auid);
    let searchTerm = this.getSearchTerm();
    fetchContentList({
      sjType: sjType,
      userAuid: auid,
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

  _renderFooter = () => {
    return <LoadingMore hasMore={this._hasMore()} />;
  };
  onRefresh = () => {
    this.setState({ page: 1 }, this.fetchData);
  };
  _renderRows = ({ item, separators, index }) => {
    const byId = this.props.nearBys.byId;
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
    let searchTerm = `pin_search_${keyword}_${sjType}_${pageSize}`;
    return searchTerm;
  };

  _showPopOver = () => {
    let items = [
      {
        title: '所有 ',
        onPress: () => this.setState({ sjType: '', displaySjType: '所有' }, this.fetchData),
      },
      {
        title: '话题',
        onPress: () => this.setState({ sjType: '200004', displaySjType: '话题' }, this.fetchData),
      },
      {
        title: '一起',
        onPress: () => this.setState({ sjType: '200001', displaySjType: '一起' }, this.fetchData),
      },
      {
        title: '二手',
        onPress: () => this.setState({ sjType: '200002', displaySjType: '二手' }, this.fetchData),
      },
      {
        title: '时刻',
        onPress: () => this.setState({ sjType: '200003', displaySjType: '时刻' }, this.fetchData),
      },
    ];
    let cancelItem = { title: '取消' };
    ActionSheet.show(items, cancelItem);
  };
  renderNavigationLeftView() {
    const { displaySjType } = this.state;
    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <NavigationBar.Button onPress={() => this._showPopOver()}>
          <Text>{displaySjType}</Text>
          <AntDesign name={'down'} color={'#666666'} size={styleUtil.fontSize} />
        </NavigationBar.Button>
      </View>
    );
  }
  renderNavigationRightView() {
    return (
      <View>
        <NavigationBar.Button>
          <SearchInput
            placeholder="搜索"
            style={{
              ...styleUtil.searchInput,
              width: styleUtil.window.width * 0.5,
              marginTop: 0,
            }}
            onChangeText={text => this.setState({ keyword: text })}
            onBlur={this.handleSearch}
            value={this.state.keyword}
          />
        </NavigationBar.Button>
      </View>
    );
  }

  renderPage() {
    const { fetchContentListPending, nearBys } = this.props;
    const { sjType, keyword, page, pageSize } = this.state;
    const { byId } = nearBys;
    const searchTerm = this.getSearchTerm();
    const allPages = nearBys[searchTerm];
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
      <View>
        <FlatList
          // extraData={this.state}
          data={items}
          renderItem={this._renderRows}
          // initialNumToRender={config.pageSize}
          // keyExtractor={(item, index) => index.toString()}
          onEndReached={this._fetchMoreData}
          onEndReachedThreshold={0.2}
          onRefresh={this.onRefresh}
          refreshing={this.props.fetchContentListPending}
          // ListHeaderComponent={this._renderHeader}
          ListFooterComponent={this._renderFooter}
          showsVerticalScrollIndicator={true}
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
)(Pins);
