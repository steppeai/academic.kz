"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface StudyProfile {
  goal: string;
  targetDegree: string;
  field: string;
  city: string;
  language: string;
  gpa: string;
  testScore: string;
  budget: string;
  admissionYear: string;
  experience: string;
  notes: string;
  emailNotifications: boolean;
  interestedBolashak: boolean;
}

export interface MockUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  profile: StudyProfile;
}

const DEFAULT_PROFILE: StudyProfile = {
  goal: "Поступить на магистратуру с понятным планом документов, сроков и программ.",
  targetDegree: "Магистратура",
  field: "IT",
  city: "Астана",
  language: "Английский",
  gpa: "3.7/4.0",
  testScore: "IELTS 7.0",
  budget: "до 2 000 000 ₸ в год",
  admissionYear: "2026",
  experience: "1 год исследовательского или проектного опыта",
  notes: "Проверить дедлайны, требования к рекомендациям и документы для Болашак.",
  emailNotifications: true,
  interestedBolashak: true,
};

const createDefaultProfile = (): StudyProfile => ({ ...DEFAULT_PROFILE });
const createEmptyProfile = (): StudyProfile => ({
  goal: "",
  targetDegree: "",
  field: "",
  city: "",
  language: "",
  gpa: "",
  testScore: "",
  budget: "",
  admissionYear: "",
  experience: "",
  notes: "",
  emailNotifications: true,
  interestedBolashak: false,
});

const createAvatar = (name: string) =>
  name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const normalizeUser = (user: MockUser): MockUser => ({
  ...user,
  profile: { ...createDefaultProfile(), ...user.profile },
});

// Test account for dev mode
export const MOCK_USERS: { email: string; password: string; user: MockUser }[] = [
  {
    email: "test@academik.kz",
    password: "123456",
    user: {
      id: "u1",
      name: "Айгерим Сатпаева",
      email: "test@academik.kz",
      avatar: "АС",
      profile: createDefaultProfile(),
    },
  },
];

interface AuthStore {
  user: MockUser | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  register: (name: string, email: string, password: string) => { success: boolean; error?: string };
  loginWithGoogle: () => void;
  updateUser: (data: Partial<Pick<MockUser, "name" | "email" | "avatar">>) => void;
  updateProfile: (profile: Partial<StudyProfile>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,

      login: (email, password) => {
        const found = MOCK_USERS.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );
        if (found) {
          set({ user: normalizeUser(found.user) });
          return { success: true };
        }
        return { success: false, error: "Неверный email или пароль" };
      },

      register: (name, email, password) => {
        if (!name || !email || !password) {
          return { success: false, error: "Заполните все поля" };
        }
        if (password.length < 4) {
          return { success: false, error: "Пароль слишком короткий" };
        }
        // Mock: create a new user on-the-fly
        const newUser: MockUser = {
          id: `u_${Date.now()}`,
          name,
          email,
          avatar: createAvatar(name),
          profile: createEmptyProfile(),
        };
        set({ user: newUser });
        return { success: true };
      },

      loginWithGoogle: () => {
        // Simulate Google login with the first mock user
        set({ user: normalizeUser(MOCK_USERS[0].user) });
      },

      updateUser: (data) => {
        set((state) => {
          if (!state.user) return state;

          const nextName = data.name ?? state.user.name;
          return {
            user: {
              ...state.user,
              ...data,
              avatar: data.avatar ?? (data.name ? createAvatar(nextName) : state.user.avatar),
            },
          };
        });
      },

      updateProfile: (profile) => {
        set((state) => {
          if (!state.user) return state;
          return {
            user: {
              ...state.user,
              profile: { ...state.user.profile, ...profile },
            },
          };
        });
      },

      logout: () => set({ user: null }),
    }),
    {
      name: "academik-auth",
      version: 2,
      migrate: (persistedState) => {
        const state = persistedState as AuthStore;
        return state.user ? { ...state, user: normalizeUser(state.user) } : state;
      },
    }
  )
);
