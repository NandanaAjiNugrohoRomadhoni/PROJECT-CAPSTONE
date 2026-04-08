import { create } from "zustand";

type User = {
  id: number;
  name: string;
  role: string;
};

type AuthState = {
  user: User | null;
  setUser: (user: User) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  setUser: (user) => set({ user }),
}));