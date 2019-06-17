import React from 'react';

import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import styleUtil from '../../common/styleUtil';
import NavigatorPage from '../../components/NavigatorPage';
import { Icon } from 'react-native-elements';
import TabBar from '../../components/tabbar/TabBar';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import navigate from '../../screens/navigate';
let pageCallback = null;
let callbackParam = [];

export default class LoginPersonal extends NavigatorPage {
  static defaultProps = {
    ...NavigatorPage.navigatorStyle,
    navBarHidden: false,
    title: '你的个性标签',
    rightView: (
      <TouchableOpacity
        style={{
          backgroundColor: styleUtil.themeColor,
          paddingHorizontal: 15,
          height: 30,
          borderRadius: 15,
          flexDirection: 'row',
          alignItems: 'center',
          marginRight: 10,
        }}
        onPress={_ => {
          pageCallback(callbackParam);
          navigate.pop();
        }}
      >
        <Text style={{ fontSize: 16, color: '#fff', textAlign: 'center' }}>{'保存'}</Text>
      </TouchableOpacity>
    ),
  };

  constructor(props) {
    super(props);

    pageCallback = props.pageCallback;

    this.state = { markers: props.markers, markersCategorys: props.markersCategorys };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    callbackParam = this.state.markers;
  }

  renderNavBar = props => {
    return (
      <TabBar
        backgroundColor={'white'}
        activeTextColor={styleUtil.activeTextColor}
        fromIndex={0}
        inactiveTextColor={styleUtil.inactiveTextColor}
        underlineStyle={styleUtil.underlineStyle}
        // tabContainerWidth={"100%"}
        style={{
          width: '100%',
          paddingTop: 10,
          borderBottomWidth: 0,
          justifyContent: 'space-between',
        }}
        tabs={this.state.markersCategorys}
      />
    );
  };

  renderPage() {
    const { markers, markersCategorys } = this.state;
    console.log('yuyuyuu');
    console.log(markersCategorys);
    console.log(markers);

    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ marginHorizontal: 10, marginTop: 10, flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text>{'已选择'}</Text>
            <Text style={{ marginLeft: 10, color: styleUtil.grayColor }}>
              {markers.length + '/12'}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              alignItems: 'flex-start',
              marginTop: 10,
              height: 180,
            }}
          >
            {markers.map((marker, i) => (
              <TouchableOpacity
                style={styles.buttonBox}
                onPress={_ => {
                  markers.splice(markers.indexOf(marker), 1);
                  this.setState({ markers: markers });
                }}
              >
                <Text style={styles.buttonText}>{marker.typeName}</Text>
                <View style={{ marginLeft: 8 }}>
                  <Icon name={'md-close'} type={'ionicon'} size={16} color={'white'} />
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <ScrollableTabView
            style={{ marginTop: 10 }}
            scrollWithoutAnimation={true}
            tabBarPosition={'top'}
            renderTabBar={this.renderNavBar}
            onChangeTab={this.onChangeTab}
            initialPage={0}
          >
            {markersCategorys.map((markersCategory, i) => (
              <View
                style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}
                key={markersCategory.typeName}
                tabLabel={markersCategory.typeName}
              >
                {markersCategory.childs.map((marker, i) => (
                  <TouchableOpacity
                    style={markers.indexOf(marker) > -1 ? styles.buttonBox : styles.unselectBox}
                    onPress={_ => {
                      let index = markers.indexOf(marker);
                      if (index > -1) {
                        markers.splice(index, 1);
                      } else {
                        if (markers.length < 12) {
                          markers.push(marker);
                        }
                      }
                      this.setState({ markers: markers });
                    }}
                  >
                    <Text style={styles.buttonText}>{marker.typeName}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </ScrollableTabView>
        </View>
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
