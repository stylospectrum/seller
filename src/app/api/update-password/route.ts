import { axios } from '@/lib/axios';

interface UpdatePasswordResponse {
  ok?: boolean;
}

export const POST = async (request: Request) => {
  const data = await request.json();

  try {
    const response = await axios.post<UpdatePasswordResponse>('/users/update-password', data);
    return Response.json(response);
  } catch (err: any) {
    return Response.json(err.response.data);
  }
};
