import React from 'react';
import { View, ART, Image, TextInput, StyleSheet, Icon, Dimensions } from 'react-native';

import ScrollableTabView from 'react-native-scrollable-tab-view';
import NavBar from '../../components/NavBar';
import styleUtil from '../../common/styleUtil';
import TabBar from '../../components/tabbar/TabBar';
import NearbyList from './NearbyList';

const { Surface, Shape, Path, Group } = ART;
const WIDTH = Dimensions.get('window').width;

export default class Nearby extends React.Component {
  constructor(props) {
    super(props);

    let tabs = [
      { name: '所有', uri: 'all', sjType: '' },
      { name: '话题', uri: 'topic', sjType: '200004' },
      { name: '一起', uri: 'activity', sjType: '200001' },
      { name: '二手', uri: 'trade', sjType: '200002' },
      { name: '时刻', uri: 'moment', sjType: '200003' },
    ];
    this.state = { tabs: tabs, activeIndex: 0, fromIndex: 0, keyword: '' };
  }

  onChangeTab = ({ i, ref, from }) => {
    if (this.state.activeIndex !== i) {
      this.setState({
        ...this.state,
        activeIndex: i,
        fromIndex: from,
        keyword: '',
      });
    }
  };

  renderNavBar = props => {
    return (
      <NavBar
        renderTitleView={
          <TabBar
            backgroundColor={null}
            activeTextColor={styleUtil.activeTextColor}
            fromIndex={this.state.fromIndex}
            inactiveTextColor={styleUtil.inactiveTextColor}
            underlineStyle={styleUtil.underlineStyle}
            tabContainerWidth={300}
            style={{
              width: 300,
              paddingTop: 10,
              borderBottomWidth: 0,
            }}
            {...props}
            tabs={this.state.tabs}
          />
        }
        leftHidden={this.props.leftHidden}
        rightHidden={this.props.rightHidden}
      />
    );
  };

  render() {
    return (
      <ScrollableTabView
        tabBarPosition={'top'}
        renderTabBar={this.renderNavBar}
        onChangeTab={this.onChangeTab}
        initialPage={0}
      >
        {this.state.tabs.map((v, i) => (
          <NearbyList
            // {...this.props}
            tabLabel={v.name}
            sjType={v.sjType}
            keyword={this.state.keyword}
            // uri={v.uri}
            activeIndex={this.state.activeIndex}
            leftHidden={this.props.leftHidden}
            coordsStr={this.props.coordsStr}
          />
        ))}
      </ScrollableTabView>
    );
  }
}
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
