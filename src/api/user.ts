import type { ServerResponse } from '@/interface';
import { axios } from '@/lib/axios';
import { User } from '@/model';

class UserApi {
  async getUser(): Promise<User> {
    const res: ServerResponse<User> = await axios.get('/auth/users');

    return new User({
      id: res.data.id,
      name: res.data.name,
      email: res.data.email,
    });
  }
}

const userApi = new UserApi();

export default userApi;
