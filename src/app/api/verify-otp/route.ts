import { axios } from '@/lib/axios';

interface VerifyOTPResponse {
  valid?: boolean;
}

export const POST = async (request: Request) => {
  const data = await request.json();

  try {
    const response = await axios.post<VerifyOTPResponse>('/authentication/verify-otp', data);
    return Response.json(response);
  } catch (err: any) {
    return Response.json(err.response.data);
  }
};
