import React from 'react';

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Switch,
} from 'react-native';
import styleUtil from '../../common/styleUtil';
import NavigatorPage from '../../components/NavigatorPage';
import { Icon, registerCustomIconType } from 'react-native-elements';
import TabBar from '../../components/tabbar/TabBar';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import navigate from '../../screens/navigate';
import * as actions from '../../services/redux/actions';
import { MapView } from 'react-native-amap3d';
import { apiRegeo } from '../../services/axios/api';
import { Cell, Section, TableView, Separator } from 'react-native-tableview-simple';
import Publish from '../publish/Publish';
let pageCallback = null;
let callbackParam = [];
let height = Dimensions.get('window').height;
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: height / 2,
  },
  text: {
    position: 'absolute',
    flex: 1,
    left: 0,
    right: 0,
    height: height / 2,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
});

let _submit;
export default class LocationMap extends NavigatorPage {
  static defaultProps = {
    ...NavigatorPage.navigatorStyle,
    navBarHidden: false,
    navigationBarInsets: true,
    scene: navigate.sceneConfig.FloatFromBottom,
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
          _submit();
          console.log(111);
        }}
      >
        <Text style={{ fontSize: 16, color: '#fff', textAlign: 'center' }}>{'确定'}</Text>
      </TouchableOpacity>
    ),
  };

  constructor(props) {
    super(props);
    this.state = {
      latitude: this.props.latitude,
      longitude: this.props.longitude,
      pois: [],
      selectId: '',
      prefix: '',
    };
  }

  componentDidMount() {
    this._fetchData(this.state.latitude, this.state.longitude);
    _submit = () => {
      console.log('submit');
      let pois = this.state.pois;

      pois.forEach(item => {
        if (item.id == this.state.selectId) {
          let address = this.state.prefix + item.name;
          this.props.pageCallback(address, item.location);
          this.navigator.pop();
        }
      });
    };
  }

  _fetchData = (latitude, longitude) => {
    apiRegeo({ latitude: latitude, longitude: longitude }).then(res => {
      if (res.data.status === '1') {
        const { city, province, district } = res.data.regeocode.addressComponent;
        let prefix = province + city + district;
        this.setState({ pois: res.data.regeocode.pois, prefix: prefix });
      }
    });
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.latitude !== prevProps.latitude ||
      this.props.longitude !== prevProps.longitude
    ) {
      apiRegeo({ latitude: this.props.latitude, longitude: this.props.longitude }).then(res => {
        if (res.data.status === '1') {
          const { city, province, district } = res.data.regeocode.addressComponent;
          let prefix = province + city + district;
          this.setState({ pois: res.data.regeocode.pois, prefix: prefix });
        }
      });
      this.setState({
        latitude: this.props.latitude,
        longitude: this.props.longitude,
      });
    }
  }
  renderPoi = item => {
    return (
      <View key={item.id}>
        <Cell
          cellStyle="Subtitle"
          accessory={this.state.selectId == item.id ? 'Checkmark' : ''}
          title={item.name}
          detail={item.address}
          onPress={() => {
            this.setState({ selectId: item.id });
          }}
        />
        <Separator />
      </View>
    );
  };

  renderPage() {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          coordinate={{
            latitude: this.props.latitude,
            longitude: this.props.longitude,
          }}
          zoomLevel={16}
        >
          <MapView.Marker
            title=""
            coordinate={{
              latitude: this.props.latitude,
              longitude: this.props.longitude,
            }}
          />
        </MapView>
        <View style={styles.text}>
          <ScrollView style={{ flex: 1 }}>
            {this.state.pois.map(item => this.renderPoi(item))}
          </ScrollView>
        </View>
      </View>
    );
  }
}
