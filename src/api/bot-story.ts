import type { ServerResponse } from '@/interface';
import { axios } from '@/lib/axios';
import { BotResponse, BotStoryBlock } from '@/model';

class BotStoryApi {
  async getStoryBlocks() {
    try {
      const res: ServerResponse<BotStoryBlock> = await axios.get('/bot-builder/story-block/');

      if (!res?.data) {
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
      const res: ServerResponse<BotStoryBlock> = await axios.post('/bot-builder/story-block/', {
        ...rest,
        parent_id: parentId,
      });

      if (!res?.data) {
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
      const res: ServerResponse<BotStoryBlock> = await axios.delete('/bot-builder/story-block/', {
        data: {
          ...rest,
          is_delete_many: isDeleteMany,
        },
      });

      if (!res?.data) {
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
        '/bot-builder/story-block/',
        params,
      );

      if (!res?.data) {
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

  async getBotResponse(storyBlockId: string) {
    try {
      const res: ServerResponse<BotResponse[]> = await axios.get(
        `/bot-builder/story-block/bot-response/${storyBlockId}/`,
      );

      if (res.statusCode === 404 || !res?.data) {
        return null;
      }

      return res.data.map((item) => {
        return new BotResponse({
          id: item.id,
          type: item.type,
          variants: item.variants,
          buttons: item.buttons,
          imageUrl: item.image_url!,
        });
      });
    } catch (err) {
      throw err;
    }
  }

  async createBotResponse(params: BotResponse[]) {
    try {
      const newParams = params.map((param) => {
        const { storyBlockId, imageId, ...rest } = param;

        return {
          ...rest,
          image_id: imageId,
          story_block_id: storyBlockId,
        };
      });
      return await axios.post('/bot-builder/story-block/bot-response/', newParams);
    } catch (err) {
      throw err;
    }
  }
}

const botStoryApi = new BotStoryApi();

export default botStoryApi;
