import React from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import styleUtil from '../../common/styleUtil';
import NavigatorPage from '../../components/NavigatorPage';
import LoadingMore from '../../components/load/LoadingMore';
import { Icon } from 'react-native-elements';
import { NavigationBar } from 'teaset';
import navigate from '../../screens/navigate';
import LoginPersonal from './LoginPersonal';
import LoginEnterPassword from './LoginEnterPassword';
import config from '../../common/config';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../services/redux/actions';
import { ActionSheet } from 'teaset';
import LoginAgreement from './LoginAgreement';
import { apiEditRegistInfo2 } from '../../services/axios/api';
import md5 from 'react-native-md5';

class LoginMoreInfo extends NavigatorPage {
  static defaultProps = {
    ...NavigatorPage.navigatorStyle,
    navBarHidden: false,
    title: '让我更了解你',
  };

  constructor(props) {
    super(props);
    this.state = {
      kkStatus: {}, //交友状态[0]
      markers: [],
      isVisible: true,
    };
  }

  componentDidMount() {
    super.componentDidMount();
    if (this.props.spark.configInfo) {
      this._status = this.props.spark.configInfo.kkStatusTypes; //交友状态类型
      this.markersCategorys = this.props.spark.configInfo.markerTypes; //自我标签类型
    }
  }

  _netRegisterInfo2 = () => {
    const { kkStatus, markers } = this.state;
    if (markers.length > 0) {
      const markerIDs = markers.map(marker => {
        return marker.typeID;
      });
      let auid = '';
      let M9 = new Date().getTime();
      let strM9 = '' + M9;
      toast.modalLoading();
      apiEditRegistInfo2({
        kkStatus: kkStatus.typeID,
        markers: markerIDs,
        auid: auid,
        M0: Platform.OS === 'ios' ? 'IMMC' : 'MMC',
        M2: '',
        M3: '120.45435,132.32424',
        M8: md5.hex_md5(auid + strM9),
        M9: strM9,
      }).then(res => {
        toast.modalLoadingHide();
        console.log(res);
        if (res.data.code === 1) {
          this._toLogin();
          // navigate.popN(4);
          // this._netApplyLogin();
        }
      });
    }
  };

  _toLogin() {
    navigate.pushNotNavBar(LoginEnterPassword, { phone: this.props.phone });
  }
  _netApplyLogin = () => {
    // toast.modalLoading();
    // request.post(config.api.applyLogon, {}).then(res => {
    //   toast.modalLoadingHide();
    //   if (res.code === 1) {
    //     config.setUserToStorage(res.data.user);
    //   }
    // });
    this._toLogin();
  };

  _btnStyle = bool => (bool ? styleUtil.themeColor : styleUtil.disabledColor);

  showAction = () => {
    let items = [];
    for (let item of this._status) {
      items.push({
        title: item.typeName,
        onPress: _ => this.setState({ kkStatus: item }),
      });
    }
    config.showAction(items);
  };

  showLabels = markers => {
    let string = '';
    markers.forEach((v, i, a) => {
      string = string + v.typeName + '；';
    });
    return string;
  };

  renderPage() {
    const { kkStatus, markers } = this.state;
    return (
      <View style={styleUtil.container}>
        <View
          style={{
            marginHorizontal: 10,
            alignItems: 'center',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              paddingVertical: 15,
              borderBottomWidth: styleUtil.borderSeparator,
              borderBottomColor: styleUtil.borderColor,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View style={{ flexDirection: 'row' }}>
              <Text>{'交友状态'}</Text>
            </View>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                flex: 1,
                justifyContent: 'flex-end',
              }}
              onPress={_ => {
                this.showAction();
              }}
            >
              <Text
                style={{
                  marginRight: 10,
                  marginLeft: 40,
                  color: styleUtil.detailTextColor,
                  minWidth: 100,
                  textAlign: 'right',
                }}
                numberOfLines={1}
              >
                {kkStatus.typeName}
              </Text>
              <Icon
                name={'ios-arrow-forward'}
                type={'ionicon'}
                size={25}
                color={styleUtil.grayColor}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              paddingVertical: 15,
              borderBottomWidth: styleUtil.borderSeparator,
              borderBottomColor: styleUtil.borderColor,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text>{'个性标签'}</Text>
              <Text style={{ marginLeft: 10, color: styleUtil.detailTextColor }}>
                {markers.length + '/12'}
              </Text>
            </View>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                flex: 1,
                justifyContent: 'flex-end',
              }}
              onPress={_ => {
                navigate.pushNotNavBar(LoginPersonal, {
                  markers,
                  markersCategorys: this.markersCategorys,
                  pageCallback: markers => {
                    this.setState({ markers });
                  },
                });
              }}
            >
              <Text
                style={{
                  marginRight: 10,
                  marginLeft: 40,
                  color: styleUtil.detailTextColor,
                  minWidth: 100,
                  textAlign: 'right',
                }}
                numberOfLines={1}
              >
                {this.showLabels(markers)}
              </Text>
              <Icon
                name={'ios-arrow-forward'}
                type={'ionicon'}
                size={25}
                color={styleUtil.grayColor}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            activeOpacity={markers.length > 0 ? 0.5 : 1}
            style={[
              styles.buttonBox,
              {
                backgroundColor: this._btnStyle(markers.length > 0),
                borderColor: this._btnStyle(markers.length > 0),
              },
            ]}
            onPress={_ => {
              if (markers.length > 0) {
                this._netRegisterInfo2();
              }
            }}
          >
            <Text style={styles.buttonText}>{'完成'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              // navigate.popN(4);
              // this._netApplyLogin();
              navigate.pushNotNavBar(LoginEnterPassword, { phone: this.props.phone });
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: styleUtil.themeColor,
                marginTop: 40,
              }}
            >
              {'跳过，稍后完善'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
function mapStateToProps(state) {
  return {
    spark: state,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...actions }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginMoreInfo);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: styleUtil.backgroundColor,
  },
  signUpBox: {
    marginTop: 10,
    // padding: 10
  },
  datingStatusItem: {
    flexDirection: 'row',
    paddingVertical: 15,
    borderBottomWidth: styleUtil.borderSeparator,
    borderBottomColor: styleUtil.borderColor,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    marginBottom: 20,
    color: '#333',
    fontSize: 20,
    textAlign: 'center',
  },
  inputField: {
    marginLeft: 8,
    height: 35,
    paddingLeft: 8,
    color: '#454545',
    fontSize: 16,
    backgroundColor: 'transparent',
    borderBottomWidth: styleUtil.borderSeparator,
    // borderWidth: styleUtil.borderSeparator,
    borderColor: styleUtil.borderColor,
  },
  buttonBox: {
    marginTop: 40,
    backgroundColor: styleUtil.themeColor,
    height: 48,
    borderWidth: 1,
    borderColor: styleUtil.themeColor,
    borderRadius: 24,
    width: '80%',
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    marginTop: 12,
  },
  verifyCodeBox: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  countBtn: {
    width: 110,
    height: 40,
    padding: 10,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: styleUtil.themeColor,
    backgroundColor: styleUtil.themeColor,
    borderRadius: 4,
  },
  countBtnText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
  },
  closeModal: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
});
