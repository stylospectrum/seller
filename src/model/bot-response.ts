import { BotResponseType } from '@/enums';

export class BotResponseGalleryItem {
  id?: string;
  imageUrl?: string;
  imageId?: string;
  title?: string;
  description?: string;
  buttons?: BotResponseButton[];
  deleted?: boolean;

  constructor(galleryItem: BotResponseGalleryItem & { image_url?: string }) {
    this.id = galleryItem.id;
    this.imageId = galleryItem.imageId;
    this.imageUrl = galleryItem.image_url;
    this.title = galleryItem.title;
    this.description = galleryItem.description;
    this.buttons = (galleryItem.buttons || []).map((button) => new BotResponseButton(button));
  }
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

  constructor(button: BotResponseButton & { go_to?: string }) {
    this.content = button?.content;
    this.id = button?.id;
    this.goTo = button?.go_to;
  }
}

export class BotResponse {
  id?: string;
  storyBlockId?: string;
  type: BotResponseType;
  deleted?: boolean;
  variants?: BotResponseText[] = [];
  buttons?: BotResponseButton[] = [];
  imageUrl?: string;
  imageId?: string;
  gallery?: BotResponseGalleryItem[];

  constructor(response: BotResponse) {
    this.id = response.id;
    this.type = response.type;
    this.storyBlockId = response.storyBlockId;
    this.variants = (response.variants || []).map((variant) => new BotResponseText(variant));
    this.buttons = (response.buttons || []).map((button) => new BotResponseButton(button));
    this.imageUrl = response.imageUrl;
    this.gallery = (response.gallery || []).map(
      (galleryItem) => new BotResponseGalleryItem(galleryItem),
    );
  }
}
