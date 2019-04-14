import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

import styleUtil from "../../common/styleUtil";
import NavigatorPage from "../../components/NavigatorPage";
import { Image } from "react-native-elements";
import QRCode from "react-native-qrcode";
import QRCodeScanner from "react-native-qrcode-scanner";

export default class UserQRCode extends NavigatorPage {
  static defaultProps = {
    ...NavigatorPage.navigatorStyle,
    navBarHidden: false,
    navigationBarInsets: true,
    title: "添加好友"
  };

  constructor(props) {
    super(props);
    Object.assign(this.state, {
      scanMode: false
    });
  }

  _renderScan = () => {
    return (
      <View style={styleUtil.container}>
        <QRCodeScanner
          containerStyle={{
            flex: 1
          }}
          cameraStyle={{
            width: styleUtil.window.width,
            height: styleUtil.window.height
          }}
          showMarker={true}
          // onRead={this.onResponse.bind(this)}
          bottomViewStyle={{
            position: "absolute",
            bottom: 20
          }}
          customMarker={
            <View style={styles.rectangleContainer}>
              <View style={styles.rectangle} />
            </View>
          }
          bottomContent={
            <TouchableOpacity
              style={{marginBottom:30}}
              onPress={_ => {
                this.setState({ scanMode: false });
              }}
            >
              <Text style={{fontSize:14, color:"#00FF00"}}>我的二维码</Text>
            </TouchableOpacity>
          }
        />
      </View>
    );
  };

  _renderQRCode = () => {
    return (
      <View style={styles.container}>
        <View style={styles.QRNoteContainer}>
          <Text style={styles.QRNote}>{"只有面对面才能添加好友"}</Text>
        </View>
        <View style={styles.QRBox}>
          <QRCode
            value={this.props.uri}
            size={218}
            bgColor="black"
            fgColor="white"
          />
          <View style={styles.QRBoxCenterIcon}>
            <Image source={require("../../assets/image/spark_45x65.png")} />
          </View>
        </View>
        <View style={styles.QRButtonContainer}>
          <TouchableOpacity
            style={styles.QRButton}
            onPress={() => {
              this.setState({ scanMode: true });
            }}
          >
            <Image source={require("../../assets/image/qrcode_scanner.png")} />
            <Text style={styles.QRButtonText}>{"扫码"}</Text>
          </TouchableOpacity>
          <View style={styles.QRLine} />
          <View style={styles.QRButton}>
            <Image
              source={require("../../assets/image/qrcode_highlight.png")}
            />
            <Text style={styles.QRButtonHighlightText}>{"我的二维码"}</Text>
          </View>
        </View>
      </View>
    );
  };

  renderPage() {
    return (
      <View style={{ backgroundColor: "white", flex: 1 }}>
        {this.state.scanMode && this._renderScan()}
        {!this.state.scanMode && this._renderQRCode()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center"
  },
  QRNoteContainer: {
    width: 218,
    height: 23,
    borderRadius: 11,
    backgroundColor: styleUtil.themeColor,
    justifyContent: "center",
    alignItems: "center"
  },
  QRNote: {
    color: "white",
    fontSize: 14
  },
  QRBox: {
    backgroundColor: "white",
    paddingLeft: 36,
    paddingRight: 36,
    paddingTop: 36,
    paddingBottom: 36,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center"
  },
  QRBoxCenterIcon: {
    position: "absolute",
    width: 72,
    height: 72,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center"
  },
  QRButtonContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  QRButton: {
    alignItems: "center",
    width: 120
  },
  QRButtonText: {
    fontSize: 14,
    color: "#888888",
    marginTop: 10
  },
  QRButtonHighlightText: {
    fontSize: 14,
    color: styleUtil.themeColor,
    marginTop: 10
  },
  QRLine: {
    height: 30,
    width: 0.5,
    backgroundColor: "#979797"
  },
  rectangleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent"
  },
  rectangle: {
    height: 240,
    width: 240,
    borderWidth: 1,
    borderColor: "#00FF00",
    backgroundColor: "transparent"
  }
});
