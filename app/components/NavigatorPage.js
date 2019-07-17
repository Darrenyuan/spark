import React from 'react';
import { View, Text, StatusBar, Platform } from 'react-native';
import PropTypes from 'prop-types';
import { NavigationPage, NavigationBar } from 'teaset';
import navigate from '../screens/navigate';

export default class NavigatorPage extends NavigationPage {
  static navigatorStyle = {
    ...NavigationPage.defaultProps,
    title: null,
    showBackButton: true,
    navBarHidden: false,
    navigationBarInsets: true,
    scene: navigate.sceneConfig.PushFromRight,
    // statusBarStyle: 'default',
    // autoKeyboardInsets:true,
    // keyboardTopInsets:0,
  };

  static defaultProps = {
    ...NavigatorPage.navigatorStyle,
  };

  static propTypes = {
    title: PropTypes.string,
    showBackButton: PropTypes.bool,
    leftTitle: PropTypes.string,
    leftView: PropTypes.element,
    rightView: PropTypes.element,
    leftOnPress: PropTypes.func,
    rightOnPress: PropTypes.func,
    rightTitle: PropTypes.string,
    rightTitleStyle: Text.propTypes.style,
    navBarHidden: PropTypes.bool,
    navigationBarInsets: PropTypes.bool,
    renderChild: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.hasSetHeight = false;
    this.npStatusBarHeight = 0;
    this.npNavigationBarHeight = 0;
  }

  renderNavigationTitle() {
    return this.props.title;
  }

  renderNavigationLeftView() {
    const { showBackButton, leftOnPress, leftStyle, leftTitleStyle, leftView } = this.props;
    if (!showBackButton) return null;
    let onPress = leftOnPress ? leftOnPress : () => this.navigator.pop();
    return (
      leftView || (
        <NavigationBar.BackButton
          style={{
            marginLeft: 5,
            ...leftStyle,
          }}
          titleStyle={{
            opacity: 0,
            ...leftTitleStyle,
          }}
          title={this.props.leftTitle || ''}
          onPress={onPress}
        />
      )
    );
  }

  renderNavigationRightView() {
    const { rightTitle, rightView, rightOnPress, rightTitleStyle } = this.props;
    if (!rightTitle && !rightView) return null;
    return (
      rightView || (
        <NavigationBar.LinkButton
          onPress={rightOnPress}
          style={rightTitleStyle}
          title={rightTitle}
        />
      )
    );
  }

  nponLayout = event => {
    let { height } = event.nativeEvent.layout;
    if (!this.hasSetHeight) {
      this.npNavigationBarHeight = height;
      if (Platform.OS === 'ios') {
        this.npStatusBarHeight = 20;
      } else {
        this.npStatusBarHeight = StatusBar.currentHeight;
      }
      this.hasSetHeight = true;
    }
  };
  ifSetHeight = () => {
    return this.hasSetHeight;
  };
  getNavigationBarHeight = () => {
    return this.npNavigationBarHeight;
  };
  getSatusBarHeight = () => {
    return this.npStatusBarHeight;
  };
  renderNavigationBar() {
    return this.props.navBarHidden ? null : (
      <NavigationBar
        onLayout={this.nponLayout}
        // hidden={this.props.navBarHidden}
        statusBarStyle={this.props.statusBarStyle}
        style={this.props.style}
        title={this.renderNavigationTitle()}
        leftView={this.renderNavigationLeftView()}
        rightView={this.renderNavigationRightView()}
      />
    );
  }

  renderChild(Component) {
    return <Component {...this.props.passProps} isFocused={this.state.isFocused} />;
  }

  renderPage() {
    return this.renderChild(this.props.children);
  }
}
