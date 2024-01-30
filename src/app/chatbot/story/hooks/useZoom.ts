/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef } from 'react';
import * as d3 from 'd3';

import { SearchInPopoverRef } from '../SearchInPopover';
import { Box } from '../utils/box';
import { CustomHierarchyNode } from '../utils/hierarchy';

interface ZoomParams {
  getSearchInPopoverRefs: () => SearchInPopoverRef[] | null;
  getContainer: () => HTMLDivElement | null;
  onChangeScale: (scale: number) => void;
}

export default function useZoom({
  getContainer,
  onChangeScale,
  getSearchInPopoverRefs,
}: ZoomParams) {
  const selection = useRef<d3.Selection<HTMLDivElement, unknown, null, undefined>>();
  const zoomBehavior = useRef<d3.ZoomBehavior<HTMLDivElement, unknown>>();
  const currentScale = useRef(1);
  const currentTranslationX = useRef(0);
  const currentTranslationY = useRef(0);
  const viewportWidth = useRef(0);
  const viewportHeight = useRef(0);

  const hidePopover = () => {
    const refs = getSearchInPopoverRefs();

    if (refs) {
      refs.forEach((ref) => {
        ref!.close!();
      });
    }
  };

  const zoomed = useCallback((event: d3.D3ZoomEvent<HTMLDivElement, unknown>) => {
    let hasChanges = false;

    const previousScale = currentScale.current;
    const previousTranslationX = currentTranslationX.current;
    const previousTranslationY = currentTranslationY.current;

    currentScale.current = event.transform.k;
    currentTranslationX.current = Number(event.transform.x.toFixed(2));
    currentTranslationY.current = Number(event.transform.y.toFixed(2));

    hidePopover();

    if (previousScale !== currentScale.current) {
      hasChanges = true;
    }

    if (
      previousTranslationX !== currentTranslationX.current ||
      previousTranslationY !== currentTranslationY.current
    ) {
      hasChanges = true;
    }

    if (hasChanges) {
      const diagramDom = getContainer()?.querySelector('#diagram') as HTMLDivElement;

      if (diagramDom) {
        diagramDom.style.transform = `translate(${currentTranslationX.current}px,${currentTranslationY.current}px) scale(${currentScale.current})`;
      }
    }
  }, []);

  const zoomIn = useCallback(() => {
    if (currentScale.current >= 1.5) {
      return;
    }

    currentScale.current = parseFloat((currentScale.current + 0.25).toFixed(2));
    selection.current
      ?.transition()
      .duration(700)
      .call(zoomBehavior.current!.scaleTo, currentScale.current);
    onChangeScale(currentScale.current);
  }, []);

  const zoomOut = useCallback(() => {
    if (currentScale.current <= 0.5) {
      return;
    }

    currentScale.current = parseFloat((currentScale.current - 0.25).toFixed(2));
    selection.current
      ?.transition()
      .duration(700)
      .call(zoomBehavior.current!.scaleTo, currentScale.current);
    onChangeScale(currentScale.current);
  }, []);

  const resetZoom = useCallback(() => {
    currentScale.current = 1;
    selection.current?.transition().duration(700).call(zoomBehavior.current!.scaleTo, 1);
    onChangeScale(1);
  }, []);

  const wheeled = useCallback((event: WheelEvent) => {
    const mouseCoordinates = d3.pointer(event, selection.current!.node());

    const deltaY = event.deltaY;
    const deltaMode = event.deltaMode;

    event.preventDefault();
    hidePopover();

    const scaleMultiplier = -deltaY * (1 === deltaMode ? 0.05 : deltaMode ? 1 : 5e-4);
    zoomBehavior.current!.scaleTo(selection.current!, currentScale.current + scaleMultiplier, [
      mouseCoordinates[0],
      mouseCoordinates[1],
    ]);
    onChangeScale(currentScale.current);
  }, []);

  const centerRoot = useCallback((duration = 0) => {
    selection.current
      ?.transition()
      .duration(duration)
      .call(
        zoomBehavior.current!.transform,
        d3.zoomIdentity.scale(1).translate(viewportWidth.current / 5, viewportHeight.current / 2),
      );
    onChangeScale(1);
  }, []);

  const centerBlock = useCallback((block: CustomHierarchyNode<Box>) => {
    selection.current
      ?.transition()
      .duration(700)
      .call(
        zoomBehavior.current!.transform,
        d3.zoomIdentity
          .scale(currentScale.current)
          .translate(
            -block.x! - block.data.width / 2 + viewportWidth.current / currentScale.current / 3,
            -block.y! + viewportHeight.current / currentScale.current / 2,
          ),
      );
  }, []);

  useEffect(() => {
    const container = getContainer();

    selection.current = d3.select(container!);
    zoomBehavior.current = d3
      .zoom<HTMLDivElement, unknown>()
      .interpolate(d3.interpolate)
      .scaleExtent([0.5, 1.5])
      .on('zoom', zoomed);

    selection.current
      .call(zoomBehavior.current)
      .on('click', () => {
        hidePopover();
      })
      .on('dblclick.zoom', null)
      .on('wheel.zoom', wheeled);

    viewportWidth.current = container!.clientWidth;
    viewportHeight.current = container!.clientHeight;

    centerRoot();
  }, []);

  return {
    centerBlock,
    centerRoot,
    zoomIn,
    zoomOut,
    resetZoom,
  };
}
