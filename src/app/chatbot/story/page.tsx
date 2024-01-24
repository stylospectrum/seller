'use client';

import { useRef } from 'react';

import BottomLeftMenu, { BottomLeftMenuRef } from './BottomLeftMenu';
import useDiagram from './hooks/useDiagram';
import useZoom from './hooks/useZoom';
import ZoomContainer from './ZoomContainer';

export default function BotStoryPage() {
  const zoomContainerDomRef = useRef<HTMLDivElement>(null);
  const bottomLeftMenuRef = useRef<BottomLeftMenuRef>(null);
  const { area, blocks, paths } = useDiagram();
  const { centerRoot, zoomIn, zoomOut, resetZoom, centerBlock } = useZoom({
    area,
    onChangeScale(scale) {
      bottomLeftMenuRef.current!.changeScale(scale);
    },
    getContainer: () => zoomContainerDomRef.current!,
  });

  return (
    <>
      <ZoomContainer
        centerBlock={centerBlock}
        blocks={blocks}
        paths={paths}
        ref={zoomContainerDomRef}
      />
      <BottomLeftMenu
        onCenterRoot={() => centerRoot(700)}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onResetZoom={resetZoom}
        ref={bottomLeftMenuRef}
      />
    </>
  );
}
