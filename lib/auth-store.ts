"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AuthUser { id: number; email: string; name: string | null; role: string | null; }
interface AuthStore { user: AuthUser | null; token: string | null; setAuth: (user: AuthUser, token: string) => void; logout: () => void; isLoggedIn: () => boolean; }

export const useAuthStore = create<AuthStore>()(persist((set, get) => ({
  user: null, token: null,
  setAuth: (user, token) => set({ user, token }),
  logout: () => set({ user: null, token: null }),
  isLoggedIn: () => !!get().token,
}), { name: "academik-auth" }));
