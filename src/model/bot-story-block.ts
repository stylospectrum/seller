export enum BotStoryBlockType {
  UserInput = 'UserInput',
  BotResponse = 'BotResponse',
  StartPoint = 'StartPoint',
  DefaultFallback = 'DefaultFallback',
}

export default class BotStoryBlock {
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
