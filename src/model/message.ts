export class Message {
  id: string;
  content: string;
  senderId: string;

  constructor(message: Message) {
    this.id = message.id;
    this.content = message.content;
    this.senderId = message.senderId;
  }
}
