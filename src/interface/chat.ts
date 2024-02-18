export interface GetMessageRequest {
  conversationId: string;
  limit?: number;
}

export interface GetMessageResponse {
  id: string;
  content: string;
  senderId: string;
}
