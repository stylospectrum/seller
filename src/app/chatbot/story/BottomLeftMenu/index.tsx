import { forwardRef, useImperativeHandle, useState } from 'react';
import { Button } from '@stylospectrum/ui';
import { ButtonDesign, TooltipPlacement } from '@stylospectrum/ui/dist/types';

import styles from './index.module.scss';

import '@stylospectrum/ui/dist/icon/data/home';
import '@stylospectrum/ui/dist/icon/data/full-screen';
import '@stylospectrum/ui/dist/icon/data/add';
import '@stylospectrum/ui/dist/icon/data/less';
import '@stylospectrum/ui/dist/icon/data/exit-full-screen';

interface BottomLeftMenuProps {
  onCenterRoot(): void;
  onZoomIn(): void;
  onZoomOut(): void;
  onResetZoom(): void;
}

export interface BottomLeftMenuRef {
  changeScale(scale: number): void;
}

export default forwardRef<BottomLeftMenuRef, BottomLeftMenuProps>(function BottomLeftMenu(
  { onCenterRoot, onZoomIn, onZoomOut, onResetZoom },
  ref,
) {
  const [zoomAreaVisible, setZoomAreaVisible] = useState(false);
  const [scale, setScale] = useState(1);
  const [fullScreen, setFullScreen] = useState(false);

  function handleMouseOver() {
    setZoomAreaVisible(true);
  }

  function handleMouseLeave() {
    setZoomAreaVisible(false);
  }

  useImperativeHandle(ref, () => ({
    changeScale: setScale,
  }));

  return (
    <div className={styles.wrapper}>
      <Button
        icon="home"
        type={ButtonDesign.Tertiary}
        tooltip="Start point"
        tooltipPlacement={TooltipPlacement.Top}
        onClick={onCenterRoot}
      />
      <Button
        icon={fullScreen ? 'exit-full-screen' : 'full-screen'}
        type={ButtonDesign.Tertiary}
        tooltip="Fullscreen"
        tooltipPlacement={TooltipPlacement.Top}
        onClick={() => {
          if (fullScreen) {
            document.exitFullscreen();
            setFullScreen(false);
          } else {
            document.documentElement.requestFullscreen();
            setFullScreen(true);
          }
        }}
      />
      <div className={styles.divider}>
        <div className={styles.line} />
      </div>
      <div
        onMouseOver={handleMouseOver}
        onMouseLeave={handleMouseLeave}
        className={styles['zoom-area']}
      >
        {zoomAreaVisible && (
          <>
            <Button
              tooltip="Zoom out Ctrl + [-]"
              tooltipPlacement={TooltipPlacement.Top}
              icon="less"
              type={ButtonDesign.Tertiary}
              onClick={onZoomOut}
            />
            <Button
              tooltip="Zoom in Ctrl + [+]"
              tooltipPlacement={TooltipPlacement.Top}
              icon="add"
              type={ButtonDesign.Tertiary}
              onClick={onZoomIn}
            />
          </>
        )}
        <Button
          tooltip={zoomAreaVisible ? 'Reset zoom' : undefined}
          tooltipPlacement={TooltipPlacement.Top}
          type={ButtonDesign.Tertiary}
          onClick={onResetZoom}
        >
          {Math.round(scale * 100)}%
        </Button>
      </div>
    </div>
  );
});
