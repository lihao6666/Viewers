import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SwiperCore, {
  A11y,
  Controller,
  Navigation,
  Pagination,
  Scrollbar,
} from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useViewportGrid } from '@ohif/ui';

import { PanelService, ServicesManager, Types } from '@ohif/core';
import LegacyButton from '../LegacyButton';
import Icon from '../Icon';
import IconButton from '../IconButton';
import Tooltip from '../Tooltip';

import 'swiper/css';
import 'swiper/css/navigation';
// import './style.css';

const borderSize = 4;
const expandedWidth = 248;
const collapsedWidth = 25;

const baseStyle = {
  maxWidth: `${expandedWidth}px`,
  width: `${expandedWidth}px`,
};

const collapsedHideWidth = expandedWidth - collapsedWidth - borderSize;
const styleMap = {
  open: {
    left: { marginLeft: '0px' },
    right: { marginRight: '0px' },
  },
  closed: {
    left: { marginLeft: `-${collapsedHideWidth}px` },
    right: { marginRight: `-${collapsedHideWidth}px` },
  },
};

const outLayerBaseClasses = 'transition-all duration-300 ease-in-out h-100 bg-black overflow-hidden';

// const baseClasses = 'transition-all duration-300 ease-in-out h-100 bg-black border-black justify-start box-content flex flex-col';

const panelMap = {
  left: `mr-1`,
  right: `ml-1`,
};

const classesMap = {
  open: {
    left: `mr-1`,
    right: `ml-1`,
  },
  closed: {
    left: `mr-1 items-end`,
    right: `ml-1 items-start`,
  },
};

const openStateIconName = {
  left: 'push-left',
  right: 'push-right',
};

const position = {
  left: {
    right: 5,
  },
  right: {
    left: 5,
  },
};

const SidePanel = ({
  servicesManager,
  side,
  className,
  activeTabIndex: activeTabIndexProp,
  tabs,
}) => {
  const panelService: PanelService = servicesManager?.services?.panelService;

  const [viewportState] = useViewportGrid();
  const { t } = useTranslation('SidePanel');
  // Tracks whether this SidePanel has been opened at least once since this SidePanel was inserted into the DOM.
  // Thus going to the Study List page and back to the viewer resets this flag for a SidePanel.
  const [hasBeenOpened, setHasBeenOpened] = useState(activeTabIndexProp !== null);
  const [panelOpen, setPanelOpen] = useState(activeTabIndexProp !== null);
  const [activeTabIndex, setActiveTabIndex] = useState(activeTabIndexProp ?? 0);
  const swiperRef = useRef() as any;
  const [swiper, setSwiper] = useState<any>();
  const prevRef = React.useRef();
  const nextRef = React.useRef();
  const openStatus = panelOpen ? 'open' : 'closed';
  const style = Object.assign({}, styleMap[openStatus][side], baseStyle);

  const ActiveComponent = tabs[activeTabIndex].content;

  useEffect(() => {
    if (panelOpen && swiper) {
      swiper.slideTo(activeTabIndex, 500);
    }
  }, [panelOpen, swiper]);
  
  useEffect(() => {
    if (swiper) {
      swiper.params.navigation.prevEl = prevRef.current;
      swiper.params.navigation.nextEl = nextRef.current;
      swiper.navigation.init();
      swiper.navigation.update();
    }
  }, [swiper]);

  const panelOpened = useMemo(() => {
    const openField = `${side}PanelOpen`;
    return viewportState[openField];
  }, [side, viewportState]);

  // const updatePanelOpen = useCallback((panelOpen: boolean) => {
  //   setPanelOpen(panelOpen);
  //   if (panelOpen) {
  //     setHasBeenOpened(true);
  //   }
  // }, []);

  const updateActiveTabIndex = useCallback((activeTabIndex: number) => {
    setActiveTabIndex(activeTabIndex);
    setHasBeenOpened(true);
  }, []);

  useEffect(() => {
    if (panelService) {
      const activatePanelSubscription = panelService.subscribe(
        panelService.EVENTS.ACTIVATE_PANEL,
        (activatePanelEvent: Types.ActivatePanelEvent) => {
          if (!hasBeenOpened || activatePanelEvent.forceActive) {
            const tabIndex = tabs.findIndex(
              tab => tab.id === activatePanelEvent.panelId
            );
            if (tabIndex !== -1) {
              updateActiveTabIndex(tabIndex);
            }
          }
        }
      );

      return () => {
        activatePanelSubscription.unsubscribe();
      };
    }
  }, [tabs, panelService]);
  // }, [tabs, hasBeenOpened, panelService, updateActiveTabIndex]);

  const getCloseStateComponent = () => {
    const _childComponents = Array.isArray(tabs) ? tabs : [tabs];
    return (
      <>
        <div
          className={classnames(
            'bg-secondary-dark h-[28px] flex items-center w-full rounded-md cursor-pointer',
            side === 'left' ? 'pr-2 justify-end' : 'pl-2 justify-start'
          )}
          onClick={() => {
            updatePanelOpen(prev => !prev);
          }}
          data-cy={`side-panel-header-${side}`}
        >
          <Icon
            name={'navigation-panel-right-reveal'}
            className={classnames(
              'text-primary-active',
              side === 'left' && 'transform rotate-180'
            )}
          />
        </div>
        <div className={classnames('flex flex-col space-y-3 mt-3')}>
          {_childComponents.map((childComponent, index) => (
            <Tooltip
              position={side === 'left' ? 'right' : 'left'}
              key={index}
              content={`${childComponent.label}`}
              className={classnames(
                'flex items-center',
                side === 'left' ? 'justify-end ' : 'justify-start '
              )}
            >
              <IconButton
                id={`${childComponent.name}-btn`}
                variant="text"
                color="inherit"
                size="initial"
                className="text-primary-active"
                onClick={() => {
                  updateActiveTabIndex(index);
                }}
              >
                <Icon
                  name={childComponent.iconName}
                  className="text-primary-active"
                  style={{
                    width: '22px',
                    height: '22px',
                  }}
                />
              </IconButton>
            </Tooltip>
          ))}
        </div>
      </>
    );
  };

  return (
    <div
      className={classnames(className, outLayerBaseClasses)}
      style={{ width: panelOpened ? 252 : 0 }}
    >
      <div
        className={classnames(
          'h-full bg-black justify-start box-content flex flex-col pl-1 pr-1 pt-1',
          {
            'items-start': side === 'right',
            // 'pl-1 pr-1 pt-1': side === 'left',
          }
        )}
        style={{width: 252}}
      >
        {tabs.length > 1 &&
          _getMoreThanOneTabLayout(
            swiperRef,
            setSwiper,
            prevRef,
            nextRef,
            tabs,
            activeTabIndex,
            updateActiveTabIndex
          )}
        {tabs.length > 3 && (
          <div className="text-primary-active w-full flex justify-end gap-2 bg-primary-dark py-1 px-2">
            <button ref={prevRef} className="swiper-button-prev-custom">
              <Icon
                name={'icon-prev'}
                className={classnames('text-primary-active')}
              />
            </button>
            <button ref={nextRef} className="swiper-button-next-custom">
              <Icon
                name={'icon-next'}
                className={classnames('text-primary-active')}
              />
            </button>
          </div>
        )}
        <ActiveComponent />
      </div>
    </div>
    
  );
};

SidePanel.defaultProps = {
  defaultComponentOpen: null,
};

SidePanel.propTypes = {
  servicesManager: PropTypes.instanceOf(ServicesManager),
  side: PropTypes.oneOf(['left', 'right']).isRequired,
  className: PropTypes.string,
  activeTabIndex: PropTypes.number,
  tabs: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        iconName: PropTypes.string.isRequired,
        iconLabel: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        content: PropTypes.func, // TODO: Should be node, but it keeps complaining?
      })
    ),
  ]),
};

function _getMoreThanOneTabLayout(
  swiperRef: any,
  setSwiper: React.Dispatch<any>,
  prevRef: React.MutableRefObject<undefined>,
  nextRef: React.MutableRefObject<undefined>,
  tabs: any,
  activeTabIndex: any,
  updateActiveTabIndex
) {
  return (
    <div
      className="flex-static collapse-sidebar w-full relative"
      style={{
        backgroundColor: '#06081f',
      }}
    >
      <div className="w-full">
        <Swiper
          onInit={(core: SwiperCore) => {
            swiperRef.current = core.el;
          }}
          simulateTouch={false}
          modules={[Navigation, Pagination, Scrollbar, A11y, Controller]}
          slidesPerView={3}
          spaceBetween={5}
          onSwiper={swiper => setSwiper(swiper)}
          navigation={{
            prevEl: prevRef?.current,
            nextEl: nextRef?.current,
          }}
        >
          {tabs.map((obj, index) => (
            <SwiperSlide key={index}>
              <div
                className={classnames(
                  index === activeTabIndex
                    ? 'bg-secondary-main text-white'
                    : 'text-aqua-pale',
                  'flex cursor-pointer px-4 py-1 rounded-[4px]  flex-col justify-center items-center text-center hover:text-white'
                )}
                key={index}
                onClick={() => {
                  updateActiveTabIndex(index);
                }}
                data-cy={`${obj.name}-btn`}
              >
                <span>
                  <Icon
                    name={obj.iconName}
                    className={classnames(
                      index === activeTabIndex
                        ? 'text-white'
                        : 'text-primary-active'
                    )}
                    style={{
                      width: '22px',
                      height: '22px',
                    }}
                  />
                </span>
                <span className="text-[10px] select-none font-medium whitespace-nowrap mt-[5px] w-[100px]">
                  {obj.label}
                </span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default SidePanel;
