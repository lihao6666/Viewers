window.customWhiteLabeling = {
  createLogoComponentFn: function(React, { deviceInfo }) {
    const publicUrl = window.PUBLIC_URL || '/';
    const { isAndroid, isMobile, winWidth } = deviceInfo || {};
    const logoPath = `${publicUrl}assets/header-logo.png`;
    return isAndroid || isMobile || winWidth < 768
      ? null
      : React.createElement(
          'a',
          {
            target: '_self',
            rel: 'noopener noreferrer',
            className: 'block overflow-hidden text-purple-600',
            // href: 'javascript: void(0);',
            onClick: event => event.preventDefault(),
          },
          React.createElement('img', {
            src: logoPath,
            className: 'h-10 opacity-85',
          })
        );
  },
};
