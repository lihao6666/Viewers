/**
 * UI OutViewLayer
 *
 * @typedef {Object} ModalProps
 * @property {ReactElement|HTMLElement} [content=null] Modal content.
 * @property {Object} [contentProps=null] Modal content props.
 */

const name = 'uiOutViewLayerService';

const serviceImplementation = {
  _hide: () => console.warn('hide() NOT IMPLEMENTED'),
  _show: () => console.warn('show() NOT IMPLEMENTED'),
};

class UIOutViewLayerService {
  static REGISTRATION = {
    name,
    altName: 'UIOutViewLayerService',
    create: (): UIOutViewLayerService => {
      return new UIOutViewLayerService();
    },
  };

  readonly name = name;

  /**
   * Show a new UI OutView;
   *
   * @param {OutViewLayerProps} props { content, contentProps, }
   */
  show({ content = null, contentProps = null }) {
    return serviceImplementation._show({
      content,
      contentProps,
    });
  }

  /**
   * Hides/dismisses the modal, if currently shown
   *
   * @returns void
   */
  hide() {
    return serviceImplementation._hide();
  }

  /**
   *
   *
   * @param {*} {
   *   hide: hideImplementation,
   *   show: showImplementation,
   * }
   */
  setServiceImplementation({
    hide: hideImplementation,
    show: showImplementation,
  }) {
    if (hideImplementation) {
      serviceImplementation._hide = hideImplementation;
    }
    if (showImplementation) {
      serviceImplementation._show = showImplementation;
    }
  }
}

export default UIOutViewLayerService;
