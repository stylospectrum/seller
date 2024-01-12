import { create } from 'zustand';

import { User } from '@/model';

interface UserStore {
  user: User;
  setUser: (user: User) => void;
}

const userStore = create<UserStore>((set) => ({
  user: new User({ email: '', name: '' }),
  setUser(user) {
    set({ user });
  },
}));

export default userStore;
