import React, {
  useState,
  createContext,
  useContext,
  useCallback,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const OutViewLayerContext = createContext(null);
const { Provider } = OutViewLayerContext;

export const useOutViewLayer = () => useContext(OutViewLayerContext);

export const OutViewLayerProvider = ({ children, service, modal: Layer }) => {
  const DEFAULT_OPTIONS = {
    display: false,
    content: null,
    contentProps: null,
  };
  const [outViewOptions, setOutViewOptions] = useState(DEFAULT_OPTIONS);
  const show = useCallback(
    params => {
      setOutViewOptions({
        ...params,
        display: true,
      });
    },
    [outViewOptions]
  );
  const hide = useCallback(() => {
    setOutViewOptions(DEFAULT_OPTIONS);
  }, [outViewOptions]);

  useEffect(() => {
    if (service) {
      service.setServiceImplementation({ hide, show });
    }
  }, [hide, service, show]);
  const { content: LayerChildComp, contentProps, display } = outViewOptions;
  return (
    <Provider value={{ show, hide }}>
      <Layer
        className={classNames('out-view-layer', {
          'h-screen w-screen': display,
          'h-0 w-0': !display,
        })}
      >
        {display && LayerChildComp ? (
          <LayerChildComp {...contentProps} />
        ) : null}
      </Layer>
      {children}
    </Provider>
  );
};

OutViewLayerProvider.propTypes = {
  /** Children that will be wrapped with Modal Context */
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  modal: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.func,
  ]).isRequired,
  service: PropTypes.shape({
    setServiceImplementation: PropTypes.func,
  }),
};

export default OutViewLayerProvider;
