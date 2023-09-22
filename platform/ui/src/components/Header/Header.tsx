import React, { ReactNode, useEffect, useRef } from 'react';
import Swiper from 'swiper';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { useDeviceInfo } from '@state';
import NavBar from '../NavBar';
import Svg from '../Svg';
import Icon from '../Icon';
import IconButton from '../IconButton';
import Dropdown from '../Dropdown';

import './index.css';

function Header({
  children,
  menuOptions,
  isReturnEnabled,
  onClickReturnButton,
  isSticky,
  WhiteLabeling,
  commandsManager,
  ...props
}): ReactNode {
  const { t } = useTranslation('Header');
  const toolRowRef = useRef<any>(null);
  const toolRowSwiper = useRef<any>(null);
  const { deviceInfo } = useDeviceInfo();

  // TODO: this should be passed in as a prop instead and the react-router-dom
  // dependency should be dropped
  const onClickReturn = () => {
    if (isReturnEnabled && onClickReturnButton) {
      onClickReturnButton();
    }
  };

  const toggleOpenSeriesPanel = (event: any, side) => {
    event.preventDefault();
    // eslint-disable-next-line react/prop-types
    commandsManager.runCommand('toggleOpenPanel', { side });
  };

  useEffect(() => {
    toolRowSwiper.current = new Swiper(toolRowRef.current, {
      direction: 'horizontal',
      slidesPerView: 'auto',
      freeMode: true,
      noSwipingSelector: '#layoutChooser-dropdown-menu, #toolbar-slider, input',
      roundLengths: true,
      scrollbar: false,
    });
    return () =>
      toolRowSwiper.current && toolRowSwiper.current.destroy(true, true);
  }, []);

  useEffect(() => {
    toolRowSwiper.current.update(true);
  }, [children]);

  return (
    <NavBar
      // className="justify-between border-b-4 border-black"
      className="justify-between border-black"
      isSticky={isSticky}
    >
      {/* justify-between */}
      <div className="flex flex-1 items-center h-full">
        <div className="flex h-full bg-secondary-dark relative z-10">
          {/* // TODO: Should preserve filter/sort
              // Either injected service? Or context (like react router's `useLocation`?) */}
          <div
            className={classNames(
              'inline-flex items-center h-full pr-3 pl-1',
              isReturnEnabled && 'cursor-pointer'
            )}
            onClick={onClickReturn}
          >
            {isReturnEnabled && (
              <Icon name="chevron-left" className="w-8 text-primary-active" />
            )}
            <div className="flex items-center h-full">
              {WhiteLabeling?.createLogoComponentFn?.(React, {
                ...props,
                deviceInfo,
              })}
              {/* <a
                onClick={event => toggleOpenSeriesPanel(event, 'left')}
                className="flex items-center m-2 justify-center h-8 text-white w-8 text-2xl opacity-85"
              >
                <Icon name="series-panel" />
              </a> */}
              <IconButton
                id={'options-mark-panel-icon'}
                variant="text"
                color="inherit"
                size="initial"
                style={{ padding: 10 }}
                onClick={event => toggleOpenSeriesPanel(event, 'left')}
                className="text-center items-center justify-center text-xl transition duration-300 ease-in-out outline-none font-bold focus:outline-none text-white hover:bg-primary-light hover:text-black active:opacity-80 focus:!bg-primary-light focus:text-black rounded-md text-lg inline-flex text-common-bright hover:!bg-primary-dark hover:text-primary-light"
              >
                <Icon name="series-panel" className="w-5 h-5 fill-current" />
              </IconButton>
            </div>
          </div>
        </div>
        {/* <div className="flex items-center">{children}</div> */}
        <div
          className="flex-1 items-center w-full relative z-0"
          style={{ height: 40 }}
        >
          <div
            className="absolute left-0 top-0 swiper swiper-container h-full w-full scroll-swiper-line"
            ref={toolRowRef}
          >
            <div className="swiper-wrapper h-full w-full">
              <div className="swiper-slide h-full auto-width-slide">
                {children}
              </div>
            </div>
          </div>
        </div>
        <div className="flex h-full items-center bg-secondary-dark relative z-10">
          <div className="flex items-center pr-1 pl-3">
            {/* <span className="mr-3 text-lg text-common-light">
              {t('INVESTIGATIONAL USE ONLY')}
            </span> */}
            
            {/* <a
              onClick={event => toggleOpenSeriesPanel(event, 'right')}
              className="flex items-center mr-2 justify-center h-8 text-white w-8 text-2xl opacity-85"
            >
              <Icon name="mark-panel" />
            </a> */}
            <IconButton
              id={'options-mark-panel-icon'}
              variant="text"
              color="inherit"
              size="initial"
              style={{ padding: 10 }}
              onClick={event => toggleOpenSeriesPanel(event, 'right')}
              className="text-center items-center justify-center text-xl transition duration-300 ease-in-out outline-none font-bold focus:outline-none text-white hover:bg-primary-light hover:text-black active:opacity-80 focus:!bg-primary-light focus:text-black rounded-md text-lg inline-flex text-common-bright hover:!bg-primary-dark hover:text-primary-light"
            >
              <Icon name="mark-panel" className="w-5 h-5 fill-current" />
            </IconButton>

            {/* <Dropdown
              id="options"
              showDropdownIcon={false}
              list={menuOptions}
              titleClassName="top-right-setting-item-title"
            >
              <IconButton
                id={'options-settings-icon'}
                variant="text"
                color="inherit"
                size="initial"
                className="text-primary-active"
              >
                <Icon name="settings" />
              </IconButton>
              <IconButton
                id={'options-chevron-down-icon'}
                variant="text"
                color="inherit"
                size="initial"
                className="text-primary-active"
              >
                <Icon name="chevron-down" />
              </IconButton>
            </Dropdown> */}
          </div>
        </div>
      </div>
    </NavBar>
  );
}

Header.propTypes = {
  menuOptions: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      icon: PropTypes.string,
      onClick: PropTypes.func.isRequired,
    })
  ),
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  isReturnEnabled: PropTypes.bool,
  isSticky: PropTypes.bool,
  onClickReturnButton: PropTypes.func,
  WhiteLabeling: PropTypes.object,
};

Header.defaultProps = {
  isReturnEnabled: true,
  isSticky: false,
};

export default Header;
