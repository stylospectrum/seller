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

export class BotResponseButton {
  deleted?: boolean;
  content: string;
  goTo?: string;
  id?: string;

  constructor(button: BotResponseButton) {
    this.content = button?.content;
    this.id = button?.id;
    this.goTo = button?.goTo;
  }
}

export default class BotResponse {
  image_url?: string;
  story_block_id?: string;

  id?: string;
  storyBlockId?: string;
  type: BotResponseType;
  deleted?: boolean;
  variants?: BotResponseText[] = [];
  buttons?: BotResponseButton[] = [];
  imageId?: string;
  imageUrl?: string;

  constructor(response: BotResponse) {
    this.id = response.id;
    this.type = response.type;
    this.storyBlockId = response.storyBlockId;
    this.variants = (response.variants || []).map((variant) => new BotResponseText(variant));
    this.buttons = (response.buttons || []).map((button) => new BotResponseButton(button));
    this.imageUrl = response.imageUrl;
  }
}
