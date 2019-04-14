import React from 'react'
import {
	View,
	Text,
	TouchableOpacity
} from 'react-native'
import {SearchBar} from 'react-native-elements'
import {Select} from 'teaset'
import styleUtil from "../../common/styleUtil";

export default class SearchView extends React.Component {
	static defaultProps = {
		selectValue:'题目',
		showSelectValue:true
	};
	
	constructor(props) {
		super(props)
		this.items = [
			'题目',
			'会话',
			'好友',
		];
	}
	clearText = () => {
		this.searchView.clearText();
	};
	
	blur = () => {
		this.searchView.blur();
	};
	
	cancel = (callback) => {
		this.searchView.clearText();
		this.searchView.blur();
		callback && callback()
	};
	
	render() {
		const {
			isSearch,
			onChangeText,
			onFocus,
			onCancel,
			onClearText,
			onSubmit,
			showSelectValue
		} = this.props;
		let leftWidth = showSelectValue ? 60 : 0;
		return (
			<View style={{
				flexDirection: 'row',
				alignItems: 'center',
				// justifyContent:'space-around'
			}}>
				<SearchBar
					ref={search => this.searchView = search}
					lightTheme
					returnKeyType={'search'}
					containerStyle={[{
						backgroundColor: 'transparent',
						borderBottomWidth: 0,
						borderTopWidth: 0,
					}, {
						width: styleUtil.window.width
					}]}
					inputStyle={{
						backgroundColor: '#fff'
					}}
					icon={{type: 'font-awesome', name: 'search'}}
					onChangeText={onChangeText && onChangeText}
					onClearText={onClearText && onClearText}
					placeholder='搜索'
					onFocus={onFocus && onFocus}
					blurOnSubmit={true}
					onSubmitEditing={onSubmit}
					maxLength={20}
				/>
				{
					isSearch && <TouchableOpacity
						onPress={_ => this.cancel(onCancel)}>
						<Text style={{
							color: '#4F94CD',
							fontWeight: 'bold',
							fontSize: 16
						}}>取消</Text>
					</TouchableOpacity>
				}
			</View>
		)
	}
}