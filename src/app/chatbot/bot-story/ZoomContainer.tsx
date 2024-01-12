import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import * as d3 from 'd3';
import { flextree } from 'd3-flextree';

import mockData from './mockData';
import styles from './style/zomContainer.module.scss';
import { createHierarchyTree, generatePath, processBoxes } from './utils';

export default function ZoomContainer() {
  const zoomDomRef = useRef<HTMLDivElement>(null);
  const diagramDomRef = useRef<HTMLDivElement>(null);
  const selection = useRef<d3.Selection<HTMLDivElement, unknown, null, undefined>>();
  const zoomBehavior = useRef<d3.ZoomBehavior<HTMLDivElement, unknown>>();
  const currentScale = useRef(1);
  const currentTranslationX = useRef(0);
  const currentTranslationY = useRef(0);
  const area = useRef({
    maxX: 0,
    maxY: 0,
    minY: 0,
  });
  const [_, startTransition] = useTransition();
  const [transformationString, setTransformationString] = useState('');
  const [diagram, setDiagram] = useState<{ blocks?: any[]; paths?: any[] }>({});

  const zoomed = useCallback(
    (event: d3.D3ZoomEvent<HTMLDivElement, unknown>) => {
      let hasChanges = false;

      const previousScale = currentScale.current;
      const previousTranslationX = currentTranslationX.current;
      const previousTranslationY = currentTranslationY.current;

      currentScale.current = event.transform.k;
      currentTranslationX.current = Number(event.transform.x.toFixed(2));
      currentTranslationY.current = Number(event.transform.y.toFixed(2));

      if (previousScale !== currentScale.current) {
        hasChanges = true;
        setTranslateExtent();
      }

      if (
        previousTranslationX !== currentTranslationX.current ||
        previousTranslationY !== currentTranslationY.current
      ) {
        hasChanges = true;
      }

      if (hasChanges) {
        diagramDomRef.current!.style.transform = `translate(${currentTranslationX.current}px,${currentTranslationY.current}px) scale(${currentScale.current})`;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const wheeled = useCallback((event: WheelEvent) => {
    const mouseCoordinates = d3.pointer(event, selection.current!.node());
    const mouseX = mouseCoordinates[0];
    const mouseY = mouseCoordinates[1];

    const deltaY = event.deltaY;
    const deltaMode = event.deltaMode;

    event.preventDefault();

    const scaleMultiplier = -deltaY * (1 === deltaMode ? 0.05 : deltaMode ? 1 : 5e-4);
    zoomBehavior.current!.scaleTo(selection.current!, currentScale.current + scaleMultiplier, [
      mouseX,
      mouseY,
    ]);
  }, []);

  const setTranslateExtent = useCallback(() => {
    const viewportWidth = zoomDomRef.current!.clientWidth;
    const viewportHeight = zoomDomRef.current!.clientHeight;
    const shiftConstant = 100;

    const translationXLimit = viewportWidth / currentScale.current;
    const translationYLimit = viewportHeight / currentScale.current;

    zoomBehavior.current?.translateExtent([
      [-translationXLimit - shiftConstant, -translationYLimit + area.current.minY - shiftConstant],
      [
        translationXLimit + area.current.maxX + shiftConstant,
        translationYLimit + area.current.maxY + shiftConstant,
      ],
    ]);
  }, []);

  const centerRoot = useCallback(() => {
    const viewportWidth = zoomDomRef.current!.clientWidth;
    const viewportHeight = zoomDomRef.current!.clientHeight;

    selection.current
      ?.transition()
      .duration(0)
      .call(
        zoomBehavior.current!.transform,
        d3.zoomIdentity.scale(1).translate(viewportWidth / 5, viewportHeight / 2),
      );
  }, []);

  const centerBlock = useCallback((block: any) => {
    const viewportWidth = zoomDomRef.current!.clientWidth;
    const viewportHeight = zoomDomRef.current!.clientHeight;

    selection.current
      ?.transition()
      .duration(700)
      .call(
        zoomBehavior.current!.transform,
        d3.zoomIdentity
          .scale(currentScale.current)
          .translate(
            -block.x - block.data.width / 2 + viewportWidth / currentScale.current / 3,
            -block.y + viewportHeight / currentScale.current / 2,
          ),
      );
  }, []);

  useEffect(() => {
    const boxes = processBoxes(mockData);
    const hierarchyTree = createHierarchyTree(boxes.tree, (node) => {
      const data = node.data;
      const childNodes = data.children;
      const shouldCollapse = false;
      const shouldExclude = false;

      Object.assign(node, {
        isCollapsed: shouldCollapse,
      });

      if (shouldExclude || shouldCollapse) {
        return [];
      }
      return childNodes;
    });
    flextree({})(hierarchyTree.tree as any);

    for (const node of hierarchyTree.array) {
      const posX = node.x!;
      const posY = node.y;
      const halfHeight = node.data.height / 2;

      area.current = {
        maxX: Math.max(area.current.maxX, posY + node.data.width),
        maxY: Math.max(area.current.maxY, posX + halfHeight),
        minY: Math.min(area.current.minY, posX - halfHeight),
      };

      const positionStyles = {
        left: posY,
        top: posX - halfHeight,
      };

      const dimensions = {
        x: posY,
        y: posX - halfHeight,
        height: node.data.height,
        width: node.data.width,
        rx: 20,
      };

      Object.assign(node, {
        x: posY,
        y: posX,
        styleBlock: positionStyles,
        styleMock: dimensions,
      });
    }

    const paths: string[] = [];
    for (const node of hierarchyTree.array) {
      if (node?.parent?.data) {
        const parentXOffset = node.parent.x + node.parent.data.width + 6;
        const parentY = node.parent.y!;
        const childXOffset = node.x! - 6;
        const childY = node.y!;

        paths.push(
          generatePath(node.parent.children!.length, parentXOffset, parentY, childXOffset, childY),
        );
      }
    }
    setDiagram({
      blocks: hierarchyTree.array,
      paths,
    });

    selection.current = d3.select(zoomDomRef.current!);
    zoomBehavior.current = d3
      .zoom<HTMLDivElement, unknown>()
      .interpolate(d3.interpolate)
      .scaleExtent([0.5, 1.5])
      .on('zoom', zoomed);

    selection.current
      .call(zoomBehavior.current)
      .on('dblclick.zoom', null)
      .on('wheel.zoom', wheeled);

    setTranslateExtent();
    centerRoot();
    // eslint-disable-next-line
  }, []);

  return (
    <div className={styles.zoom} ref={zoomDomRef}>
      <div className={styles.diagram} ref={diagramDomRef}>
        <svg className={styles['svg-paths']}>
          {diagram.paths?.map((path, idx) => <path d={path} key={`path-${idx}`} />)}
        </svg>

        {diagram.blocks?.map((block) => (
          <div
            className={styles['block-wrapper']}
            style={block.styleBlock}
            key={`block-${block.data.id}`}
            onClick={() => centerBlock(block)}
          >
            <div className={styles.block} data-type={block.data.type}></div>
          </div>
        ))}
      </div>
    </div>
  );
}
