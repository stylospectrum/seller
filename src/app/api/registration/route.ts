import { axios } from '@/lib/axios';

interface SignUpResponse {
  id: string;
  name: string;
  email: string;
}

export const POST = async (request: Request) => {
  const data = await request.json();

  try {
    const response = await axios.post<SignUpResponse>('/authentication/sign-up', {
      ...data,
      role: 'Seller',
    });

    return Response.json(response);
  } catch (err: any) {
    return Response.json(err.response.data);
  }
};
