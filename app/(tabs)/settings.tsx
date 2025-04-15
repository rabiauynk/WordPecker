import { colors } from '@/constants/colors';
import { useTranslation } from '@/constants/translations';
import { languages } from '@/mocks/languages';
import { useAuthStore } from '@/store/authStore';
import { useLanguageStore } from '@/store/languageStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useRouter } from 'expo-router';
import {
  Bell,
  ChevronRight,
  Globe,
  HelpCircle,
  Info,
  LogOut,
  Moon,
  Shield,
  Sun,
  User,
  Volume2
} from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const router = useRouter();
  const { theme, appLanguage, targetLanguage, notifications, soundEffects, updateSettings } = useSettingsStore();
  const { user, logout } = useAuthStore();
  const { language } = useLanguageStore();
  const t = useTranslation(language);
  const themeColors = colors[theme === 'dark' ? 'dark' : 'light'];

  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [languageType, setLanguageType] = useState<'app' | 'target'>('app');

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => {
            logout();
            router.replace('/(auth)');
          },
          style: 'destructive',
        },
      ]
    );
  };

  const toggleTheme = () => {
    updateSettings({ theme: theme === 'dark' ? 'light' : 'dark' });
  };

  const toggleNotifications = () => {
    updateSettings({ notifications: !notifications });
  };

  const toggleSoundEffects = () => {
    updateSettings({ soundEffects: !soundEffects });
  };

  const openLanguageSelector = (type: 'app' | 'target') => {
    setLanguageType(type);
    setShowLanguageSelector(true);
  };

  const selectLanguage = (languageCode: string) => {
    if (languageType === 'app') {
      updateSettings({ appLanguage: languageCode });
    } else {
      updateSettings({ targetLanguage: languageCode });
    }
    setShowLanguageSelector(false);
  };

  const getLanguageName = (code: string) => {
    const language = languages.find(lang => lang.code === code);
    return language ? language.name : code;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]} edges={['top']}>
      {!showLanguageSelector ? (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: themeColors.text }]}>{t('settings')}</Text>
          </View>

          <View style={styles.profileSection}>
            <View style={[styles.profileAvatar, { backgroundColor: themeColors.primary }]}>
              <Text style={styles.profileInitial}>
                {user?.displayName ? user.displayName[0].toUpperCase() : 'U'}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: themeColors.text }]}>
                {user?.displayName || 'User'}
              </Text>
              <Text style={[styles.profileEmail, { color: themeColors.textSecondary }]}>
                {user?.email || 'user@example.com'}
              </Text>
            </View>
            <TouchableOpacity style={styles.profileEdit}>
              <User size={20} color={themeColors.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>{t('appearance')}</Text>

            <View style={[styles.settingItem, { borderBottomColor: themeColors.border }]}>
              <View style={styles.settingLeft}>
                {theme === 'dark' ? (
                  <Moon size={20} color={themeColors.text} />
                ) : (
                  <Sun size={20} color={themeColors.text} />
                )}
                <Text style={[styles.settingText, { color: themeColors.text }]}>
                  {t('darkMode')}
                </Text>
              </View>
              <Switch
                value={theme === 'dark'}
                onValueChange={toggleTheme}
                trackColor={{ false: '#767577', true: themeColors.primary }}
                thumbColor="#f4f3f4"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>{t('language')}</Text>

            <TouchableOpacity
              style={[styles.settingItem, { borderBottomColor: themeColors.border }]}
              onPress={() => router.push('/settings/language')}
            >
              <View style={styles.settingLeft}>
                <Globe size={20} color={themeColors.text} />
                <Text style={[styles.settingText, { color: themeColors.text }]}>
                  {t('language')}
                </Text>
              </View>
              <View style={styles.settingRight}>
                <Text style={[styles.settingValue, { color: themeColors.textSecondary }]}>
                  {getLanguageName(appLanguage)}
                </Text>
                <ChevronRight size={20} color={themeColors.textSecondary} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.settingItem, { borderBottomColor: themeColors.border }]}
              onPress={() => openLanguageSelector('target')}
            >
              <View style={styles.settingLeft}>
                <Globe size={20} color={themeColors.text} />
                <Text style={[styles.settingText, { color: themeColors.text }]}>
                  {t('targetLanguage')}
                </Text>
              </View>
              <View style={styles.settingRight}>
                <Text style={[styles.settingValue, { color: themeColors.textSecondary }]}>
                  {getLanguageName(targetLanguage)}
                </Text>
                <ChevronRight size={20} color={themeColors.textSecondary} />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>{t('notifications')}</Text>

            <View style={[styles.settingItem, { borderBottomColor: themeColors.border }]}>
              <View style={styles.settingLeft}>
                <Bell size={20} color={themeColors.text} />
                <Text style={[styles.settingText, { color: themeColors.text }]}>
                  {t('notifications')}
                </Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={toggleNotifications}
                trackColor={{ false: '#767577', true: themeColors.primary }}
                thumbColor="#f4f3f4"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Ses</Text>

            <View style={[styles.settingItem, { borderBottomColor: themeColors.border }]}>
              <View style={styles.settingLeft}>
                <Volume2 size={20} color={themeColors.text} />
                <Text style={[styles.settingText, { color: themeColors.text }]}>
                  Ses Efektleri
                </Text>
              </View>
              <Switch
                value={soundEffects}
                onValueChange={toggleSoundEffects}
                trackColor={{ false: '#767577', true: themeColors.primary }}
                thumbColor="#f4f3f4"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Destek</Text>

            <TouchableOpacity style={[styles.settingItem, { borderBottomColor: themeColors.border }]}>
              <View style={styles.settingLeft}>
                <HelpCircle size={20} color={themeColors.text} />
                <Text style={[styles.settingText, { color: themeColors.text }]}>
                  Yardım & Destek
                </Text>
              </View>
              <ChevronRight size={20} color={themeColors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.settingItem, { borderBottomColor: themeColors.border }]}>
              <View style={styles.settingLeft}>
                <Shield size={20} color={themeColors.text} />
                <Text style={[styles.settingText, { color: themeColors.text }]}>
                  {t('privacyPolicy')}
                </Text>
              </View>
              <ChevronRight size={20} color={themeColors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.settingItem, { borderBottomColor: themeColors.border }]}>
              <View style={styles.settingLeft}>
                <Info size={20} color={themeColors.text} />
                <Text style={[styles.settingText, { color: themeColors.text }]}>
                  {t('about')}
                </Text>
              </View>
              <ChevronRight size={20} color={themeColors.textSecondary} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.logoutButton, { borderColor: themeColors.error }]}
            onPress={handleLogout}
          >
            <LogOut size={20} color={themeColors.error} />
            <Text style={[styles.logoutText, { color: themeColors.error }]}>{t('signOut')}</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <View style={styles.content}>
          <View style={styles.languageSelectorHeader}>
            <TouchableOpacity onPress={() => setShowLanguageSelector(false)}>
              <Text style={[styles.cancelButton, { color: themeColors.primary }]}>{t('cancel')}</Text>
            </TouchableOpacity>
            <Text style={[styles.languageSelectorTitle, { color: themeColors.text }]}>
              Select {languageType === 'app' ? 'App' : 'Target'} Language
            </Text>
            <View style={{ width: 50 }} />
          </View>

          <ScrollView style={styles.languageList}>
            {languages.map(language => (
              <TouchableOpacity
                key={language.code}
                style={[
                  styles.languageItem,
                  { borderBottomColor: themeColors.border },
                  (languageType === 'app' && language.code === appLanguage) ||
                  (languageType === 'target' && language.code === targetLanguage)
                    ? { backgroundColor: themeColors.primary + '20' }
                    : {}
                ]}
                onPress={() => selectLanguage(language.code)}
              >
                <Text style={[styles.languageName, { color: themeColors.text }]}>
                  {language.name}
                </Text>
                {((languageType === 'app' && language.code === appLanguage) ||
                  (languageType === 'target' && language.code === targetLanguage)) && (
                  <View style={[styles.selectedIndicator, { backgroundColor: themeColors.primary }]} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInitial: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
  },
  profileEdit: {
    padding: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingText: {
    fontSize: 16,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingValue: {
    fontSize: 14,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 16,
    marginBottom: 32,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
  },
  languageSelectorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  cancelButton: {
    fontSize: 16,
  },
  languageSelectorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  languageList: {
    flex: 1,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  languageName: {
    fontSize: 16,
  },
  selectedIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});