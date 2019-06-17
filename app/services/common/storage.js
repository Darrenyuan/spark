import storageUtil from '../../common/storageUtil';

export const loadState = () => {
  try {
    return storageUtil.getItem('state');
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
