import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Image, Text } from 'react-native-elements';
import styleUtil from '../common/styleUtil';

export default class Blank extends React.Component {
  render() {
    const { title, buttonTitle, buttonClickCallback } = this.props;

    return (
      <View style={{ flex: 1, alignItems: 'center', marginTop: 100 }}>
        <Image source={require('../assets/image/blank.png')} />
        {title && <Text style={{ marginTop: 30, color: '#828282', fontSize: 14 }}>{title}</Text>}
        {buttonTitle && (
          <TouchableOpacity
            style={[
              styles.buttonBox,
              {
                marginTop: 20,
              },
            ]}
            onPress={_ => {
              buttonClickCallback();
            }}
          >
            <Text style={styles.buttonText}>{buttonTitle}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonBox: {
    backgroundColor: styleUtil.themeColor,
    height: 32,
    borderWidth: 1,
    borderColor: styleUtil.themeColor,
    borderRadius: 16,
    justifyContent: 'center',
    paddingHorizontal: 20,
    minWidth: 144,
  },
  buttonText: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
  },
});
