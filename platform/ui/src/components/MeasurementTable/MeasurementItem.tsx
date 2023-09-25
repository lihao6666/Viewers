import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Icon from '../Icon';

const MeasurementItem = ({ uid, index, label, displayText, isActive, onClick, onEdit, onDelete, item }) => {
  const [isHovering, setIsHovering] = useState(false);

  const onEditHandler = event => {
    event.stopPropagation();
    onEdit({ uid, isActive, event });
  };

  const onClickHandler = event => onClick({ uid, isActive, event });

  const onMouseEnter = () => setIsHovering(true);
  const onMouseLeave = () => setIsHovering(false);

  return (
    <div
      className={classnames(
        'group flex cursor-pointer border border-transparent bg-black outline-none transition duration-300',
        {
          'border-primary-light overflow-hidden rounded': isActive,
        }
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClickHandler}
      role="button"
      tabIndex="0"
      data-cy={'measurement-item'}
    >
      <div
        className={classnames('w-6 py-1 text-center text-base transition duration-300', {
          'bg-primary-light active text-black': isActive,
          'bg-primary-dark text-primary-light group-hover:bg-secondary-main': !isActive,
        })}
      >
        {index}
      </div>
      <div className="relative flex flex-col flex-1 px-2 py-1">
        <span className="mb-1 text-base text-primary-light break-all">{label}</span>
        {displayText.map((line, i) => (
          <span
            key={i}
            className="pl-2 text-base text-white border-l border-primary-light break-all"
            dangerouslySetInnerHTML={{ __html: line }}
          ></span>
        ))}
        <Icon
          className={classnames(
            'text-white w-4 absolute cursor-pointer transition duration-300 visible opacity-1'
            // { 'invisible opacity-0': !isActive && !isHovering },
            // { 'visible opacity-1': !isActive && isHovering }
          )}
          name="pencil"
          style={{
            top: 4,
            right: 4,
            // transform: isActive || isHovering ? '' : 'translateX(100%)',
          }}
          onClick={onEditHandler}
        />
        <Icon
          className={classnames(
            'text-white text-2lg w-4 absolute cursor-pointer transition duration-300',
            { 'invisible opacity-0': !isHovering },
            { 'visible opacity-1': isHovering }
          )}
          name="icon-delete"
          style={{
            bottom: 4,
            right: 4,
            transform: isHovering ? '' : 'translateX(100%)',
          }}
          onClick={() => onDelete({ uid: item.uid })}
        />
      </div>
    </div>
  );
};

MeasurementItem.propTypes = {
  uid: PropTypes.oneOfType([PropTypes.number.isRequired, PropTypes.string.isRequired]),
  index: PropTypes.number.isRequired,
  label: PropTypes.string,
  displayText: PropTypes.array.isRequired,
  isActive: PropTypes.bool,
  onClick: PropTypes.func,
  onEdit: PropTypes.func,
};

MeasurementItem.defaultProps = {
  isActive: false,
};

export default MeasurementItem;
