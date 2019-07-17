/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import codePush from 'react-native-code-push';
import { name as appName } from './app.json';
let codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  installMode: codePush.InstallMode.ON_NEXT_SUSPEND,
  minimumBackgroundDuration: 600,
};
// const wrapper = codePush(codePushOptions)(App);
// codePush.getUpdateMetadata().then(update => {
//   if (update) {
//     console.log('update code push', update.label);
//   }

// if (update) Sentry.setVersion(update.appVersion + '-codepush:' + update.label);
// });
AppRegistry.registerComponent(appName, () => App);
