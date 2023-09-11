import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const OutViewLayer = ({ className, children }) => {
  return (
    <div
      className={classnames(
        'absolute top-0 -left-full z-10 overflow-hidden',
        className
      )}
    >
      {children}
    </div>
  );
};

OutViewLayer.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export default OutViewLayer;
