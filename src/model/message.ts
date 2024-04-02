import { BotResponseButtonExpr } from '.';
import { MessageType } from '@/enums';

class MessageButton {
  content: string;
  goTo: string;
  exprs?: BotResponseButtonExpr[];

  constructor(params: MessageButton) {
    this.content = params.content;
    this.goTo = params.goTo;
    this.exprs = params.exprs;
  }
}

export class MessageGalleryItem {
  title: string;
  imgUrl: string;
  description: string;
  buttons: MessageButton[];

  constructor(params: MessageGalleryItem) {
    this.title = params.title;
    this.imgUrl = params.imgUrl;
    this.description = params.description;
    this.buttons = (params.buttons || []).map((button) => new MessageButton(button));
  }
}

export class Message {
  id: string;
  content: string;
  senderId: string;
  imgUrl?: string;
  type?: MessageType;
  buttons?: MessageButton[];
  gallery?: MessageGalleryItem[];
  typing?: boolean;

  constructor(message: Message) {
    this.id = message.id;
    this.content = message.content;
    this.senderId = message.senderId;
    this.imgUrl = message.imgUrl;
    this.type = message.type;
    this.buttons = message.buttons;
    this.typing = message.typing;
    this.gallery = (message.gallery || []).map((item) => new MessageGalleryItem(item));
  }
}
