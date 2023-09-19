import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { vec3 } from 'gl-matrix';
import PropTypes from 'prop-types';
import { metaData, Enums, utilities } from '@cornerstonejs/core';
import { ViewportOverlay } from '@ohif/ui';
import {
  formatPN,
  formatDICOMDate,
  formatDICOMTime,
  formatNumberPrecision,
  isValidNumber,
} from './utils';
import { InstanceMetadata } from 'platform/core/src/types';
import { ServicesManager } from '@ohif/core';
import { ImageSliceData } from '@cornerstonejs/core/dist/esm/types';
import './CustomizableViewportOverlay.css';

type anyObj = {
  [key: string]: any;
};

const EPSILON = 1e-4;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const tagNames = {
  '(0010,0010)': 'PatientName', // 姓名
  '(0010,0040)': 'PatientSex', // 性别
  '(0010,1010)': 'PatientAge', // 年龄
  '(0020,0013)': 'InstanceNumber', //
  '(0010,0020)': 'PatientID', // 病人id
  '(0018,0015)': 'BodyPartExamined', // 部位
  '(0008,0070)': 'Manufacturer', // 医院名称
  '(0008,0080)': 'InstitutionName', // 产品型号
  '(0008,0021)': 'SeriesDate', // 序列生成日期
  '(0008,0031)': 'SeriesTime', // 序列生成时间
  '(0020,0011)': 'SeriesNumber', // 序列号
  '(0008,103E)': 'SeriesDescription',
  '(0018,9087)': 'DiffusionBValue',
  '(0028,1050)': 'WindowCenter',
  '(0028,1051)': 'WindowWidth',
  '(0018,1310)': 'AcquisitionMatrix',
  '(0018,0080)': 'RepetitionTime',
  '(0018,0081)': 'EchoTime',
  '(0018,0083)': 'NumberOfAverages',
  '(0018,0088)': 'SpacingBetweenSlices',
  '(0028,0010)': 'Rows',
  '(0028,0011)': 'Columns',
};
// 右上角
const RightTopTags = [
  {
    tag: '(0008,0080)',
    sort: 1,
  },
  {
    tag: '(0008,0070)',
    sort: 2,
  },
  {
    tag: '(0008,0021)',
    valMethod: 'seriesDate',
    sort: 3,
  },
  {
    tag: '(0008,0031)',
    valMethod: 'seriesTime',
  },
  {
    tag: '(0020,0011)',
    showLabel: true,
    sort: 4,
  },
];
// 左上角
const LeftTopTags = [
  {
    tag: '(0010,0010)',
    sort: 0,
  },
  {
    tag: '(0010,0040)',
    valMethod: 'sex',
  },
  {
    tag: '(0010,1010)',
    valMethod: 'numberInt',
  },
  {
    tag: '(0010,0020)',
    sort: 1,
  },
  {
    tag: '(0018,0015)',
    sort: 2,
  },
];
// 右下角
const RightBottomTags = [
  {
    tag: '(0018,1310)',
    showLabel: true,
    label: 'MAT',
    valMethod: 'mat',
  },
];
// 左下角
const LeftBottomTags = [
  {
    tag: '(0008,103E)',
    sort: 0,
  },
  {
    tag: '(0018,0080)',
    label: 'TR',
    showLabel: true,
    sort: 1,
  },
  {
    tag: '(0018,0081)',
    label: 'TE',
  },
  {
    tag: '(0018,0083)',
    label: 'NEX',
    showLabel: true,
    sort: 2,
  },
  {
    tag: '(0018,0088)',
    label: 'THK',
    showLabel: true,
    sort: 3,
    unit: 'mm',
  },
  {
    tag: '(0018,9087)',
    label: 'B',
    showLabel: true,
    sort: 4,
  },
  {
    tag: '(0028,0010)',
    label: 'Size',
    showLabel: true,
    sort: 5,
  },
  {
    tag: '(0028,0011)',
    label: '',
  },
  // {
  //   tag: '(0018,0088)',
  //   label: 'Spacing',
  //   sort: 6,
  //   showLabel: true,
  // },
];

const tagValFormats = {
  // 序列时间
  seriesTime: time => {
    if (!time) {
      return;
    }
    const hour = time.slice(0, 2) || '-';
    const minute = time.slice(2, 4) || '-';
    const second = time.slice(4, 6) || '-';
    return `${hour}:${minute}:${second}`;
  },
  mat: matValStr => {
    if (!matValStr) {
      return undefined;
    }
    const splitAry = matValStr.replaceAll('0\\', '').split('\\');
    const [num1, num2] = splitAry;

    if (num1 !== undefined && num2 !== undefined) {
      return `${num1} x ${num2}`;
    }
    return undefined;
  },
  sex: value => {
    if (value === undefined || value === '') {
      return;
    }
    if (value.startsWith('F') || value.startsWith('f') || value - 0 === 0) {
      return '女';
    }
    if (value.startsWith('M') || value.startsWith('m') || value - 0 === 1) {
      return '男';
    }
    return value;
  },
  numberInt: value => parseInt(value),
  seriesDate: date => {
    if (!date) {
      return;
    }
    const year = date.slice(0, 4) || '-';
    const month = date.slice(4, 6) || '-';
    const day = date.slice(6) || '-';
    return `${year}-${month}-${day}`;
  },
};

// 重tag列表中读取 tag信息
const readTagsMap = (targetTags, dicomTagList) => {
  const currentTagValues = targetTags.reduce((memo, current) => {
    const { valMethod, ...rest } = current;
    const currentTagInfo = dicomTagList.find(
      (dicomTag = []) => dicomTag[0] === current.tag
    );
    if (currentTagInfo) {
      const [tagPos, label, tagName, value] = currentTagInfo;
      memo[tagPos] = {
        label,
        tagName,
        value: tagValFormats[valMethod]
          ? tagValFormats[valMethod](value)
          : value,
        ...rest,
      };
    }
    return memo;
  }, {});
  Object.keys(currentTagValues).forEach(key => {
    const valueMaps = currentTagValues[key];
    if (!valueMaps || valueMaps.value === undefined) {
      delete currentTagValues[key];
    }
  });
  return currentTagValues;
};

// 拼接
const joinTagsInfo = (joinTags, currentTagValues, symbols = '|') => {
  joinTags.forEach((combineTags, index) => {
    const symbolArray = symbols.split(',');
    const symbol = symbolArray[index] || symbolArray[0];
    const combineNames = combineTags.join(symbol);
    const combinedInfo = {};
    for (let i = 0; i < combineTags.length; i++) {
      const currentTag = combineTags[i];
      const itemTabInfo = currentTagValues[currentTag];
      if (itemTabInfo) {
        Object.keys(itemTabInfo).forEach(key => {
          if (!combinedInfo[key]) {
            combinedInfo[key] = itemTabInfo[key];
          } else {
            if (itemTabInfo[key]) {
              combinedInfo[
                key
              ] = `${combinedInfo[key]}${symbol}${itemTabInfo[key]}`;
            }
          }
        });
      }
      delete currentTagValues[currentTag];
    }
    currentTagValues[combineNames] = combinedInfo;
  });
  const rightTopInfos = Object.entries(currentTagValues).map(
    ([key, value]: any) => value
  );
  rightTopInfos.sort((v1, v2) => v1.sort - v2.sort);
  return rightTopInfos;
};

interface OverlayItemProps {
  element: anyObj;
  viewportData: anyObj;
  imageSliceData: ImageSliceData;
  viewportIndex: number | null;
  servicesManager: ServicesManager;
  instance: InstanceMetadata;
  customization: anyObj;
  formatters: {
    formatPN: (val) => string;
    formatDate: (val) => string;
    formatTime: (val) => string;
    formatNumberPrecision: (val, number) => string;
  };

  // calculated values
  voi: {
    windowWidth: number;
    windowCenter: number;
  };
  instanceNumber?: number;
  scale?: number;
}

/**
 * Window Level / Center Overlay item
 */
function VOIOverlayItem({ voi, customization }: OverlayItemProps) {
  const { windowWidth, windowCenter } = voi;
  if (typeof windowCenter !== 'number' || typeof windowWidth !== 'number') {
    return null;
  }

  return (
    <div
      className="overlay-item flex flex-row"
      style={{ color: (customization && customization.color) || undefined }}
    >
      <span className="mr-1 shrink-0">W:</span>
      <span className="ml-1 mr-2 font-light shrink-0">
        {windowWidth.toFixed(0)}
      </span>
      <span className="mr-1 shrink-0">L:</span>
      <span className="ml-1 font-light shrink-0">
        {windowCenter.toFixed(0)}
      </span>
    </div>
  );
}

/**
 * Zoom Level Overlay item
 */
function ZoomOverlayItem({ scale, customization }: OverlayItemProps) {
  return (
    <div
      className="overlay-item flex flex-row"
      style={{ color: (customization && customization.color) || undefined }}
    >
      <span className="mr-1 shrink-0">Zoom:</span>
      <span className="font-light">{scale.toFixed(2)}x</span>
    </div>
  );
}

/**
 * Instance Number Overlay Item
 */
function InstanceNumberOverlayItem({
  instanceNumber,
  imageSliceData,
  customization,
}: OverlayItemProps) {
  const { imageIndex, numberOfSlices } = imageSliceData;

  return (
    <div
      className="overlay-item flex flex-row"
      style={{ color: (customization && customization.color) || undefined }}
    >
      <span className="mr-1 shrink-0">I:</span>
      <span className="font-light">
        {instanceNumber !== undefined && instanceNumber !== null
          ? `${instanceNumber} (${imageIndex + 1}/${numberOfSlices})`
          : `${imageIndex + 1}/${numberOfSlices}`}
      </span>
    </div>
  );
}

/**
 * Customizable Viewport Overlay
 */
function CustomizableViewportOverlay({
  element,
  viewportData,
  imageSliceData,
  viewportIndex,
  servicesManager,
}) {
  const {
    toolbarService,
    cornerstoneViewportService,
    customizationService,
    ParseTagsService,
    displaySetService,
  } = servicesManager.services as anyObj;
  const [voi, setVOI] = useState({ windowCenter: null, windowWidth: null });
  const [scale, setScale] = useState(1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeTools, setActiveTools] = useState([]);
  const { imageIndex } = imageSliceData;
  const displaySets = displaySetService.activeDisplaySets;

  // const topLeftCustomization = customizationService.getModeCustomization(
  //   'cornerstoneOverlayTopLeft'
  // );
  // const topRightCustomization = customizationService.getModeCustomization(
  //   'cornerstoneOverlayTopRight'
  // );
  // const bottomLeftCustomization = customizationService.getModeCustomization(
  //   'cornerstoneOverlayBottomLeft'
  // );
  // const bottomRightCustomization = customizationService.getModeCustomization(
  //   'cornerstoneOverlayBottomRight'
  // );

  const instance = useMemo(() => {
    if (viewportData != null) {
      return _getViewportInstance(viewportData, imageIndex);
    } else {
      return null;
    }
  }, [viewportData, imageIndex]);

  const instanceNumber = useMemo(() => {
    if (viewportData != null) {
      return _getInstanceNumber(
        viewportData,
        viewportIndex,
        imageIndex,
        cornerstoneViewportService
      );
    }
    return null;
  }, [viewportData, viewportIndex, imageIndex, cornerstoneViewportService]);

  const dicomTagList = useMemo(() => {
    const selectedDisplaySetInstanceUID = ((viewportData || {}).data || {})
      .displaySetInstanceUID;
    const activeDisplaySet = displaySets.find(displaySet => {
      return displaySet.displaySetInstanceUID === selectedDisplaySetInstanceUID;
    });
    if (!activeDisplaySet || instanceNumber === undefined) {
      return [];
    }
    const tagRows = ParseTagsService.getDicomTags(
      activeDisplaySet,
      instanceNumber
    );
    return tagRows;
  }, [instanceNumber, viewportData]);
  /**
   * Initial toolbar state
   */
  useEffect(() => {
    setActiveTools(toolbarService.getActiveTools());
  }, []);

  /**
   * Updating the VOI when the viewport changes its voi
   */
  useEffect(() => {
    const updateVOI = eventDetail => {
      const { range } = eventDetail.detail;

      if (!range) {
        return;
      }

      const { lower, upper } = range;
      const { windowWidth, windowCenter } = utilities.windowLevel.toWindowLevel(
        lower,
        upper
      );

      setVOI({ windowCenter, windowWidth });
    };

    element.addEventListener(Enums.Events.VOI_MODIFIED, updateVOI);

    return () => {
      element.removeEventListener(Enums.Events.VOI_MODIFIED, updateVOI);
    };
  }, [viewportIndex, viewportData, voi, element]);

  /**
   * Updating the scale when the viewport changes its zoom
   */
  useEffect(() => {
    const updateScale = eventDetail => {
      const { previousCamera, camera } = eventDetail.detail;

      if (
        previousCamera.parallelScale !== camera.parallelScale ||
        previousCamera.scale !== camera.scale
      ) {
        const viewport = cornerstoneViewportService.getCornerstoneViewportByIndex(
          viewportIndex
        );

        if (!viewport) {
          return;
        }

        const imageData = viewport.getImageData();

        if (!imageData) {
          return;
        }

        if (camera.scale) {
          setScale(camera.scale);
          return;
        }

        const { spacing } = imageData;
        // convert parallel scale to scale
        const scale =
          (element.clientHeight * spacing[0] * 0.5) / camera.parallelScale;
        setScale(scale);
      }
    };

    element.addEventListener(Enums.Events.CAMERA_MODIFIED, updateScale);

    return () => {
      element.removeEventListener(Enums.Events.CAMERA_MODIFIED, updateScale);
    };
  }, [viewportIndex, viewportData, cornerstoneViewportService, element]);

  /**
   * Updating the active tools when the toolbar changes
   */
  // Todo: this should act on the toolGroups instead of the toolbar state
  useEffect(() => {
    const { unsubscribe } = toolbarService.subscribe(
      toolbarService.EVENTS.TOOL_BAR_STATE_MODIFIED,
      () => {
        setActiveTools(toolbarService.getActiveTools());
      }
    );

    return () => {
      unsubscribe();
    };
  }, [toolbarService]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _renderOverlayItem = useCallback(
    item => {
      const overlayItemProps: OverlayItemProps = {
        element,
        viewportData,
        imageSliceData,
        viewportIndex,
        servicesManager,
        customization: item,
        formatters: {
          formatPN: formatPN,
          formatDate: formatDICOMDate,
          formatTime: formatDICOMTime,
          formatNumberPrecision: formatNumberPrecision,
        },
        instance,
        // calculated
        voi,
        scale,
        instanceNumber,
      };

      if (item.customizationType === 'ohif.overlayItem.windowLevel') {
        return <VOIOverlayItem {...overlayItemProps} />;
      } else if (item.customizationType === 'ohif.overlayItem.zoomLevel') {
        return <ZoomOverlayItem {...overlayItemProps} />;
      } else if (item.customizationType === 'ohif.overlayItem.instanceNumber') {
        return <InstanceNumberOverlayItem {...overlayItemProps} />;
      } else {
        const renderItem = customizationService.transform(item);

        if (typeof renderItem.content === 'function') {
          return renderItem.content(overlayItemProps);
        }
      }
    },
    [
      element,
      viewportData,
      imageSliceData,
      viewportIndex,
      servicesManager,
      customizationService,
      instance,
      voi,
      scale,
      instanceNumber,
    ]
  );
  // 左上方
  const getTopLeftContent = useCallback(() => {
    const currentTagValues = readTagsMap(LeftTopTags, dicomTagList);
    const leftTopInfos = joinTagsInfo(
      [['(0010,0010)', '(0010,0040)', '(0010,1010)']],
      currentTagValues,
      '/'
    );
    return leftTopInfos.map(({ label, value, showLabel }, i) => (
      <div key={`topLeftOverlayItem_${i}`}>
        {showLabel ? `${label}:` : ''} {value}
      </div>
    ));
  }, [dicomTagList]);
  // const getTopLeftContent = useCallback(() => {
  //   const items = topLeftCustomization?.items || [
  //     {
  //       id: 'WindowLevel',
  //       customizationType: 'ohif.overlayItem.windowLevel',
  //     },
  //   ];
  //   return (
  //     <>
  //       {items.map((item, i) => (
  //         <div key={`topLeftOverlayItem_${i}`}>{_renderOverlayItem(item)}</div>
  //       ))}
  //     </>
  //   );
  // }, [topLeftCustomization, _renderOverlayItem]);

  // 右上角
  const getTopRightContent = useCallback(() => {
    const currentTagValues = readTagsMap(RightTopTags, dicomTagList);
    const rightTopInfos = joinTagsInfo(
      [['(0008,0021)', '(0008,0031)']],
      currentTagValues,
      ' '
    );
    return rightTopInfos.map(({ label, value, showLabel }, i) => (
      <div key={`topRightOverlayItem_${i}`}>
        {showLabel ? `${label}:` : ''} {value}
      </div>
    ));
  }, [dicomTagList]);
  // const getTopRightContent = useCallback(() => {
  //   const items = topRightCustomization?.items || [
  //     {
  //       id: 'InstanceNmber',
  //       customizationType: 'ohif.overlayItem.instanceNumber',
  //     },
  //   ];
  //   return (
  //     <>
  //       {items.map((item, i) => (
  //         <div key={`topRightOverlayItem_${i}`}>{_renderOverlayItem(item)}</div>
  //       ))}
  //     </>
  //   );
  // }, [topRightCustomization, _renderOverlayItem]);

  // 左下角
  const getBottomLeftContent = useCallback(() => {
    const currentTagValues = readTagsMap(LeftBottomTags, dicomTagList);
    const leftBottomInfos = joinTagsInfo(
      [
        ['(0018,0080)', '(0018,0081)'],
        ['(0028,0010)', '(0028,0011)'],
      ],
      currentTagValues,
      '/,x'
    );
    let imagePlaneModule: anyObj = {};
    let cineModule: anyObj = {};
    if (instance && instance.imageId) {
      imagePlaneModule =
        metaData.get('imagePlaneModule', instance.imageId) || {};
      cineModule = metaData.get('cineModule', instance.imageId) || {};
    }
    const { sliceLocation, sliceThickness } = imagePlaneModule || {};
    const { frameTime } = cineModule || {};
    const frameRate: number = formatNumberPrecision(1000 / frameTime, 1);

    return (
      <>
        {leftBottomInfos.map(({ label, value, showLabel, unit }, i) => (
          <div key={`bottomLeftOverlayItem_${i}`}>
            {showLabel ? `${label}:` : ''} {value} {unit ? unit : ''}
          </div>
        ))}
        <div>
          {frameRate >= 0 ? `${formatNumberPrecision(frameRate, 2)} FPS` : ''}
        </div>
        <div>
          {isValidNumber(sliceLocation)
            ? `Loc: ${formatNumberPrecision(sliceLocation, 2)} mm `
            : ''}
          {isValidNumber(sliceThickness)
            ? `Thick: ${formatNumberPrecision(sliceThickness, 2)} mm`
            : ''}
        </div>
      </>
    );
  }, [
    element,
    viewportData,
    imageSliceData,
    viewportIndex,
    servicesManager,
    customizationService,
    instance,
    voi,
    scale,
    instanceNumber,
    dicomTagList,
  ]);
  // const getBottomLeftContent = useCallback(() => {
  //   const items = bottomLeftCustomization?.items || [];
  //   return (
  //     <>
  //       {items.map((item, i) => (
  //         <div key={`bottomLeftOverlayItem_${i}`}>
  //           {_renderOverlayItem(item)}
  //         </div>
  //       ))}
  //     </>
  //   );
  // }, [bottomLeftCustomization, _renderOverlayItem]);

  // 右下角
  const getBottomRightContent = useCallback(() => {
    const { windowWidth, windowCenter } = voi;
    // eslint-disable-next-line react/prop-types
    const { imageIndex, numberOfSlices } = imageSliceData;
    if (typeof windowCenter !== 'number' || typeof windowWidth !== 'number') {
      return null;
    }
    const currentTagValues = readTagsMap(RightBottomTags, dicomTagList);
    const rightBottomInfos = joinTagsInfo([], currentTagValues);
    return (
      <>
        <div className="overlay-item flex flex-row">
          <span className="mr-1 shrink-0">Img:</span>
          <span className="">
            {instanceNumber !== undefined && instanceNumber !== null
              ? `${instanceNumber} (${imageIndex + 1}/${numberOfSlices})`
              : `${imageIndex + 1}/${numberOfSlices}`}
          </span>
        </div>
        <div className="overlay-item flex flex-row">
          <span className="mr-1 shrink-0">Zoom:</span>
          <span className="">{Math.round(scale * 100)}%</span>
        </div>
        <div className="overlay-item flex flex-row">
          <span className="mr-1 shrink-0">W:</span>
          <span className="ml-1 mr-2 shrink-0">{windowWidth.toFixed(0)}</span>
          <span className="mr-1 shrink-0">L:</span>
          <span className="ml-1 shrink-0">{windowCenter.toFixed(0)}</span>
        </div>
        {rightBottomInfos.map(({ label, value, showLabel }, i) => (
          <div
            className="overlay-item flex flex-row"
            key={`topRightOverlayItem_${i}`}
          >
            {showLabel ? <span className="mr-1 shrink-0">{label}:</span> : null}{' '}
            <span className="ml-1 shrink-0">{value}</span>
          </div>
        ))}
      </>
    );
  }, [
    element,
    viewportData,
    imageSliceData,
    viewportIndex,
    servicesManager,
    customizationService,
    instance,
    voi,
    scale,
    instanceNumber,
    dicomTagList,
  ]);
  // const getBottomRightContent = useCallback(() => {
  //   const items = bottomRightCustomization?.items || [];
  //   return (
  //     <>
  //       {items.map((item, i) => (
  //         <div key={`bottomRightOverlayItem_${i}`}>
  //           {_renderOverlayItem(item)}
  //         </div>
  //       ))}
  //     </>
  //   );
  // }, [bottomRightCustomization, _renderOverlayItem]);

  return (
    <ViewportOverlay
      topLeft={getTopLeftContent()}
      topRight={getTopRightContent()}
      bottomLeft={getBottomLeftContent()}
      bottomRight={getBottomRightContent()}
    />
  );
}

function _getViewportInstance(viewportData, imageIndex) {
  let imageId = null;
  if (viewportData.viewportType === Enums.ViewportType.STACK) {
    imageId = viewportData.data.imageIds[imageIndex];
  } else if (viewportData.viewportType === Enums.ViewportType.ORTHOGRAPHIC) {
    const volumes = viewportData.data;
    if (volumes && volumes.length == 1) {
      const volume = volumes[0];
      imageId = volume.imageIds[imageIndex];
    }
  }
  return imageId ? metaData.get('instance', imageId) || {} : {};
}

function _getInstanceNumber(
  viewportData,
  viewportIndex,
  imageIndex,
  cornerstoneViewportService
) {
  let instanceNumber;

  if (viewportData.viewportType === Enums.ViewportType.STACK) {
    instanceNumber = _getInstanceNumberFromStack(viewportData, imageIndex);

    if (!instanceNumber && instanceNumber !== 0) {
      return null;
    }
  } else if (viewportData.viewportType === Enums.ViewportType.ORTHOGRAPHIC) {
    instanceNumber = _getInstanceNumberFromVolume(
      viewportData,
      imageIndex,
      viewportIndex,
      cornerstoneViewportService
    );
  }
  return instanceNumber;
}

function _getInstanceNumberFromStack(viewportData, imageIndex) {
  const imageIds = viewportData.data.imageIds;
  const imageId = imageIds[imageIndex];

  if (!imageId) {
    return;
  }

  const generalImageModule = metaData.get('generalImageModule', imageId) || {};
  const { instanceNumber } = generalImageModule;

  const stackSize = imageIds.length;

  if (stackSize <= 1) {
    return;
  }

  return parseInt(instanceNumber);
}

// Since volume viewports can be in any view direction, they can render
// a reconstructed image which don't have imageIds; therefore, no instance and instanceNumber
// Here we check if viewport is in the acquisition direction and if so, we get the instanceNumber
function _getInstanceNumberFromVolume(
  viewportData,
  imageIndex,
  viewportIndex,
  cornerstoneViewportService
) {
  const volumes = viewportData.volumes;

  // Todo: support fusion of acquisition plane which has instanceNumber
  if (!volumes || volumes.length > 1) {
    return;
  }

  const volume = volumes[0];
  const { direction, imageIds } = volume;

  const cornerstoneViewport = cornerstoneViewportService.getCornerstoneViewportByIndex(
    viewportIndex
  );

  if (!cornerstoneViewport) {
    return;
  }

  const camera = cornerstoneViewport.getCamera();
  const { viewPlaneNormal } = camera;
  // checking if camera is looking at the acquisition plane (defined by the direction on the volume)

  const scanAxisNormal = direction.slice(6, 9);

  // check if viewPlaneNormal is parallel to scanAxisNormal
  const cross = vec3.cross(vec3.create(), viewPlaneNormal, scanAxisNormal);
  const isAcquisitionPlane = vec3.length(cross) < EPSILON;

  if (isAcquisitionPlane) {
    const imageId = imageIds[imageIndex];

    if (!imageId) {
      return {};
    }

    const { instanceNumber } =
      metaData.get('generalImageModule', imageId) || {};
    return parseInt(instanceNumber);
  }
}

CustomizableViewportOverlay.propTypes = {
  viewportData: PropTypes.object,
  imageIndex: PropTypes.number,
  viewportIndex: PropTypes.number,
  servicesManager: PropTypes.any,
  element: PropTypes.any,
  imageSliceData: PropTypes.any,
};

export default CustomizableViewportOverlay;
