import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { flextree } from 'd3-flextree';

import { botBuilderStoryApi } from '@/api';
import { generatePath } from '@/app/(home)/bot-builder/story/utils';
import processBoxes, { Box } from '@/app/(home)/bot-builder/story/utils/box';
import createHierarchyTree, {
  CustomHierarchyNode,
} from '@/app/(home)/bot-builder/story/utils/hierarchy';
import { ExtractFnReturnType } from '@/lib/react-query';

type QueryFnType = typeof botBuilderStoryApi.getStoryBlocks;

export function useBotStoryBlock() {
  const blockQuery = useQuery<ExtractFnReturnType<QueryFnType>>({
    queryKey: ['botStoryBlock'],
    queryFn: () => botBuilderStoryApi.getStoryBlocks(),
  });
  const [diagram, setDiagram] = useState<{ blocks?: CustomHierarchyNode<Box>[]; paths?: string[] }>(
    {},
  );

  useEffect(() => {
    if (blockQuery.data) {
      const boxes = processBoxes(JSON.parse(JSON.stringify(blockQuery.data)));
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
            generatePath(
              node.parent.children!.length,
              parentXOffset,
              parentY,
              childXOffset,
              childY,
            ),
          );
        }
      }

      setDiagram({
        blocks: hierarchyTree.array,
        paths,
      });
    }
  }, [blockQuery.data]);

  return {
    blocks: diagram.blocks,
    paths: diagram.paths,
    loading: blockQuery.isLoading,
    setBlock: () => {},
  };
}
