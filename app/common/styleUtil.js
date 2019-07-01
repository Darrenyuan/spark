'use strict';

import React from 'react';
import { PixelRatio, Dimensions, StyleSheet, Platform } from 'react-native';
import { Theme } from 'teaset';

const scale = PixelRatio.get();

const BACKGROUND_COLOR = 'white';
const THEME_COLOR = '#FE7733';

export default {
  ratio: scale,
  pixel: 1 / scale,
  window: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  avatar: {
    width: 40 * scale,
    height: 40 * scale,
    borderRadius: (40 * scale) / 2,
  },
  headerRight: {
    fontSize: 17,
    color: '#FFF',
    paddingRight: 15,
  },
  navBackgroundColor: 'white',
  disabledColor: '#BBB',
  detailTextColor: '#989898',
  successColor: '#32CD32',
  borderColor: '#CCC',
  primaryColor: '#337ab7',
  themeColor: THEME_COLOR,
  fontSize: 14,
  backgroundColor: BACKGROUND_COLOR,
  listSpace: { marginTop: 20 },
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  underlayColor: 'rgba(0,0,0,.3)',
  navBarHeight: Platform.OS === 'ios' ? 64 : 44,
  navBarStatusHeight: Platform.OS === 'ios' ? 20 : 0,
  navBarStyle: {
    backgroundColor: THEME_COLOR,
    position: 'relative',
  },
  borderSeparator: Theme.tvBarSeparatorWidth,
  linkTextColor: '#337ab7',
  activeTextColor: '#000',
  inactiveTextColor: '#666',
  activeColor: THEME_COLOR,
  navIconColor: '#000',
  underlineStyle: {
    backgroundColor: THEME_COLOR,
    bottom: 5,
    height: 3,
    // width: 40,
  },
  shadowText: {
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    textShadowColor: '#000',
  },
  grayColor: '#e5e5e5',
  contentPaddingStyles: { paddingTop: 15, paddingHorizontal: 15 },
};
