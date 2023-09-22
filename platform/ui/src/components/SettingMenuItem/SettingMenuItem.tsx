import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from '../Icon';
import { useViewportGrid } from '@ohif/ui';

const SettingMenuItem = ({ icon, label, t, selected }) => {
  const [viewportData] = useViewportGrid();
  return (
    <div
      className={classNames(
        'flex flex-row items-center p-3 h-8 w-full hover:bg-primary-dark',
        'text-base whitespace-pre',
        viewportData[selected]
          ? 'text-[#348CFD]'
          : 'text-common-bright hover:bg-primary-dark hover:text-primary-light'
      )}
    >
      {icon && (
        <span className="mr-4">
          <Icon name={icon} className="w-5 h-5" />
        </span>
      )}
      <span className="mr-5">{t(label)}</span>
    </div>
  );
};

SettingMenuItem.propTypes = {
  icon: PropTypes.string,
  label: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  selected: PropTypes.number,
};

export default SettingMenuItem;
