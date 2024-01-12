import type {
  SendOtpToEmailRequest,
  SendOtpToEmailResponse,
  ServerResponse,
  SignInRequest,
  SignInResponse,
  SignUpRequest,
  SignUpResponse,
  UpdatePasswordRequest,
  UpdatePasswordResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
} from '@/interface';
import { axios } from '@/lib/axios';

class AuthApi {
  signIn(params: SignInRequest): Promise<ServerResponse<SignInResponse>> {
    return axios.post('/auth/authentication/sign-in', {
      email: params.email,
      password: params.password,
      role: 'Seller',
    });
  }

  sendOTPToEmail(params: SendOtpToEmailRequest): Promise<ServerResponse<SendOtpToEmailResponse>> {
    return axios.post('auth/authentication/send-otp-to-email', {
      role: 'Seller',
      email: params.email,
      isSignUp: params.isSignUp,
    });
  }

  updatePassword(params: UpdatePasswordRequest): Promise<ServerResponse<UpdatePasswordResponse>> {
    return axios.post('auth/authentication/update-password', {
      password: params.password,
      email: params.email,
      role: 'Seller',
    });
  }

  verifyOTP(params: VerifyOtpRequest): Promise<ServerResponse<VerifyOtpResponse>> {
    return axios.post('/auth/authentication/verify-otp', {
      email: params.email,
      code: params.otp,
    });
  }

  signUp(params: SignUpRequest): Promise<ServerResponse<SignUpResponse>> {
    return axios.post('/auth/authentication/sign-up', {
      name: params.name,
      otp: params.otp,
      email: params.email,
      password: params.password,
      role: 'Seller',
    });
  }
}

const authApi = new AuthApi();

export default authApi;
