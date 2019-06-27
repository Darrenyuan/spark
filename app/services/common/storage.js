import storageUtil from '../../common/storageUtil';
import initialState from '../redux/initialState';

export const loadState = () => {
  try {
    let state = storageUtil.getItem('state');
    return state;
  } catch (err) {
    return undefined;
  }
};

export const saveState = state => {
  try {
    storageUtil.setItem('state', state);
  } catch (err) {
    // ignore
  }
};
