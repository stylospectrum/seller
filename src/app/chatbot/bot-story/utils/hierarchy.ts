import { hierarchy, HierarchyNode } from 'd3-hierarchy';

import { Box } from './box';

interface CustomHierarchyNode<Datum>
  extends Omit<HierarchyNode<Datum>, 'value' | 'depth' | 'parent' | 'children' | 'height'> {
  value?: number;
  depth: number;
  isRoot?: boolean;
  parent: this | null;
  children?: this[] | undefined;
  x?: number;
  y?: number;
  height?: number;
}

export default function createHierarchyTree<Datum extends Box>(
  data: Datum,
  getChildNodes: (node: CustomHierarchyNode<Datum>) => Datum[],
) {
  const rootNode: CustomHierarchyNode<Datum> = hierarchy(data);
  rootNode.isRoot = true;
  rootNode.height = 0;
  const stack = [rootNode];
  const initialValue = +data.value && (rootNode.value = data.value);
  const idToNodeMap: { [key: string]: CustomHierarchyNode<Datum> } = {};
  const nodeArray = [];

  while (stack.length) {
    const currentNode = stack.pop()!;
    const childNodes = getChildNodes(currentNode) || [];
    currentNode.children = [];
    currentNode.value = initialValue ? +currentNode.data.value : currentNode.value;
    nodeArray.push(currentNode);
    idToNodeMap[currentNode.data.id] = currentNode;

    for (let i = childNodes.length - 1; i >= 0; --i) {
      const childData = childNodes[i];
      const childNode: CustomHierarchyNode<Datum> = hierarchy(childData);
      childNode.depth = currentNode.depth! + 1;
      childNode.parent = currentNode;
      childNode.height = 0;
      currentNode.children[i] = childNode;
      stack.push(childNode);
    }
  }

  return {
    tree: rootNode,
    map: idToNodeMap,
    array: nodeArray,
  };
}
