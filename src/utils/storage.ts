import { SignInResponse } from '@/interface';

const storagePrefix = 'stylospectrum_seller_';

const storage = {
  getToken: () => {
    return JSON.parse(
      window.localStorage.getItem(`${storagePrefix}token`) as string,
    ) as SignInResponse;
  },
  setToken: (token: SignInResponse) => {
    window.localStorage.setItem(`${storagePrefix}token`, JSON.stringify(token));
  },
  clearToken: () => {
    window.localStorage.removeItem(`${storagePrefix}token`);
  },
};

export default storage;
