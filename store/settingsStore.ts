import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { SettingsState } from '../types/settings';

interface SettingsStore extends SettingsState {
  updateSettings: (settings: Partial<SettingsState>) => void;
  resetSettings: () => void;
}

const defaultSettings = {
  appLanguage: 'en',
  targetLanguage: 'es',
  theme: 'light' as const,
  notifications: true,
  dailyReminderTime: '20:00',
  soundEffects: true,
  isLoading: false,
  error: null,
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...defaultSettings,

      updateSettings: (settings) => {
        set(state => ({
          ...state,
          ...settings,
        }));
      },

      resetSettings: () => {
        set(defaultSettings);
      },
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);