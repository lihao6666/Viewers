import React from 'react';
import { Tooltip, Icon, useViewportGrid } from '@ohif/ui';
import classnames from 'classnames';

export default function ToolbarCornerButton(props) {
  const [viewportData] = useViewportGrid();
  // eslint-disable-next-line react/prop-types
  const { commandsManager, commands = [], icon } = props;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, react/prop-types
  const handerToggleCornerInfo = () => commandsManager.run(commands);

  return (
    <Tooltip content={props.label} position="bottom">
      <button className={classnames(
          'transition duration-300 p-[10px] ease-in-out outline-none text-white hover:!bg-primary-dark rounded-md text-2lg',
          {
            'hover:text-primary-light': !viewportData.showTagsBrowser,
            'text-primary-light hover:opacity-80': viewportData.showTagsBrowser,
          }
        )}
        onClick={handerToggleCornerInfo}
      >
        <Icon name={icon} className="w-5 h-5 fill-current" />
      </button>
    </Tooltip>
  );
}
