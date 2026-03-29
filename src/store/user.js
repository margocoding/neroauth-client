import { create } from "zustand";

export const useUser = create((set) => ({
  user: null,
  isLoading: true,
  setUser: (userOrUpdater) =>
    set((state) => ({
      user:
        typeof userOrUpdater === "function"
          ? userOrUpdater(state.user)
          : userOrUpdater,
    })),
  setIsLoading: (isLoading) => set({ isLoading }),
}));
