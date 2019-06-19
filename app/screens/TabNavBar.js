import { apiOnStart } from '../services/axios/api';
import React from 'react';
import { Platform, StyleSheet, Text, View, Image, TouchableOpacity, Modal } from 'react-native';
import { TabView, NavigationBar } from 'teaset';
import Nearby from '../pages/nearby/Nearby';
import { Icon } from 'react-native-elements';
import styleUtil from '../common/styleUtil';
import PublishEntrance from '../pages/publish/PublishEntrance';
import Profile from '../pages/profile/Profile';
import ChatList from '../pages/message/ChatList';
import navigate from './navigate';
import Search from '../pages/discovery/Search';
import LoginEnterPhone from '../pages/user/LoginEnterPhone';
import config from '../common/config';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../services/redux/actions';
import DeviceInfo from 'react-native-device-info';
import LocationService from './LocationService';
import md5 from 'react-native-md5';

// import MoreInfo from "../pages/discovery/Search";

class TabNavBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			activeIndex: 0,
			visible: false
		};
	}

	componentWillMount() {
		if (this.props.spark.loginInfo.auid) {
			this._netApplyLogon();
		}
		LocationService.init();
	}

	componentDidMount() {
		let auid = '';
		let M9 = new Date().getTime();
		let strM9 = '' + M9;
		this.props.actions.fetchConfigInfo({
			auid: auid,
			M0: 'MMC',
			M2: '',
			M3: '120.45435,132.32424',
			M8: md5.hex_md5(auid + strM9),
			M9: strM9
		});
	}
	componentWillUnmount() {
		LocationService.destroy();
	}

	_netApplyLogon = () => {
		const { loginInfo } = this.props.spark;
		let auid = loginInfo.auid;
		let M2 = loginInfo.loginToken;
		let M3 = LocationService.getLocationString();
		let M8 = md5.str_md5(auid + new Date().getTime());
		this.props.actions.applyLogon({
			auid: auid,
			M2: M2,
			M3: M3,
			M8: M8
		});
	};

	_onClickPublish = () => {
		if (!this.props.spark.loginInfo.loginToken) {
			navigate.pushNotNavBar(LoginEnterPhone);
			return;
		} else {
			this.setState({ visible: true });
		}
	};

	_callbackPublishClose = () => {
		this.setState({ visible: false });
	};

	onchangeTab = (index) => {
		this.setState({ activeIndex: index });
	};

	renderCustomButton() {
		let bigIcon = (
			<View
				style={{
					borderRadius: 31,
					shadowColor: '#e8e8e8',
					shadowOffset: { height: -0.5, width: 0 },
					shadowOpacity: 1,
					shadowRadius: 0,
					alignItems: 'center',
					justifyContent: 'center',
					backgroundColor: 'white',
					padding: 10
				}}
			>
				<PublishEntrance modalVisible={this.state.visible} callbackPublishClose={this._callbackPublishClose} />
				<Image source={require('../assets/image/tarbar_add.png')} />
			</View>
		);
		return (
			<TabView.Sheet
				type="button"
				icon={bigIcon}
				iconContainerStyle={{ justifyContent: 'flex-end' }}
				onPress={this._onClickPublish}
			/>
		);
	}

	render() {
		let { activeIndex } = this.state;
		let customBarStyle =
			Platform.OS === 'android'
				? null
				: {
						borderTopWidth: 0.5,
						borderTopColor: '#e8e8e8',
						backgroundColor: 'white'
					};
		return (
			<TabView
				style={{ flex: 1, backgroundColor: 'white' }}
				type="projector"
				activeIndex={activeIndex}
				barStyle={customBarStyle}
				onChange={(index) => this.onchangeTab(index)}
			>
				<TabView.Sheet
					title="附近"
					icon={<Image source={require('../assets/image/tabbar_home.png')} />}
					activeIcon={<Image source={require('../assets/image/tabbar_home_highlight.png')} />}
				>
					<Nearby
						leftHidden
						renderRightView={
							<NavigationBar.Button
								onPress={(_) => {
									navigate.pushNotNavBar(Search);
								}}
							>
								<Icon name={'ios-search'} type={'ionicon'} color={styleUtil.navIconColor} size={22} />
							</NavigationBar.Button>
						}
					/>
				</TabView.Sheet>
				<TabView.Sheet
					title="钉住"
					icon={<Image source={require('../assets/image/tabbar_pin.png')} />}
					activeIcon={<Image source={require('../assets/image/tabbar_pin_highlight.png')} />}
				>
					<Nearby
						leftHidden
						renderRightView={
							<NavigationBar.Button
								onPress={(_) => {
									navigate.pushNotNavBar(Search);
								}}
							>
								<Icon name={'ios-search'} type={'ionicon'} color={styleUtil.navIconColor} size={22} />
							</NavigationBar.Button>
						}
					/>
				</TabView.Sheet>
				{this.renderCustomButton()}
				<TabView.Sheet
					title="消息"
					icon={<Image source={require('../assets/image/tabbar_chat.png')} />}
					activeIcon={<Image source={require('../assets/image/tabbar_chat_highlight.png')} />}
				>
					<ChatList />
				</TabView.Sheet>
				<TabView.Sheet
					title="我的"
					icon={<Image source={require('../assets/image/tabbar_mine.png')} />}
					activeIcon={<Image source={require('../assets/image/tabbar_mine_highlight.png')} />}
				>
					<Profile style={{ backgroundColor: 'transparent', borderBottomWidth: 0 }} />
				</TabView.Sheet>
			</TabView>
		);
	}
}
function mapStateToProps(state) {
	return {
		spark: state
	};
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({ ...actions }, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(TabNavBar);
