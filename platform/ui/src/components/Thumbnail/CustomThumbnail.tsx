import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { useDrag } from 'react-dnd';
import Icon from '../Icon';
import Tooltip from '../Tooltip';
import { StringNumber } from '../../types';
import DisplaySetMessageListTooltip from '../DisplaySetMessageListTooltip';

/**
 * Display a thumbnail for a display set.
 */
const Thumbnail = ({
  displaySetInstanceUID,
  className,
  imageSrc,
  imageAltText,
  description,
  seriesNumber,
  numInstances,
  countIcon,
  messages,
  dragData,
  isActive,
  viewportIdentificator = [],
  isTracked,
  onClick,
  onDoubleClick,
  onClickUntrack,
}): React.ReactNode => {
  // TODO: We should wrap our thumbnail to create a "DraggableThumbnail", as
  // this will still allow for "drag", even if there is no drop target for the
  // specified item.
  const [collectedProps, drag, dragPreview] = useDrag({
    type: 'displayset',
    item: { ...dragData },
    canDrag: function(monitor) {
      return Object.keys(dragData).length !== 0;
    },
  });
  const trackedIcon = isTracked ? 'circled-checkmark' : 'dotted-circle';
  const viewportIdentificatorLabel = viewportIdentificator.join(', ');
  const renderViewportLabels = () => {
    const MAX_LABELS_PER_COL = 3;
    const shouldShowStack = viewportIdentificator.length > MAX_LABELS_PER_COL;
    if (shouldShowStack) {
      return (
        <>
          <div>
            {viewportIdentificator.slice(0, MAX_LABELS_PER_COL).map(label => (
              <div key={label}>{label}</div>
            ))}
          </div>
          <Tooltip
            position="right"
            content={
              <div className="text-left max-w-40">
                Series is displayed <br /> in viewport{' '}
                {viewportIdentificatorLabel}
              </div>
            }
          >
            <Icon name="tool-more-menu" className="text-white py-2" />
          </Tooltip>
        </>
      );
    }

    return viewportIdentificator.map(label => <span key={label}>{label}</span>);
  };

  return (
    <div
      className={classnames(
        className,
        'flex-1 mb-1 cursor-pointer outline-none select-none group'
      )}
      id={`thumbnail-${displaySetInstanceUID}`}
      data-cy={`study-browser-thumbnail`}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      role="button"
      // tabIndex="0"
    >
      <div className="series-part-layer flex">
        <div className="flex flex-col mr-2 py-1">
          <div
            className={classnames(
              'flex items-center justify-start relative cursor-pointer',
              isTracked && 'rounded-sm hover:bg-gray-900'
            )}
          >
            <Tooltip
              position="right"
              content={
                <div className="flex flex-row flex-1">
                  <div className="flex pr-4 flex-2">
                    <Icon name="info-link" className="text-primary-active" />
                  </div>
                  <div className="flex flex-col flex-1">
                    <span>
                      Series is
                      <span className="text-white">
                        {isTracked ? ' tracked' : ' untracked'}
                      </span>
                    </span>
                    {!!viewportIdentificator.length && (
                      <span>
                        in viewport
                        <span className="ml-1 text-white">
                          {viewportIdentificatorLabel}
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              }
            >
              <Icon name={trackedIcon} className="w-4 text-primary-light" />
            </Tooltip>
          </div>

          {isTracked && (
            <div className="my-2" onClick={onClickUntrack}>
              <Icon name="cancel" className="w-4 text-primary-active align-top" />
            </div>
          )}

          <div className="flex-1 flex flex-col justify-center w-full text-base text-center font-bold text-aqua-pale">
            {renderViewportLabels()}
          </div>
        </div>
        <div className="series-part-layer">
          <div ref={drag} className="series-item relative">
            <div
              className={classnames(
                'flex flex-1 items-center justify-center rounded-md bg-black text-base text-white overflow-hidden h-32',
                isActive
                  ? 'border-2 border-primary-light'
                  : 'border border-secondary-light hover:border-blue-300'
              )}
              style={{
                margin: isActive ? '0' : '1px',
              }}
            >
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt={imageAltText}
                  className="object-none h-full"
                  crossOrigin="anonymous"
                />
              ) : (
                <div>{imageAltText}</div>
              )}
            </div>
            {/* <div className="absolute left-0 top-1 w-full flex pl-2 pr-2 text-base text-aqua-pale">
              <span className="break-all flex-1">{description}</span>
              {renderViewportLabels()}
            </div> */}

            {/* <div className="absolute left-0 bottom-1 w-full pl-2 pr-2">
              <div className="flex flex-row items-center flex-1 text-base text-blue-300">
                <div className="mr-4">
                  <span className="text-primary-main">{'S: '}</span>
                  {seriesNumber}
                </div>
                <div className="flex flex-row items-center flex-1">
                  <Icon name={countIcon || 'group-layers'} className="w-3 mr-2" />
                  {` ${numInstances}`}
                </div>
                <DisplaySetMessageListTooltip
                  messages={messages}
                  id={`display-set-tooltip-${displaySetInstanceUID}`}
                />
              </div>
            </div> */}
          </div>
          <div className="flex items-center pr-1 mt-2 text-base text-blue-300">
            <div className="mr-4">
              <span className="mr-1">{'S:'}</span>
              {seriesNumber}
            </div>
            <div className="flex mr-4 items-center">
              <Icon name={countIcon || 'group-layers'} className="mr-1 w-3" />
              {numInstances}
            </div>
            <div className="flex-1 text-ellipsis text-right">{description}</div>
            <DisplaySetMessageListTooltip
              messages={messages}
              id={`display-set-tooltip-${displaySetInstanceUID}`}
              className="ml-4"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

Thumbnail.propTypes = {
  displaySetInstanceUID: PropTypes.string.isRequired,
  className: PropTypes.string,
  imageSrc: PropTypes.string,
  /**
   * Data the thumbnail should expose to a receiving drop target. Use a matching
   * `dragData.type` to identify which targets can receive this draggable item.
   * If this is not set, drag-n-drop will be disabled for this thumbnail.
   *
   * Ref: https://react-dnd.github.io/react-dnd/docs/api/use-drag#specification-object-members
   */
  dragData: PropTypes.shape({
    /** Must match the "type" a dropTarget expects */
    type: PropTypes.string.isRequired,
  }),
  imageAltText: PropTypes.string,
  description: PropTypes.string.isRequired,
  seriesNumber: StringNumber.isRequired,
  numInstances: PropTypes.number.isRequired,
  messages: PropTypes.object,
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  onDoubleClick: PropTypes.func.isRequired,
  viewportIdentificator: PropTypes.array,
  isTracked: PropTypes.bool,
  onClickUntrack: PropTypes.func,
};

Thumbnail.defaultProps = {
  dragData: {},
};

export default Thumbnail;
