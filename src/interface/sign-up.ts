import type { SignInResponse } from './sign-in';
import type { User } from '@/model';

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
  otp: string;
}

export interface SignUpResponse extends SignInResponse {
  user: User;
  emailValid: boolean;
}
