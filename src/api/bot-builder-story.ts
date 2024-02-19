import type { ServerResponse } from '@/interface';
import { axios } from '@/lib/axios';
import { BotResponse, BotStoryBlock, BotUserInput } from '@/model';

class BotBuilderStoryApi {
  async getStoryBlocks() {
    try {
      const res: ServerResponse<BotStoryBlock> = await axios.get('/bot-builder-story/story-block/');

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
      const res: ServerResponse<BotStoryBlock> = await axios.post(
        '/bot-builder-story/story-block/',
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

  async deleteStoryBlock(params: { id: string; isDeleteMany: boolean }) {
    try {
      const res: ServerResponse<BotStoryBlock> = await axios.delete(
        '/bot-builder-story/story-block/',
        {
          data: {
            id: params.id,
            is_delete_many: params.isDeleteMany,
          },
        },
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

  async updateStoryBlock(params: BotStoryBlock) {
    try {
      const res: ServerResponse<BotStoryBlock> = await axios.put(
        '/bot-builder-story/story-block/',
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
        bot_responses: (BotResponse & { image_url: string })[];
      }> = await axios.get(`/bot-builder-story/story-block/bot-response/${storyBlockId}/`);

      if (res.statusCode === 404 || !res?.data) {
        return null;
      }

      return {
        storyBlock: new BotStoryBlock({
          children: res.data.story_block.children,
          name: res.data.story_block.name,
          type: res.data.story_block.type,
        }),
        botResponses: res.data.bot_responses.map((item) => {
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
      const res: ServerResponse<{ story_block: BotStoryBlock; bot_response: BotResponse[] }> =
        await axios.post('/bot-builder-story/story-block/bot-response/', {
          story_block: params.storyBlock,
          bot_responses: params.botResponses,
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

  async getUserInput(storyBlockId: string) {
    try {
      const res: ServerResponse<{
        story_block: BotStoryBlock;
        user_inputs: BotUserInput[];
      }> = await axios.get(`/bot-builder-story/story-block/user-input/${storyBlockId}/`);

      if (res.statusCode === 404 || !res?.data) {
        return null;
      }

      return {
        storyBlock: new BotStoryBlock({
          children: res.data.story_block.children,
          name: res.data.story_block.name,
          type: res.data.story_block.type,
        }),
        userInputs: res.data.user_inputs.map((item) => {
          return new BotUserInput({
            id: item.id,
            content: item.content,
          });
        }),
      };
    } catch (err) {
      throw err;
    }
  }

  async createUserInput(params: { storyBlock: BotStoryBlock; userInputs: BotUserInput[] }) {
    try {
      const res: ServerResponse<{ story_block: BotStoryBlock; bot_response: BotResponse[] }> =
        await axios.post('/bot-builder-story/story-block/user-input/', {
          story_block: params.storyBlock,
          user_inputs: params.userInputs,
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

const botBuilderStoryApi = new BotBuilderStoryApi();

export default botBuilderStoryApi;
