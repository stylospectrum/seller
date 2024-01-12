import type { User } from '@/model';

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignInResponse {
  accessToken: string;
  refreshToken: string;
}

export interface SendOtpToEmailRequest {
  email: string;
  isSignUp?: boolean;
}

export interface SendOtpToEmailResponse {
  sent: boolean;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
  valid: boolean;
}

export interface UpdatePasswordRequest extends SignInRequest {}

export interface UpdatePasswordResponse extends SignInResponse {
  user: User;
}
