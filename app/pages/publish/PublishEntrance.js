import React from 'react';
import { Image, Modal, Text, TouchableOpacity, View } from 'react-native';
import { BlurView } from 'react-native-blur';
import navigate from '../../screens/navigate';
import Publish from './Publish';
export default class PublishEntrance extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
    };
  }
  componentWillMount() {}
  render() {
    const coords = {
      latitude: this.props.latitude,
      longitude: this.props.longitude,
      coordsStr: this.props.coordsStr,
      address: this.props.address,
    };
    return (
      <Modal
        animationType={'fade'}
        // transparent={true}
        visible={this.props.modalVisible}
        onRequestClose={() => {}}
        // onShow={() => {}}
        supportedOrientations={['portrait']}
        onOrientationChange={() => {}}
      >
        <View
          style={{
            flex: 1,
            marginTop: 0,
            backgroundColor: '#000',
            opacity: 0.8,
          }}
        >
          <View style={{ flex: 1, alignItems: 'stretch' }}>
            <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 30 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  alignItems: 'flex-end',
                }}
              >
                <TouchableOpacity
                  onPress={_ => {
                    this.props.callbackPublishClose();
                    navigate.pushNotNavBar(Publish, {
                      type: 0,
                      title: '话题',
                      ...coords,
                    });
                  }}
                >
                  <Image source={require('../../assets/image/publish_topic.png')} />
                  <Text style={{ color: 'white', fontSize: 16, paddingTop: 10 }}>{'话题'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={_ => {
                    this.props.callbackPublishClose();
                    navigate.pushNotNavBar(Publish, { type: 1, title: '一起', ...coords });
                  }}
                  style={{ paddingBottom: 30 }}
                >
                  <Image source={require('../../assets/image/publish_together.png')} />
                  <Text style={{ color: 'white', fontSize: 16, paddingTop: 10 }}>{'一起'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={_ => {
                    this.props.callbackPublishClose();
                    navigate.pushNotNavBar(Publish, { type: 2, title: '二手', ...coords });
                  }}
                  style={{ paddingBottom: 30 }}
                >
                  <Image source={require('../../assets/image/publish_second_hand.png')} />
                  <Text style={{ color: 'white', fontSize: 16, paddingTop: 10 }}>{'二手'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={_ => {
                    this.props.callbackPublishClose();
                    navigate.pushNotNavBar(Publish, { type: 3, title: '时刻', ...coords });
                  }}
                >
                  <Image source={require('../../assets/image/publish_dynamic.png')} />
                  <Text style={{ color: 'white', fontSize: 16, paddingTop: 10 }}>{'时刻'}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              style={{ alignSelf: 'center', marginBottom: 50 }}
              onPress={() => {
                this.props.callbackPublishClose();
              }}
            >
              <Image
                style={{ paddingBottom: 20 }}
                source={require('../../assets/image/publish_close.png')}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}
