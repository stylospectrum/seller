import { BotStoryBlockType } from '@/enums';

interface BoxSize {
  height: number;
  width: number;
  size: [number, number];
}

export interface Box {
  value?: any;
  id: string;
  type: BotStoryBlockType;
  nested: any[];
  flowParent: this | null;
  children: this[];
  parent: this;
  width: number;
  name: string;
}

function createBox(height: number, width: number, extraHeight = 85, extraWidth = 100): BoxSize {
  return {
    height,
    width,
    size: [height + extraHeight, width + extraWidth],
  };
}

const BOX_TYPES: { [key in BotStoryBlockType | 'Default']?: BoxSize } = {
  [BotStoryBlockType.UserInput]: createBox(60, 60, 80),
  [BotStoryBlockType.DefaultFallback]: createBox(40, 164),
  [BotStoryBlockType.Filter]: createBox(40, 90),
  Default: createBox(40, 150),
};

function getBoxSize(box: Box) {
  return BOX_TYPES[box.type] || BOX_TYPES.Default;
}

export default function processBoxes(rootBox: any) {
  const queue = [rootBox];
  const boxMap: { [key: string]: Box } = {};
  const boxArray: Box[] = [];

  while (queue.length) {
    const currentBox: Box = queue.pop();
    boxArray.push(currentBox);
    boxMap[currentBox.id] = currentBox;

    const flowParent = currentBox.flowParent || null;
    const boxSize = getBoxSize(currentBox);
    const { width, height, size } = boxSize!;

    Object.assign(currentBox, {
      width,
      height,
      size,
      flowParent,
    });

    if (currentBox.children) {
      for (let i = currentBox.children.length - 1; i >= 0; --i) {
        const childBox = currentBox.children[i];
        childBox.parent = currentBox;
        childBox.flowParent = currentBox.flowParent;
        queue.push(childBox);
      }
    }

    if (currentBox.nested) {
      for (let i = currentBox.nested.length - 1; i >= 0; --i) {
        const nestedBox = currentBox.nested[i];
        nestedBox.parent = currentBox;
        nestedBox.flowParent = currentBox.flowParent;
        nestedBox.nestedParent = currentBox;
        queue.push(nestedBox);
      }
    }
  }

  return {
    tree: rootBox,
    map: boxMap,
    array: boxArray,
  };
}
