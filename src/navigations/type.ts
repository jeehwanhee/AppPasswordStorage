import { Buffer } from '@craftzdog/react-native-buffer';

export type MainStackParamList = {
  "Login": undefined;
  "Site": {masterKey: string, item: {siteId: string, iv: string, payload: string, updatedAt: string, siteName: string}};
  "sideBar": undefined;

  "Signup": undefined;
  "ConfirmPW": {password: string};
  "Main": {masterKey: string};
  "SiteMod": {masterKey: string, item?: {siteId: string, iv: string, payload: string, updatedAt: string, siteName: string}};
  //Chat: { roomID: string }; 
};