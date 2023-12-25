import { axios } from '@/lib/axios';

interface SignInResponse {
  accessToken: string;
  refreshToken: string;
}

export const POST = async (request: Request) => {
  const data = await request.json();

  try {
    const response = await axios.post<SignInResponse>('/authentication/sign-in', {
      ...data,
      role: 'Seller',
    });

    return Response.json(response);
  } catch (err: any) {
    return Response.json(err.response.data);
  }
};
