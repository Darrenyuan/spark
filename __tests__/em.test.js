/**
 * @format
 */

import React from 'react';
// import LoginEnterInfo from '../app/pages/user/LoginEnterInfo';
// Note: test renderer must be required after react-native.
import axios from 'axios';
import renderer from 'react-test-renderer';

// Note: test renderer must be required after react-native.
import LoginEnterInfo from '../app/pages/user/LoginEnterInfo';

test('renders correctly', () => {
	const tree = renderer.create(<LoginEnterInfo />).toJSON();
	expect(tree).toMatchSnapshot();
});

describe('Testing LoginEnterInfo component', () => {
	it('renders as expected', () => {
		As;
		console.log('enter render');
		// const tree = renderer.create(<LoginEnterInfo />).toJSON();
		// expect(tree).toMatchSnapshot();
		axios
			.get(
				'http://restapi.amap.com/v3/geocode/regeo?key=97c933e33025b3843b40016900074704&location=114.4297976345486,30.5044091796875&radius=1000&extensions=all&batch=false&roadlevel=0',
			)
			.then(res => {
				console.log(JSON.stringify(res));
			});
		console.log('after render');
		// expect(4).toBeTruthy();
	});
});
