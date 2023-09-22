import React from 'react';
import { ToolbarButton } from '@ohif/ui';
import ToolbarDivider from './Toolbar/ToolbarDivider.tsx';
import ToolbarLayoutSelector from './Toolbar/ToolbarLayoutSelector.tsx';
import ToolbarSplitButton from './Toolbar/ToolbarSplitButton.tsx';
import ToolbarCornerInfoBtn from './Toolbar/ToolbarCornerInfoBtn.tsx';

const combineManagerWrapper = (Comp, managers) => {
  // eslint-disable-next-line react/display-name
  return (props = {}) => {
    // eslint-disable-next-line react/react-in-jsx-scope
    return <Comp {...props} {...managers} />;
  };
};

export default function getToolbarModule({ commandsManager, servicesManager }) {
  return [
    {
      name: 'ohif.divider',
      defaultComponent: ToolbarDivider,
      clickHandler: () => {},
    },
    {
      name: 'ohif.action',
      defaultComponent: ToolbarButton,
      clickHandler: () => {},
    },
    {
      name: 'ohif.radioGroup',
      defaultComponent: ToolbarButton,
      clickHandler: () => {},
    },
    {
      name: 'ohif.splitButton',
      defaultComponent: ToolbarSplitButton,
      clickHandler: () => {},
    },
    {
      name: 'ohif.layoutSelector',
      defaultComponent: ToolbarLayoutSelector,
      clickHandler: (evt, clickedBtn, btnSectionName) => {},
    },
    {
      name: 'ohif.toggle',
      defaultComponent: ToolbarButton,
      clickHandler: () => {},
    },
    {
      name: 'ohif.cornerInfoButton',
      defaultComponent: combineManagerWrapper(ToolbarCornerInfoBtn, {
        commandsManager,
        servicesManager,
      }),
      clickHander: () => {},
    },
  ];
}
