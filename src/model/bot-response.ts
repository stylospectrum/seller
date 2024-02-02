export enum BotResponseType {
  Text = 'Text',
  RandomText = 'RandomText',
  Image = 'Image',
  Gallery = 'Gallery',
  QuickReply = 'QuickReply',
}

export class BotResponseText {
  deleted?: boolean;
  content: string;
  id?: string;

  constructor(text: BotResponseText) {
    this.content = text?.content;
    this.id = text?.id;
  }
}

export default class BotResponse {
  id?: string;
  storyBlockId?: string;
  type: BotResponseType;
  text?: BotResponseText;
  deleted?: boolean;
  variants?: BotResponseText[] = [];

  constructor(response: BotResponse) {
    this.id = response.id;
    this.type = response.type;
    this.text = new BotResponseText(response.text!);
    this.variants = (response.variants || []).map((variant) => new BotResponseText(variant));
    this.storyBlockId = response.storyBlockId;
  }
}
