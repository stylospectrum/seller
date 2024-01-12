import storage from '@/utils/storage';
import Axios, { InternalAxiosRequestConfig } from 'axios';

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  const tokens = storage.getToken();
  if (tokens) {
    config.headers.authorization = `Bearer ${tokens.accessToken}`;
  }
  config.headers!.Accept = 'application/json';
  return config;
}

export const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

axios.interceptors.request.use(authRequestInterceptor);
axios.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.resolve(error?.response?.data);
  },
);
