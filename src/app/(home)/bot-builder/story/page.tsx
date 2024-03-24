'use client';

import { useRef } from 'react';
import { BusyIndicator } from '@stylospectrum/ui';

import BottomLeftMenu, { BottomLeftMenuRef } from './BottomLeftMenu';
import useZoom from './hooks/useZoom';
import TopRightMenu from './TopRightMenu';
import ZoomContainer from './ZoomContainer';
import { useBotStoryBlock } from '@/hooks';
import Portal from '@/utils/Portal';

export default function BotStoryPage() {
  const zoomContainerDomRef = useRef<HTMLDivElement>(null);
  const bottomLeftMenuRef = useRef<BottomLeftMenuRef>(null);
  const { blocks, setBlock, loading, paths } = useBotStoryBlock();
  const { centerRoot, zoomIn, zoomOut, resetZoom, centerBlock } = useZoom({
    onChangeScale(scale) {
      bottomLeftMenuRef.current!.changeScale(scale);
    },
    getContainer: () => zoomContainerDomRef.current!,
  });

  return (
    <>
      <Portal open={loading}>
        <BusyIndicator global />
      </Portal>
      <TopRightMenu />
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
