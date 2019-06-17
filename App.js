/**
 * Sample React Native App
 * https://github.com/facebook/react-native *  * @format * @flow */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { TeaNavigator } from 'teaset';
import TabNavBar from './app/screens/TabNavBar';
import { Theme } from 'teaset';
import styleUtil from './app/common/styleUtil';
import navigate from './app/screens/navigate';
import IMessage from './app/common/IMessage';
import Request from './app/common/request';
import config from './app/common/config';
import toast from './app/common/toast';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from './app/services/redux/reducer';
import initialState from './app/services/redux/initialState';
import thunk from 'redux-thunk';
import configureStore from './app/services/common/configStore';
import { loadState, saveState } from './app/services/common/storage';
import throttle from 'lodash/throttle';

Theme.set({
  fitIPhoneX: true,
  tvBarBtnIconActiveTintColor: styleUtil.themeColor,
  tvBarBtnActiveTitleColor: styleUtil.themeColor,
  navColor: 'white',
  backgroundColor: 'white',
  navTintColor: 'black',
  navTitleColor: 'black',
  navSeparatorLineWidth: styleUtil.borderSeparator,
  navSeparatorColor: styleUtil.borderColor,
  navType: 'auto', //'auto', 'ios', 'android'
  navStatusBarStyle: 'dark-content', //'default', 'light-content', 'dark-content'

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

global.request = Request;
global.config = config;
global.toast = toast;
global.imessage = new IMessage();

type Props = {};
type State = {};

export default class App extends Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      loadingData: true,
    };
  }

  componentDidMount() {
    loadState().then(
      data => {
        if (data == null) {
          data = initialState;
        }
        console.log(JSON.stringify(data));
        store = configureStore(data);
        store.subscribe(
          throttle(() => {
            saveState(store.getState());
          }, 1000),
        );
        this.setState({ loadingData: false, store: store });
      },
      error => {
        store = configureStore();
        store.subscribe(
          throttle(() => {
            saveState(store.getState());
          }, 1000),
        );
        this.setState({ loadingData: false, store: store });
      },
    );
  }

  render() {
    if (this.state.loadingData) {
      return (
        <View>
          <Text>loading</Text>
        </View>
      );
    } else
      return (
        <Provider store={this.state.store}>
          <TeaNavigator ref={v => navigate.setContainer(v)} rootView={<TabNavBar />} />
        </Provider>
      );
    // return <View style={{ flex: 1, backgroundColor: "red" }} />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
