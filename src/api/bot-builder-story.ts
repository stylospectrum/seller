import type { ServerResponse } from '@/interface';
import { axios } from '@/lib/axios';
import { BotFilter, BotResponse, BotStoryBlock, BotUserInput } from '@/model';

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
        storyBlock: BotStoryBlock;
        botResponses: BotResponse[];
      }> = await axios.get(`/bot-builder-story/bot-response/${storyBlockId}/`);

      if (res.statusCode === 404 || !res?.data) {
        return null;
      }

      return {
        storyBlock: new BotStoryBlock({
          children: res.data.storyBlock.children,
          name: res.data.storyBlock.name,
          type: res.data.storyBlock.type,
        }),
        botResponses: res.data.botResponses.map((item) => {
          return new BotResponse({
            id: item.id,
            type: item.type,
            variants: item.variants,
            buttons: item.buttons,
            imageUrl: item.imageUrl!,
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
      const res: ServerResponse<{ storyBlock: BotStoryBlock; bot_response: BotResponse[] }> =
        await axios.post('/bot-builder-story/bot-response/', {
          storyBlock: params.storyBlock,
          botResponses: params.botResponses,
        });

      if (!res?.data?.storyBlock?.id) {
        return null;
      }

      return {
        storyBlock: new BotStoryBlock({
          children: res.data.storyBlock.children,
          name: res.data.storyBlock.name,
          type: res.data.storyBlock.type,
        }),
      };
    } catch (err) {
      throw err;
    }
  }

  async getUserInputs(storyBlockId: string) {
    try {
      const res: ServerResponse<{
        storyBlock: BotStoryBlock;
        userInputs: BotUserInput[];
      }> = await axios.get(`/bot-builder-story/user-input/${storyBlockId}/`);

      if (res.statusCode === 404 || !res?.data) {
        return null;
      }

      return {
        storyBlock: new BotStoryBlock({
          children: res.data.storyBlock.children,
          name: res.data.storyBlock.name,
          type: res.data.storyBlock.type,
        }),
        userInputs: res.data.userInputs.map((item) => {
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
      const res: ServerResponse<{ storyBlock: BotStoryBlock; bot_response: BotResponse[] }> =
        await axios.post('/bot-builder-story/user-input/', {
          storyBlock: params.storyBlock,
          userInputs: params.userInputs,
        });

      if (!res?.data?.storyBlock?.id) {
        return null;
      }

      return {
        storyBlock: new BotStoryBlock({
          children: res.data.storyBlock.children,
          name: res.data.storyBlock.name,
          type: res.data.storyBlock.type,
        }),
      };
    } catch (err) {
      throw err;
    }
  }

  async getFilter(storyBlockId: string) {
    try {
      const res: ServerResponse<{
        storyBlock: BotStoryBlock;
        filter: BotFilter;
      }> = await axios.get(`/bot-builder-story/filter/${storyBlockId}/`);

      if (res.statusCode === 404 || !res?.data) {
        return null;
      }

      return {
        storyBlock: new BotStoryBlock({
          children: res.data.storyBlock.children,
          name: res.data.storyBlock.name,
          type: res.data.storyBlock.type,
        }),
        filter: res.data.filter && new BotFilter(res.data.filter),
      };
    } catch (err) {
      throw err;
    }
  }

  async createFilter(params: { storyBlock: BotStoryBlock; filter: BotFilter }) {
    try {
      const res: ServerResponse<{ storyBlock: BotStoryBlock; bot_response: BotResponse[] }> =
        await axios.post('/bot-builder-story/filter/', {
          storyBlock: params.storyBlock,
          filter: params.filter,
        });

      if (!res?.data?.storyBlock?.id) {
        return null;
      }

      return {
        storyBlock: new BotStoryBlock({
          children: res.data.storyBlock.children,
          name: res.data.storyBlock.name,
          type: res.data.storyBlock.type,
        }),
      };
    } catch (err) {
      throw err;
    }
  }
}

const botBuilderStoryApi = new BotBuilderStoryApi();

export default botBuilderStoryApi;
