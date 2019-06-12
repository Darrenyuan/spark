import React,  {Component }from 'react'; 
import Login from '../../screens/Login'; 
import {DeviceEventEmitter }from 'react-native'; 
export default function withLogin(WrappedComponent) {
return class extends Component {
componentDidMount() {
let _this = this; 
this.subscription = DeviceEventEmitter.addListener('forceLogout', function(event) {
if (event.expire) {
_this.props.actions.logout(); 
_this.props.navigation.navigate('loginStack'); 
}
}); 
}
componentWillUnmount() {
this.subscription.remove(); 
}
componentWillReceiveProps(nextProps) {
console.log('Current props: ', this.props); 
console.log('Next props: ', nextProps); 
}
render() {
if (this.props.monitor.loginData)return < WrappedComponent {...this.props}/> ; 
else return < Login {...this.props}/> ; 
}
}; 
}
