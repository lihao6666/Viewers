import React from 'react';
import ToolbarDivider from './Toolbar/ToolbarDivider';
import ToolbarLayoutSelectorWithServices from './Toolbar/ToolbarLayoutSelector';
import ToolbarSplitButtonWithServices from './Toolbar/ToolbarSplitButtonWithServices';
import ToolbarButtonWithServices from './Toolbar/ToolbarButtonWithServices';
import ToolbarCornerInfoBtn from './Toolbar/ToolbarCornerInfoBtn';

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
      defaultComponent: ToolbarButtonWithServices,
      clickHandler: () => {},
    },
    {
      name: 'ohif.radioGroup',
      defaultComponent: ToolbarButtonWithServices,
      clickHandler: () => {},
    },
    {
      name: 'ohif.splitButton',
      defaultComponent: ToolbarSplitButtonWithServices,
      clickHandler: () => {},
    },
    {
      name: 'ohif.layoutSelector',
      defaultComponent: ToolbarLayoutSelectorWithServices,
      clickHandler: (evt, clickedBtn, btnSectionName) => {},
    },
    {
      name: 'ohif.toggle',
      defaultComponent: ToolbarButtonWithServices,
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
