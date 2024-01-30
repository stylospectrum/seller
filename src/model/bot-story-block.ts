export enum BotStoryBlockType {
  UserInput = 'UserInput',
  BotResponse = 'BotResponse',
  StartPoint = 'StartPoint',
  DefaultFallback = 'DefaultFallback',
}

export default class BotStoryBlock {
  id?: string;
  name: string;
  type: BotStoryBlockType;
  parent_id?: string;
  children?: BotStoryBlock[];

  constructor(block: BotStoryBlock) {
    this.id = block.id || '';
    this.name = block.name;
    this.type = block.type;
    this.children = (block.children || []).map((child) => new BotStoryBlock(child));
  }
}
