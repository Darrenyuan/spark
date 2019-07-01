import React from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native';
import md5 from 'react-native-md5';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../services/redux/actions';
import styleUtil from '../../common/styleUtil';
import NavigatorPage from '../../components/NavigatorPage';
import navigate from '../../screens/navigate';
import { ListRow } from 'teaset';
import SettingsAbout from './SettingsAbout';
import SettingsEditAccount from './SettingsEditAccount';
import SettingsEditProfile from './SettingsEditProfile';
import ShareWeChat from '../../components/ShareWeChat';
import { Icon } from 'react-native-elements';
import config from '../../common/config';
import LoginEnterPhone from '../user/LoginEnterPhone';

class Settings extends NavigatorPage {
  static defaultProps = {
    ...NavigatorPage.navigatorStyle,
    navBarHidden: false,
    navigationBarInsets: true,
    title: '设置',
  };

  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
    };
  }

  _btnStyle = bool => (bool ? styleUtil.themeColor : styleUtil.disabledColor);

  _netlogout = () => {
    let M9 = new Date().getTime();
    let strM9 = '' + M9;
    let { auid, loginToken } = this.props.loginInfo;
    let { coordsStr } = this.props.locationInfo;
    new Promise((resolve, reject) => {
      this.props
        .logout({
          auid: auid,
          M0: Platform.OS === 'ios' ? 'IMMC' : 'MMC',
          M2: loginToken,
          M3: coordsStr,
          M8: md5.hex_md5(auid + strM9),
          M9: strM9,
        })
        .then(res => {
          if (res.data.code === 1) {
            toast.success('注销成功');
            navigate.pushNotNavBar(LoginEnterPhone);
          }
        });
    });
  };

  _renderSparkAlert = off => {
    let imagePath = off
      ? require('../../assets/image/chat_spark.png')
      : require('../../assets/image/chat_spark_highlight.png');
    let title = off
      ? '太久没联系，需要面对面扫码才能复燃火花'
      : '想让火花持久不灭？\n保持线上互动，或者线下见个面吧';
    let buttonTitle = off ? '复燃火花' : '加满燃料';

    return (
      <Modal animationType={'slide'} transparent={true} visible={this.state.modalVisible}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              width: '80%',
              height: 257,
              backgroundColor: 'white',
              shadowColor: 'black',
              shadowOffset: { height: 2 },
              shadowOpacity: 0.4,
              shadowBlur: 10,
              borderRadius: 8,
              alignItems: 'center',
            }}
          >
            <TouchableOpacity
              style={{ position: 'absolute', right: 5, top: 2 }}
              onPress={() => this.setState({ modalVisible: false })}
            >
              <Icon name={'md-close'} type={'ionicon'} size={20} color={styleUtil.themeColor} />
            </TouchableOpacity>
            <Image style={{ marginTop: 35 }} source={imagePath} />
            <Text
              style={{
                color: '#616161',
                fontSize: 14,
                marginTop: 33,
                textAlign: 'center',
                flex: 1,
              }}
            >
              {title}
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: styleUtil.themeColor,
                height: 36,
                borderRadius: 18,
                paddingHorizontal: 15,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 15,
              }}
            >
              <Text style={{ color: 'white', fontSize: 16 }}>{buttonTitle}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  renderPage() {
    console.log(this.props.loginInfo);
    console.log(this.props.userInfo);
    console.log('yuyuyuyu');
    return (
      <View style={{ backgroundColor: 'white', flex: 1 }}>
        <View style={{ flex: 1 }}>
          <ListRow
            title={'邀请好友'}
            onPress={_ => {
              ShareWeChat.show(
                {
                  type: 'news',
                  title: '于何处，寻找价值观一致的同类人',
                  description:
                    '有些人，只是我们短暂人生的过客，很快便在我们的记忆中被抹掉；还有些人，却在与我们插肩而过之后，让我们的心为之改变。人生若之如初见，那是怎样的美好。在这里，遇见对的人，就是你一生的幸福……',
                  // thumbImage: config.api.imageURI + 'uploads/image/app_icon.png',
                  // imageUrl: config.api.imageURI + 'uploads/image/app_icon.png',
                  webpageUrl: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.whereapp',
                },
                success => {},
              );
              this.setState({ modalVisible: true });
            }}
            icon={require('../../assets/image/settings_invite.png')}
            topSeparator={'none'}
            bottomSeparator={'indent'}
          />
          <ListRow
            title={'修改个人资料'}
            onPress={_ => {
              navigate.pushNotNavBar(SettingsEditProfile);
            }}
            icon={require('../../assets/image/settings_edit_profile.png')}
            topSeparator={'none'}
            bottomSeparator={'indent'}
          />
          <ListRow
            title={'修改账户信息'}
            onPress={_ => {
              navigate.pushNotNavBar(SettingsEditAccount);
            }}
            icon={require('../../assets/image/settings_edit_account.png')}
            topSeparator={'none'}
            bottomSeparator={'indent'}
          />
          <ListRow
            title={'关于我们'}
            onPress={_ => {
              navigate.pushNotNavBar(SettingsAbout);
            }}
            icon={require('../../assets/image/settings_about.png')}
            topSeparator={'none'}
            bottomSeparator={'indent'}
          />
        </View>
        <TouchableOpacity
          style={{ alignItems: 'center', justifyContent: 'center', height: 80 }}
          onPress={_ => {
            this._netlogout();
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: styleUtil.themeColor,
              fontWeight: '700',
            }}
          >
            {'退出登录'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
function mapStateToProps(state) {
  return {
    userInfo: state.userInfo,
    loginInfo: state.loginInfo,
    locationInfo: state.locationInfo,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    logout: bindActionCreators({ ...actions }, dispatch).logout,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Settings);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: styleUtil.backgroundColor,
  },
  signUpBox: {
    marginTop: 10,
    // padding: 10
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
    marginTop: 80,
    backgroundColor: styleUtil.themeColor,
    height: 48,
    borderWidth: 1,
    borderColor: styleUtil.themeColor,
    borderRadius: 24,
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
