import React from "react";
import { View, ART, Image } from "react-native";
import ScrollableTabView from "react-native-scrollable-tab-view";
import NavBar from "../../components/NavBar";
import styleUtil from "../../common/styleUtil";
import TabBar from "../../components/tabbar/TabBar";
import NearbyList from "./NearbyList";
import { Text } from "react-native-elements";

const { Surface, Shape, Path, Group } = ART;

export default class Nearby extends React.Component {
  constructor(props) {
    super(props);

    let tabs = [
      { name: "所有", uri: "xxx" },
      { name: "话题", uri: "xxx" },
      { name: "一起", uri: "xxx" },
      { name: "二手", uri: "xxx" },
      { name: "时刻", uri: "xxx" }
    ];
    this.state = { tabs, activeIndex: 0, fromIndex: 0 };
  }

  onChangeTab = ({ i, ref, from }) => {
    if (this.state.activeIndex !== i) {
      this.setState({
        activeIndex: i,
        fromIndex: from
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
              borderBottomWidth: 0
            }}
            {...props}
            tabs={this.state.tabs}
          />
        }
        leftHidden={this.props.leftHidden}
        renderLeftView={this.props.renderLeftView}
        renderRightView={this.props.renderRightView}
      />
    );
  };

  render() {
    return (
      <ScrollableTabView
        tabBarPosition={"top"}
        renderTabBar={this.renderNavBar}
        onChangeTab={this.onChangeTab}
        initialPage={0}
      >
        {this.state.tabs.map((v, i) => (
          <NearbyList
            key={v.name}
            // {...this.props}
            tabLabel={v.name}
            // uri={v.uri}
            activeIndex={this.state.activeIndex}
            leftHidden={this.props.leftHidden}
            // getListType={this.props.getListType}
          />
        ))}
      </ScrollableTabView>
    );
  }
}
