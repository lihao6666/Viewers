import { AppConfigProvider, useAppConfig } from './appConfig.tsx';
import {
  DeviceInfoProvider,
  useDeviceInfo,
  getDeviceInfo,
} from './deviceInfo.tsx';

const OHIF_BROADCAST_CHANNEL_NAME = 'OHIF_BROADCAST_CHANNEL_NAME';
export const BROADCAST_EVENT_NAMES = {
  UPLOAD_CAPTURE_IMAGE: 'POST_UPLOAD_IMAGE',
};
export const ohifChannel = new BroadcastChannel(OHIF_BROADCAST_CHANNEL_NAME);
export {
  AppConfigProvider,
  useAppConfig,
  DeviceInfoProvider,
  useDeviceInfo,
  getDeviceInfo,
};
