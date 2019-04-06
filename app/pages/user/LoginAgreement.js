import React from "react";

import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity
} from "react-native";
import styleUtil from "../../common/styleUtil";
import NavigatorPage from "../../components/NavigatorPage";
import LoadingMore from "../../components/load/LoadingMore";
import { Icon } from "react-native-elements";
import { NavigationBar } from "teaset";

export default class LoginAgreement extends NavigatorPage {
  static defaultProps = {
    ...NavigatorPage.navigatorStyle,
    navBarHidden: false,
    title:"用户协议"
  };

  constructor(props) {
    super(props);
    Object.assign(this.state, {
      user: props.user
    });
  }


  renderPage() {
    return (
      <View style={styleUtil.container}>

      </View>
    );
  }
}

