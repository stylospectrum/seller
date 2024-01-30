import { useEffect, useRef, useState } from 'react';
import { flextree } from 'd3-flextree';

import { createHierarchyTree, generatePath, processBoxes } from '../utils';
import { Box } from '../utils/box';
import { CustomHierarchyNode } from '../utils/hierarchy';
import { BotStoryBlock } from '@/model';

export default function useDiagram(rawBlock: BotStoryBlock | null) {
  const [diagram, setDiagram] = useState<{ blocks?: CustomHierarchyNode<Box>[]; paths?: string[] }>(
    {},
  );

  useEffect(() => {
    if (!rawBlock) {
      return;
    }

    const boxes = processBoxes(rawBlock);
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
  }, [rawBlock]);

  return {
    blocks: diagram.blocks,
    paths: diagram.paths,
  };
}
