import { ServerResponse } from '@/interface';
import { axios } from '@/lib/axios';

class FileApi {
  getPresignedPost(): Promise<ServerResponse<{ fields: { [key: string]: string }; url: string }>> {
    return axios.get('/file/presigned-post');
  }
}

const fileApi = new FileApi();

export default fileApi;
