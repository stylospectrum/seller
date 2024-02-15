export class BotUserInput {
  id: string | null;
  content: string;
  deleted?: boolean;
  storyBlockId?: string;

  constructor(params: BotUserInput) {
    this.id = params.id;
    this.content = params.content;
    this.storyBlockId = params.storyBlockId;
    this.deleted = params.deleted;
  }
}
