'use client';

import { MutableRefObject, RefObject, useEffect, useRef, useState } from 'react';

import BottomLeftMenu, { BottomLeftMenuRef } from './BottomLeftMenu';
import { BotBuilderContext } from './context';
import useDiagram from './hooks/useDiagram';
import useZoom from './hooks/useZoom';
import { SearchInPopoverRef } from './SearchInPopover';
import ZoomContainer from './ZoomContainer';
import { botBuilderApi } from '@/api';
import { BotStoryBlock } from '@/model';

export default function BotStoryPage() {
  const zoomContainerDomRef = useRef<HTMLDivElement>(null);
  const bottomLeftMenuRef = useRef<BottomLeftMenuRef>(null);
  const searchInPopoverRefs: MutableRefObject<SearchInPopoverRef[]> = useRef([]);
  const [rawBlock, setRawBlock] = useState<BotStoryBlock>();
  const { blocks, paths } = useDiagram(rawBlock!);
  const { centerRoot, zoomIn, zoomOut, resetZoom, centerBlock } = useZoom({
    onChangeScale(scale) {
      bottomLeftMenuRef.current!.changeScale(scale);
    },
    getContainer: () => zoomContainerDomRef.current!,
  });

  useEffect(() => {
    async function fetchBlocks() {
      const res = await botBuilderApi.getStoryBlocks();

      if (res) {
        setRawBlock(res);
      }
    }

    fetchBlocks();
  }, []);

  return (
    <BotBuilderContext.Provider
      value={{
        changeRawBlock: setRawBlock,
      }}
    >
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
    </BotBuilderContext.Provider>
  );
}
