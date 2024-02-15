import Axios, { InternalAxiosRequestConfig } from 'axios';

import storage from '@/utils/storage';
import { toSnakeCaseKeys } from '@/utils/toSnakeCaseKeys';

function requestInterceptor(config: InternalAxiosRequestConfig) {
  const tokens = storage.getToken();
  if (tokens) {
    config.headers.authorization = `Bearer ${tokens.accessToken}`;
  }
  config.headers!.Accept = 'application/json';

  if (config.data) {
    config.data = toSnakeCaseKeys(config.data);
  }
  return config;
}

export const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

axios.interceptors.request.use(requestInterceptor);
axios.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.resolve(error?.response?.data);
  },
);
