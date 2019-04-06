/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { TeaNavigator } from "teaset";
import TabNavBar from "./app/screens/TabNavBar";
import { Theme } from "teaset";
import styleUtil from "./app/common/styleUtil";
import navigate from "./app/screens/navigate";

const instructions = Platform.select({
  ios: "Press Cmd+R to reload,\n" + "Cmd+D or shake for dev menu",
  android:
    "Double tap R on your keyboard to reload,\n" +
    "Shake or press menu button for dev menu"
});

Theme.set({
  fitIPhoneX: true,
  tvBarBtnIconActiveTintColor: styleUtil.themeColor,
  tvBarBtnActiveTitleColor: styleUtil.themeColor,
  navColor: "white",
  backgroundColor: "white",
  navTintColor: "black",
  navTitleColor: "black",
  navSeparatorLineWidth: styleUtil.borderSeparator,
  navSeparatorColor: styleUtil.borderColor,
  navType: "auto", //'auto', 'ios', 'android'
  navStatusBarStyle: "dark-content", //'default', 'light-content', 'dark-content'

  //ListRow
  rowMinHeight: 60,
  rowPaddingLeft: 15,
  rowPaddingRight: 15,
  rowPaddingTop: 8,
  rowPaddingBottom: 8,
  rowIconWidth: 20,
  rowIconHeight: 20,
  rowIconPaddingRight: 12,
  rowAccessoryWidth: 10,
  rowAccessoryHeight: 10,
  rowAccessoryPaddingLeft: 8,
  rowAccessoryCheckColor: '#007aff',
  rowAccessoryIndicatorColor: '#bebebe',
  rowSeparatorColor: '#EBEBEB',
  rowSeparatorLineWidth: 0.5,
  rowPaddingTitleDetail: 4,
  rowDetailLineHeight: 18,
  rowActionButtonColor: '#c8c7cd',
  rowActionButtonDangerColor: '#d9534f',
  rowActionButtonTitleColor: '#fff',
  rowActionButtonDangerTitleColor: '#fff',
  rowActionButtonTitleFontSize: 15,
  rowActionButtonPaddingHorizontal: 12,
});

type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <TeaNavigator
        ref={v => navigate.setContainer(v)}
        rootView={<TabNavBar />}
      />
    );
    // return <View style={{ flex: 1, backgroundColor: "red" }} />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});