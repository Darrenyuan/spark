import React from 'react';
import LoginEnterInfo from '../app/pages/user/LoginEnterInfo';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

describe('Testing LoginEnterInfo component', () => {
  it('renders as expected', () => {
    console.log('enter render');
    const tree = renderer.create(<LoginEnterInfo />).toJSON();
    expect(tree).toMatchSnapshot();
    console.log('after render');
    // expect(4).toBeTruthy();
  });
});
