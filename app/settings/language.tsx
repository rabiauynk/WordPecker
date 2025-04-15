import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useSettingsStore } from '@/store/settingsStore';
import { useLanguageStore, Language } from '@/store/languageStore';
import { useTranslation } from '@/constants/translations';

export default function LanguageScreen() {
  const router = useRouter();
  const { theme } = useSettingsStore();
  const { language, setLanguage } = useLanguageStore();
  const t = useTranslation(language);
  const themeColors = colors[theme === 'dark' ? 'dark' : 'light'];
  
  const languages: { code: Language; name: string }[] = [
    { code: 'en', name: t('english') },
    { code: 'tr', name: t('turkish') },
  ];
  
  const handleSelectLanguage = (code: Language) => {
    setLanguage(code);
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]} edges={['bottom']}>
      <Stack.Screen options={{ title: t('language') }} />
      
      <View style={styles.content}>
        {languages.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={[
              styles.languageOption,
              { 
                backgroundColor: themeColors.card,
                borderColor: themeColors.border,
              }
            ]}
            onPress={() => handleSelectLanguage(lang.code)}
          >
            <Text style={[styles.languageName, { color: themeColors.text }]}>
              {lang.name}
            </Text>
            
            {language === lang.code && (
              <Check size={20} color={themeColors.primary} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '500',
  },
});
