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
      const res: ServerResponse<{
        story_block: BotStoryBlock;
        bot_response: (BotResponse & { image_url: string })[];
      }> = await axios.get(`/bot-builder/story-block/bot-response/${storyBlockId}/`);

      if (res.statusCode === 404 || !res?.data) {
        return null;
      }

      return {
        storyBlock: new BotStoryBlock({
          children: res.data.story_block.children,
          name: res.data.story_block.name,
          type: res.data.story_block.type,
        }),
        botResponses: res.data.bot_response.map((item) => {
          return new BotResponse({
            id: item.id,
            type: item.type,
            variants: item.variants,
            buttons: item.buttons,
            imageUrl: item.image_url!,
            gallery: item.gallery,
          });
        }),
      };
    } catch (err) {
      throw err;
    }
  }

  async createBotResponse(params: { storyBlock: BotStoryBlock; botResponses: BotResponse[] }) {
    try {
      const newBotResponse = params.botResponses.map((response) => {
        const { storyBlockId, imageId, ...rest } = response;

        return {
          ...rest,
          image_id: imageId,
          story_block_id: storyBlockId,
        };
      });
      const res: ServerResponse<{ story_block: BotStoryBlock; bot_response: BotResponse[] }> =
        await axios.post('/bot-builder/story-block/bot-response/', {
          story_block: params.storyBlock,
          bot_responses: newBotResponse,
        });

      if (!res?.data?.story_block?.id) {
        return null;
      }

      return {
        storyBlock: new BotStoryBlock({
          children: res.data.story_block.children,
          name: res.data.story_block.name,
          type: res.data.story_block.type,
        }),
      };
    } catch (err) {
      throw err;
    }
  }
}

const botStoryApi = new BotStoryApi();

export default botStoryApi;
