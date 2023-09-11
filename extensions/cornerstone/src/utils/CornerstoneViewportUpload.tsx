import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import getActiveViewportEnabledElement from './getActiveViewportEnabledElement';
// import { Types as OhifTypes } from '@ohif/core';
import html2canvas from 'html2canvas';
import { ToolGroupManager } from '@cornerstonejs/tools';
import { useOutViewLayer } from '@ohif/ui';
import {
  // Enums,
  getEnabledElement,
  // getOrCreateCanvas,
  StackViewport,
  VolumeViewport,
} from '@cornerstonejs/core';
import { CornerstoneServices } from '../types';

const UPLOAD_VIEWPORT_ID = 'cornerstone-upload-viewport';

const CornerstoneViewportUpload = ({ servicesManager, width, height }) => {
  const {
    viewportGridService,
    cornerstoneViewportService,
  } = servicesManager.services as CornerstoneServices;
  const outViewLayer = useOutViewLayer();
  const [viewportElement, setViewportElement] = useState();

  const activeViewportEnabledElement = getActiveViewportEnabledElement(
    viewportGridService
  );
  const {
    viewportId: activeViewportId,
    renderingEngineId,
  } = activeViewportEnabledElement;

  const toolGroup = ToolGroupManager.getToolGroupForViewport(
    activeViewportId,
    renderingEngineId
  );

  const toolModeAndBindings = Object.keys(toolGroup.toolOptions).reduce(
    (acc, toolName) => {
      const tool = toolGroup.toolOptions[toolName];
      const { mode, bindings } = tool;

      return {
        ...acc,
        [toolName]: {
          mode,
          bindings,
        },
      };
    },
    {}
  );

  const toggleAnnotations = viewportElement => {
    return new Promise((resolve, reject) => {
      const downloadViewportElement = getEnabledElement(viewportElement);
      const { viewportId: downloadViewportId } = downloadViewportElement;
      if (!activeViewportEnabledElement || !downloadViewportElement) {
        return;
      }
      // add the viewport to the toolGroup
      toolGroup.addViewport(downloadViewportId, renderingEngineId);
      Object.keys(toolGroup._toolInstances).forEach(toolName => {
        // make all tools Enabled so that they can not be interacted with
        // in the download viewport
        if (toolName !== 'Crosshairs') {
          try {
            toolGroup.setToolEnabled(toolName);
          } catch (e) {
            console.log(e);
          }
        } else {
          toolGroup.setToolDisabled(toolName);
        }
      });
      const timer = setTimeout(() => {
        resolve({});
        clearTimeout(timer);
      }, 100);
    });
  };

  const loadImage = async () => {
    const { viewport } = getActiveViewportEnabledElement(viewportGridService);
    const renderingEngine = cornerstoneViewportService.getRenderingEngine();
    const uploadViewport = renderingEngine.getViewport(UPLOAD_VIEWPORT_ID);

    await new Promise((resolve, reject) => {
      if (uploadViewport instanceof StackViewport) {
        const imageId = viewport.getCurrentImageId();
        const properties = viewport.getProperties();
        uploadViewport.setStack([imageId]).then(() => {
          uploadViewport.setProperties(properties);
          resolve({});
        });
      } else if (uploadViewport instanceof VolumeViewport) {
        const actors = viewport.getActors();
        actors.forEach(actor => {
          uploadViewport.addActor(actor);
        });

        uploadViewport.setCamera(viewport.getCamera());
        uploadViewport.render();
        resolve({});
      }
    });
    renderingEngine.resize();
  };

  const enableUploadViewport = async viewportElement => {
    if (viewportElement) {
      const { renderingEngine, viewport } = getActiveViewportEnabledElement(
        viewportGridService
      );
      const viewportInput = {
        viewportId: UPLOAD_VIEWPORT_ID,
        element: viewportElement,
        type: viewport.type,
        defaultOptions: {
          background: viewport.defaultOptions.background,
          orientation: viewport.defaultOptions.orientation,
        },
      };
      renderingEngine.enableElement(viewportInput);
      await loadImage();
      await toggleAnnotations(viewportElement);
      const divForDownloadViewport = document.querySelector(
        `div[data-viewport-uid="${UPLOAD_VIEWPORT_ID}"]`
      );
      html2canvas(divForDownloadViewport).then(canvas => {
        const link = document.createElement('a');
        link.download = 'image.png';
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
        outViewLayer.hide();
      });

      // window.opener
      //   ? window.opener.postMessage({
      //       eventName: 'POST_UPLOAD_IMAGE',
      //       data: 'POST_UPLOAD_IMAGE',
      //     }, '*')
      //   : window.parent.postMessage({
      //       eventName: 'POST_UPLOAD_IMAGE',
      //       data: 'POST_UPLOAD_IMAGE',
      //     }, '*')
    }
  };

  const disableUploadViewport = viewportElement => {
    if (viewportElement) {
      const { renderingEngine } = getEnabledElement(viewportElement);
      return new Promise(resolve => {
        renderingEngine.disableElement(UPLOAD_VIEWPORT_ID);
      });
    }
  };

  useEffect(() => {
    enableUploadViewport(viewportElement);
    return () => {
      disableUploadViewport(viewportElement);
    };
  }, [viewportElement]);

  useEffect(() => {
    return () => {
      Object.keys(toolModeAndBindings).forEach(toolName => {
        const { mode, bindings } = toolModeAndBindings[toolName];
        toolGroup.setToolMode(toolName, mode, { bindings });
      });
    };
  }, []);

  return (
    <div className="upload-cornerstone-box m-auto h-full w-full -left-full">
      <div
        className="upload-cornerstone-viewport"
        ref={node => setViewportElement(node)}
        style={{
          width,
          height,
        }}
      ></div>
    </div>
  );
};

CornerstoneViewportUpload.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};

export default CornerstoneViewportUpload;
