export interface Settings {
  appLanguage: string;
  targetLanguage: string;
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  dailyReminderTime?: string;
  soundEffects: boolean;
}

export interface SettingsState extends Settings {
  isLoading: boolean;
  error: string | null;
}