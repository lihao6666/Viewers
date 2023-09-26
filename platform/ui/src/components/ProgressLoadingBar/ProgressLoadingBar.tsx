import React, { ReactElement } from 'react';

import './ProgressLoadingBar.css';
import classNames from 'classnames';

export type ProgressLoadingBarProps = {
  progress?: number;
  height?: number;
  colorClass?: string;
};
/**
 * A React component that renders a loading progress bar.
 * If progress is not provided, it will render an infinite loading bar
 * If progress is provided, it will render a progress bar
 * The progress text can be optionally displayed to the left of the bar.
 */
function ProgressLoadingBar({
  progress,
  height = 8,
  colorClass = 'bg-primary-light',
}: ProgressLoadingBarProps): ReactElement {
  return (
    <div className="loading">
      {progress === undefined || progress === null ? (
        <div className={classNames('infinite-loading-bar', colorClass)}></div>
      ) : (
        <div
          className={classNames(colorClass)}
          style={{
            width: `${progress}%`,
            height,
          }}
        ></div>
      )}
    </div>
  );
}

export default ProgressLoadingBar;
