// in __mocks__/
// Jest file stub
jest.mock('rn-fetch-blob', () => {
  return {
    fs: {
      dirs: {
        DocumentDir: '',
      },
      writeFile: () => Promise.resolve(),
    },
  };
});
jest.mock('react-native-wechat', () => {
  return {
    registerApp: () => {},
  };
});
module.exports = 'test-file-stub';
