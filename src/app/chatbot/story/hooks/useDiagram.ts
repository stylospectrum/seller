import { useRef } from 'react';
import { flextree } from 'd3-flextree';

import { createHierarchyTree, generatePath, processBoxes } from '../utils';

export default function useDiagram(data: any) {
  const area = useRef({
    maxX: 0,
    maxY: 0,
    minY: 0,
  });

  const boxes = processBoxes(data);
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

  return {
    area: area.current,
    hierarchyTree,
    paths,
  };
}
