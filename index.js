/**
 * @format
 */
import { Buffer } from 'buffer';

// 전역(global) 객체에 Buffer를 등록합니다.
global.Buffer = global.Buffer || Buffer;

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
