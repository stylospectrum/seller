import { create } from 'zustand';

interface PasswordAssistanceStore {
  email: string;
  setEmail: (email: string) => void;
}

const useEmailStore = create<PasswordAssistanceStore>((set) => ({
  email: '',
  setEmail: (email) => set(() => ({ email })),
}));

export default useEmailStore;
