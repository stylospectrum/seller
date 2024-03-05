import type { ServerResponse } from '@/interface';
import { axios } from '@/lib/axios';
import { BotEntity } from '@/model';

class BotBuilderEntityApi {
  async getEntities() {
    try {
      const res: ServerResponse<BotEntity[]> = await axios.get('/bot-builder-entity/entity/');

      if (!res?.data) {
        return null;
      }

      return res.data.map((entity) => new BotEntity(entity));
    } catch (err) {
      throw err;
    }
  }

  async createEntity(entity: BotEntity) {
    try {
      const res: ServerResponse<BotEntity> = await axios.post(
        '/bot-builder-entity/entity/',
        entity,
      );

      if (!res?.data) {
        return null;
      }

      return true;
    } catch (err) {
      throw err;
    }
  }

  async updateEntity(entity: BotEntity) {
    try {
      const res: ServerResponse<BotEntity> = await axios.put(`/bot-builder-entity/entity/`, entity);

      if (!res?.data) {
        return null;
      }

      return true;
    } catch (err) {
      throw err;
    }
  }

  async deleteEntities(entityIds: string[]) {
    try {
      const res: ServerResponse<BotEntity> = await axios.delete(`/bot-builder-entity/entity/`, {
        data: {
          ids: entityIds,
        },
      });

      if (!res?.data) {
        return null;
      }

      return true;
    } catch (err) {
      throw err;
    }
  }
}

const botBuilderEntityApi = new BotBuilderEntityApi();

export default botBuilderEntityApi;
