import { create } from 'zustand';

interface AuthStore {
  accessToken?: string;
  setAccessToken: (accessToken: string) => void;
}

const authStore = create<AuthStore>((set) => ({
  accessToken: '',
  setAccessToken(accessToken) {
    set({ accessToken });
  },
}));

export default authStore;
