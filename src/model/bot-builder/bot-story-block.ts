import { BotStoryBlockType } from '@/enums';

export class BotStoryBlock {
  id?: string | null;
  name?: string;
  type?: BotStoryBlockType;
  parentId?: string;
  children?: BotStoryBlock[];

  constructor(block: BotStoryBlock) {
    this.id = block.id;
    this.name = block.name;
    this.type = block.type;
    this.children = (block.children || []).map((child) => new BotStoryBlock(child));
  }
}
