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
      const { parentId, ...rest } = params;
      const res: ServerResponse<BotStoryBlock> = await axios.post('/seller-chatbot/story-block/', {
        ...rest,
        parent_id: parentId,
      });

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

  async deleteStoryBlock(params: { id: string; isDeleteMany: boolean }) {
    try {
      const { isDeleteMany, ...rest } = params;
      const res: ServerResponse<BotStoryBlock> = await axios.delete(
        '/seller-chatbot/story-block/',
        {
          data: {
            ...rest,
            is_delete_many: isDeleteMany,
          },
        },
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

  async updateStoryBlock(params: BotStoryBlock) {
    try {
      const res: ServerResponse<BotStoryBlock> = await axios.put(
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
