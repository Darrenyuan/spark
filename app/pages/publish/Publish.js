import React from 'react';

import {
	StyleSheet,
	Text,
	View,
	Image,
	ImageBackground,
	TextInput,
	TouchableOpacity,
	Keyboard,
	Platform,
	Modal
} from 'react-native';
import styleUtil from '../../common/styleUtil';
import NavigatorPage from '../../components/NavigatorPage';
import navigate from '../../screens/navigate';
import LoginPersonal from '../user/LoginPersonal';
import { Icon } from 'react-native-elements';
import config from '../../common/config';
import ImageCropPicker from 'react-native-image-crop-picker';
import { apiAdd, apiSjTypeInfo } from '../../services/axios/api';
import md5 from 'react-native-md5';
import { bindActionCreators } from 'redux';
import * as actions from '../../services/redux/actions';
import { connect } from 'react-redux';
import toast from '../../common/toast';

let gType;
let _netPublishSubject;
class Publish extends NavigatorPage {
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
					marginRight: 10
				}}
				onPress={(_) => {
					_netPublishSubject();
				}}
			>
				<Text style={{ fontSize: 16, color: '#fff', textAlign: 'center' }}>{'发布'}</Text>
			</TouchableOpacity>
		)
	};

	constructor(props) {
		super(props);
		this.state = {
			pageInfo: null,
			title: '',
			content: '',
			price: '',
			imgs: [],
			visible: false,
			startTime: '',
			areaR: ''
		};
	}

	componentDidMount() {
		let M9 = new Date().getTime();
		let strM9 = '' + M9;
		let { auid, loginToken } = this.props.spark.loginInfo;
		let sjType = this.props.spark.configInfo.data.sjTypes.map((item) => {
			return item.sjType;
		});

		// 获取主题配置信息
		apiSjTypeInfo({
			sjType: sjType[this.props.type - 1],
			auid: auid,
			M0: 'MMC',
			M2: loginToken,
			M3: '120.45435,132.32424',
			M8: md5.hex_md5(auid + strM9),
			M9: strM9
		}).then((res) => {
			this.setState({
				pageInfo: res.data.data[0],
				startTime: res.data.data[0].startTimeDef,
				areaR: res.data.data[0].areaRDef
			});
			console.log(res);
			console.log('pageInfo pageInfo pageInfo');
		});

		// 发布主题，全局作用域
		_netPublishSubject = () => {
			const { pageInfo, title, content, price, imgs, areaR, startTime } = this.state;
			apiAdd({
				sjType: pageInfo.sjType,
				title: title,
				content: content,
				areaR: areaR,
				startTime: startTime,
				price: price,
				imgs: imgs,
				auid: auid,
				M0: 'MMC',
				M2: loginToken,
				M3: '120.45435,132.32424',
				M8: md5.hex_md5(auid + strM9),
				M9: strM9
			}).then((res) => {
				console.log(res);
				console.log('add add add');
			});
		};
	}
	// 图片添加
	_onImageAdd = () => {
		ImageCropPicker.openPicker({
			multiple: true,
			mediaType: 'photo',
			cropping: true,
			compressImageQuality: Platform.OS === 'ios' ? 0 : 1,
			maxFiles: 9
		}).then((images) => {
			let newImgs = [];
			this.state.imgs.concat(images).map((item, index) => {
				index < 9 && newImgs.push(item);
			});
			this.setState({ imgs: newImgs });
		});
	};
	// 图片删除
	_onImagedelete = (flag) => {
		let newImgs = [];
		this.state.imgs.map((item, index) => {
			flag !== index && newImgs.push(item);
		});
		this.setState({
			imgs: newImgs
		});
	};
	// 弹出时间Action
	_onClickTimer = () => {
		let { startTimeOptions } = this.state.pageInfo;
		if (startTimeOptions.length > 0) {
			let items = [];
			Object.keys(startTimeOptions[0]).map((item) => {
				let timer = {};
				timer.title = startTimeOptions[0][item];
				timer.onPress = () => {
					this.setState({ startTime: item });
				};
				items.push(timer);
			});
			config.showAction(items);
		}
	};

	_renderLine1Input = (placeholder1, placeholder2) => {
		return (
			<View style={{ flexDirection: 'row' }}>
				<TextInput
					placeholder={placeholder1}
					placeholderTextColor="#E5E5E5"
					autoCorrect={false}
					underlineColorAndroid="transparent"
					style={[ styles.inputField, { flex: 3 } ]}
					value={this.state.title}
					maxLength={100}
					autoFocus={true}
					onChangeText={(text) => {
						this.setState({ title: text });
					}}
				/>
				{placeholder2 && (
					<View style={{ flex: 2, flexDirection: 'row', alignItems: 'center' }}>
						<TextInput
							placeholder={placeholder2}
							placeholderTextColor="#E5E5E5"
							autoCorrect={false}
							underlineColorAndroid="transparent"
							style={[ styles.inputField, { flex: 1, marginLeft: 15, paddingLeft: 30 } ]}
							value={this.state.price}
							maxLength={100}
							onChangeText={(text) => {
								this.setState({ price: text });
							}}
						/>
						<Image
							style={{ position: 'absolute', marginLeft: 28 }}
							source={require('../../assets/image/publish_yuan.png')}
						/>
					</View>
				)}
			</View>
		);
	};

	_renderLine2Input = (placeholder) => {
		return (
			<TextInput
				placeholder={placeholder}
				placeholderTextColor="#E5E5E5"
				autoCorrect={false}
				underlineColorAndroid="transparent"
				style={[ styles.input2Field ]}
				value={this.state.content}
				multiline={true}
				onChangeText={(text) => {
					this.setState({ content: text });
				}}
			/>
		);
	};

	_renderImageAdd = () => {
		const { imgs } = this.state;
		return (
			<View
				style={{
					flexDirection: 'row',
					flexWrap: 'wrap'
				}}
			>
				{imgs.length < 9 && (
					<TouchableOpacity
						onPress={(_) => {
							this._onImageAdd();
						}}
					>
						<View style={[ styles.imgsItem, { justifyContent: 'center', alignItems: 'center' } ]}>
							<Icon name={'ios-add'} type={'ionicon'} size={40} color={'#D8D8D8'} />
						</View>
					</TouchableOpacity>
				)}
				{imgs.length > 0 &&
					imgs.map((item, index) => {
						if (index < 9) {
							return (
								<View style={styles.imgsItem} key={index}>
									<Image source={{ uri: item.path }} style={styles.imgsItem_img} />
									<TouchableOpacity
										onPress={(_) => {
											this._onImagedelete(index);
										}}
										style={{
											position: 'absolute',
											right: -10,
											top: -10
										}}
									>
										<Image
											source={require('../../assets/image/delete_item.png')}
											style={styles.imgsItem_delete}
										/>
									</TouchableOpacity>
								</View>
							);
						}
					})}
			</View>
		);
	};

	_renderTimer = (tip) => {
		const { startTime, pageInfo } = this.state;
		return (
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center'
				}}
			>
				<View style={{ width: 25, alignItems: 'flex-start' }}>
					<Icon name={'md-time'} type={'ionicon'} size={20} color={styleUtil.themeColor} />
				</View>
				<View
					style={{
						flexDirection: 'row',
						flex: 1,
						paddingVertical: 8,
						borderBottomWidth: styleUtil.borderSeparator,
						borderBottomColor: styleUtil.borderColor,
						justifyContent: 'space-between',
						alignItems: 'center'
					}}
				>
					<Text style={{ color: '#454545', fontSize: 14 }}>{tip}</Text>
					<TouchableOpacity
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							flex: 1,
							justifyContent: 'flex-end'
						}}
						onPress={(_) => {
							this._onClickTimer();
						}}
					>
						<Text
							style={{
								marginRight: 10,
								marginLeft: 40,
								color: '#454545',
								minWidth: 100,
								textAlign: 'right',
								fontSize: 14
							}}
							numberOfLines={1}
						>
							{startTime === '' ? '现在' : pageInfo.startTimeOptions[0][startTime]}
						</Text>
						<Icon name={'ios-arrow-forward'} type={'ionicon'} size={25} color={styleUtil.grayColor} />
					</TouchableOpacity>
				</View>
			</View>
		);
	};
	_renderAddress = () => {
		const { pageInfo, areaR } = this.state;
		return (
			<View>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center'
					}}
				>
					<View style={{ width: 25, alignItems: 'flex-start' }}>
						<Icon name={'ios-pin'} type={'ionicon'} size={20} color={styleUtil.themeColor} />
					</View>
					<View
						style={{
							flexDirection: 'row',
							flex: 1,
							paddingVertical: 8,
							borderBottomWidth: styleUtil.borderSeparator,
							borderBottomColor: styleUtil.borderColor,
							justifyContent: 'space-between',
							alignItems: 'center'
						}}
					>
						<Text style={{ color: '#454545', fontSize: 14 }}>{'上海市浦东新区梅花路'}</Text>
						<TouchableOpacity
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								flex: 1,
								justifyContent: 'flex-end'
							}}
							onPress={(_) => {
								navigate.pushNotNavBar(LoginPersonal, {
									labels,
									pageCallback: (labels) => {
										this.setState({ labels });
									}
								});
							}}
						>
							<Icon name={'ios-arrow-forward'} type={'ionicon'} size={25} color={styleUtil.grayColor} />
						</TouchableOpacity>
					</View>
				</View>
				<Text
					style={{
						fontSize: 12,
						color: '#C1C1C1',
						marginLeft: 25,
						marginTop: 5
					}}
				>
					{areaR === '' ? '' : `*当前位置${pageInfo.areaROptions[0][areaR]}范围可被发现`}
				</Text>
			</View>
		);
	};

	renderPage() {
		const { type } = this.props;
		const { pageInfo } = this.state;

		let placeholder1;
		let placeholder2;
		let placeholder;
		// let note;
		let tip;
		if (type == 0) {
			placeholder1 = '简要描述你想讨论的话题';
			placeholder = '你的观点/补充（选填）';
			tip = '多久后关闭';
			// note = '*当前位置3km范围可被发现';
		} else if (type == 1) {
			placeholder1 = '一起做点啥';
			placeholder = '补充描述（选填）';
			tip = '多久后关闭';
			// note = '*当前位置1km范围可被发现';
		} else if (type == 2) {
			placeholder1 = '你要交易什么物品？';
			placeholder2 = '请输入价格';
			placeholder = '型号？几成新？怎么交付？等详细描述（选填）';
			tip = '多久后关闭';
			// note = '*当前位置10km范围可被发现';
		} else if (type == 3) {
			placeholder = '你想留下点什么';
			tip = '多久后公开';
			// note = '*当前位置200m范围可被发现';
		}

		return (
			<View style={styles.container}>
				{(placeholder1 || placeholder2) && this._renderLine1Input(placeholder1, placeholder2)}
				{(placeholder1 || placeholder2) && <View style={{ height: 10 }} />}
				{this._renderLine2Input(placeholder)}
				{type != 1 && <View style={{ height: 10 }} />}
				{type != 1 && this._renderImageAdd()}
				<View style={{ height: 30 }} />
				{this._renderTimer(tip)}
				<View style={{ height: 10 }} />
				{this._renderAddress()}
			</View>
		);
	}
}
function mapStateToProps(state) {
	return {
		spark: state
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({ ...actions }, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Publish);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
		justifyContent: 'flex-start',
		paddingHorizontal: 15,
		paddingTop: 15
	},
	title: {
		marginBottom: 20,
		color: '#333',
		fontSize: 20,
		textAlign: 'center'
	},
	inputField: {
		height: 36,
		paddingLeft: 15,
		color: '#454545',
		fontSize: 14,
		backgroundColor: '#F6F6F6',
		borderRadius: 18
	},
	input2Field: {
		minHeight: 80,
		paddingLeft: 15,
		color: '#454545',
		fontSize: 14,
		backgroundColor: '#F6F6F6',
		borderRadius: 4,
		textAlignVertical: 'top'
	},
	imgsItem: {
		width: 70,
		height: 70,
		backgroundColor: '#F6F6F6',
		borderRadius: 2,
		marginBottom: 12,
		marginRight: 12
	},
	imgsItem_img: {
		width: 70,
		height: 70
	},
	imgsItem_delete: {
		width: 20,
		height: 20
	},
	timeItem: {}
});
