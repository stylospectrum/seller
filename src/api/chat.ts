import type { GetMessageRequest, GetMessageResponse, ServerResponse } from '@/interface';
import { axios } from '@/lib/axios';
import { Message } from '@/model';

class ChatApi {
  getConversations() {
    return axios.get('/chat/conversations');
  }

  async getMessages(params: GetMessageRequest): Promise<Message[]> {
    const messages: ServerResponse<GetMessageResponse[]> = await axios.get(`/chat/messages`, {
      params: {
        conversationId: params.conversationId,
        limit: params.limit || 10,
      },
    });

    return messages.data.map(
      (message) =>
        new Message({ id: message.id, content: message.content, senderId: message.senderId }),
    );
  }

  async deleteConversation(conversationId: string): Promise<ServerResponse<boolean>> {
    return axios.delete(`/chat/conversations/${conversationId}`);
  }
}

const chatApi = new ChatApi();

export default chatApi;
