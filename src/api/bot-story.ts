import type { ServerResponse } from '@/interface';
import { axios } from '@/lib/axios';
import { BotStoryBlock } from '@/model';

class BotStoryApi {
  async getStoryBlocks() {
    try {
      const res: ServerResponse<BotStoryBlock> = await axios.get('/seller-chatbot/story-block/');

      if (typeof res === 'string') {
        return null;
      }

      return new BotStoryBlock({
        children: res.data.children,
        name: res.data.name,
        type: res.data.type,
      });
    } catch (err) {
      throw err;
    }
  }

  async createStoryBlock(params: BotStoryBlock) {
    try {
      const res: ServerResponse<BotStoryBlock> = await axios.post(
        '/seller-chatbot/story-block/',
        params,
      );

      if (typeof res === 'string') {
        return null;
      }

      return new BotStoryBlock({
        children: res.data.children,
        name: res.data.name,
        type: res.data.type,
      });
    } catch (err) {
      throw err;
    }
  }
}

const botStoryApi = new BotStoryApi();

export default botStoryApi;
