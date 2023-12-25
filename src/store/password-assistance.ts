import { create } from 'zustand';

interface PasswordAssistanceStore {
  email: string;
  setEmail: (email: string) => void;
}

const usePasswordAssistanceStore = create<PasswordAssistanceStore>((set) => ({
  email: '',
  setEmail: (email) => set(() => ({ email })),
}));

export default usePasswordAssistanceStore;
