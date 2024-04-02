import type { ServerResponse } from '@/interface';
import { axios } from '@/lib/axios';
import { BotEntity, BotVariable } from '@/model';

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
      const res: ServerResponse<boolean> = await axios.post('/bot-builder-entity/entity/', entity);

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
      const res: ServerResponse<boolean> = await axios.put(`/bot-builder-entity/entity/`, entity);

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
      const res: ServerResponse<boolean> = await axios.delete(`/bot-builder-entity/entity/`, {
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
  async getVariables() {
    try {
      const res: ServerResponse<BotVariable[]> = await axios.get('/bot-builder-entity/variable/');

      if (!res?.data) {
        return null;
      }

      return res.data.map((variable) => new BotVariable(variable));
    } catch (err) {
      throw err;
    }
  }

  async createVariable(variable: BotVariable) {
    try {
      const res: ServerResponse<boolean> = await axios.post(
        '/bot-builder-entity/variable/',
        variable,
      );

      if (!res?.data) {
        return null;
      }

      return true;
    } catch (err) {
      throw err;
    }
  }

  async deleteVariable(id: string) {
    try {
      const res: ServerResponse<boolean> = await axios.delete(
        `/bot-builder-entity/variable/${id}/`,
      );

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
