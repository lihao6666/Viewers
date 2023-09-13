import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import {
  isAndroid,
  isChrome,
  isDesktop,
  isEdge,
  isFirefox,
  isIE,
  isIOS,
  isMacOs,
  isMobile,
  isMobileOnly,
  isMobileSafari,
  isSafari,
  isTablet,
  isWindows,
} from 'react-device-detect';

const deviceInfoContext = createContext(null);
const { Provider: DIProvider } = deviceInfoContext;
export const useDeviceInfo = () => useContext(deviceInfoContext);

export const getDeviceInfo = () => {
  const winWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;

  return {
    isAndroid,
    isChrome,
    isDesktop,
    isEdge,
    isFirefox,
    isIE,
    isIOS,
    isMacOs,
    isMobile,
    isMobileOnly,
    isMobileSafari,
    isSafari,
    isTablet,
    isWindows,
    winWidth,
  };
};

export function DeviceInfoProvider({ children, value: initDeviceInfo }) {
  const [deviceInfo, setDeviceInfo] = useState(initDeviceInfo);
  const prevHandleTemp = useRef<number>(Date.now());

  useEffect(() => {
    const _winResize = () => {
      const currHandleTemp: number = Date.now();
      if (currHandleTemp - prevHandleTemp.current < 200) {
        return;
      }
      const deviceInfo = getDeviceInfo();
      setDeviceInfo(deviceInfo);
      prevHandleTemp.current = Date.now();
    };
    window.addEventListener('resize', _winResize, false);
    return () => {
      window.removeEventListener('resize', _winResize, false);
    };
  }, []);

  return <DIProvider value={{ deviceInfo }}>{children}</DIProvider>;
}

DeviceInfoProvider.propTypes = {
  children: PropTypes.any,
  value: PropTypes.any,
};

export default DeviceInfoProvider;
