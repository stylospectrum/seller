import { axios } from '@/lib/axios';

interface SendOTPToEmailResponse {
  sent?: boolean;
}

export const POST = async (request: Request) => {
  const data = await request.json();

  try {
    const response = await axios.post<SendOTPToEmailResponse>(
      '/authentication/send-otp-to-email',
      data,
    );
    return Response.json(response);
  } catch (err: any) {
    return Response.json(err.response.data);
  }
};
