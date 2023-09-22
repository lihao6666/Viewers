import React from 'react';
import classNames from 'classnames';
import ProgressLoadingBar from '../ProgressLoadingBar';
import './CustomLoadingIndicator.css';
/**
 *  A React component that renders a loading indicator.
 * if progress is not provided, it will render an infinite loading indicator
 * if progress is provided, it will render a progress bar
 * Optionally a textBlock can be provided to display a message
 */
const duration = 1.2;
function LoadingIndicatorProgress({ className, textBlock, progress }) {
  const publicUrl = window.PUBLIC_URL || '/';
  const spritePath = `${publicUrl}assets/w-300-logo.webp`;
  const styleBgImage = {
    backgroundImage: `url(${spritePath})`,
    backgroundSize: '192px 41px',
  };

  const letterList = [
    {
      width: '17.797%',
      bgXPos: '-42px',
      bgYpos: 0,
    },
    {
      width: '16.525%',
      bgXPos: '-69px',
      bgYpos: 0,
    },
    {
      width: '15.678%',
      bgXPos: '-93px',
      bgYpos: 0,
    },
    {
      width: '16.949%',
      bgXPos: '-116px',
      bgYpos: 0,
    },
    {
      width: '15.254%',
      bgXPos: '-141px',
      bgYpos: 0,
    },
    {
      width: '18.220%',
      bgXPos: '-165px',
      bgYpos: 0,
    },
  ];

  return (
    <div
      className={classNames(
        'absolute z-50 top-0 left-0 flex flex-col items-center justify-center space-y-5',
        className
      )}
    >
      <div className="w-48">
        <div className="w-full opacity-80">
          <img
            src={spritePath}
            className="inline-block w-full align-top"
            alt=""
          />
          {/* <div
            className="w-[21.333%] pt-[21.333%] animat"
            style={{
              ...styleBgImage,
              backgroundPosition: '0 0',
            }}
          ></div>
          <div className="flex-1 flex items-stretch">
            {letterList.map(({ width, bgXPos }, idx) => {
              const delay = (duration / letterList.length) * idx;
              return (
                <span
                  key={bgXPos}
                  className={classNames(
                    `w-[${width}]`,
                    'inline-block align-middle h-full letter-wave'
                  )}
                  style={{
                    ...styleBgImage,
                    width,
                    backgroundPosition: `${bgXPos} 0`,
                    animationDuration: `${duration}s`,
                    animationDelay: `${delay}s`,
                  }}
                ></span>
              );
            })}
          </div> */}
        </div>
        <div className="mt-4">
          <ProgressLoadingBar colorClass="bg-white opacity-80" />
        </div>
      </div>
      {/* <div className="w-48">
        <ProgressLoadingBar progress={progress} />
      </div> */}
      {/* {textBlock} */}
    </div>
  );
}

export default LoadingIndicatorProgress;
