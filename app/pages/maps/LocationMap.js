import React from 'react';

import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import styleUtil from '../../common/styleUtil';
import NavigatorPage from '../../components/NavigatorPage';
import { Icon } from 'react-native-elements';
import TabBar from '../../components/tabbar/TabBar';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import navigate from '../../screens/navigate';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../services/redux/actions';
let pageCallback = null;
let callbackParam = [];

class LocationMap extends NavigatorPage {
  renderPage() {
    return (
      <View>
        <Text>LocationMap</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonBox: {
    backgroundColor: styleUtil.themeColor,
    height: 34,
    borderWidth: 1,
    borderColor: styleUtil.themeColor,
    borderRadius: 17,
    paddingHorizontal: 17,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  unselectBox: {
    backgroundColor: styleUtil.grayColor,
    height: 34,
    borderWidth: 1,
    borderColor: styleUtil.grayColor,
    borderRadius: 17,
    paddingHorizontal: 17,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 10,
  },
});

function mapStateToProps(state) {
  return {
    spark: state,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...actions }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LocationMap);
