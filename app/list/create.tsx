import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronDown, Check } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useSettingsStore } from '@/store/settingsStore';
import { useWordListsStore } from '@/store/wordListsStore';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { languages } from '@/mocks/languages';

export default function CreateListScreen() {
  const router = useRouter();
  const { theme } = useSettingsStore();
  const { createList, isLoading } = useWordListsStore();
  const themeColors = colors[theme === 'dark' ? 'dark' : 'light'];
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('');
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [validationError, setValidationError] = useState('');
  
  const handleCreateList = async () => {
    // Validation
    if (!title.trim()) {
      setValidationError('Please enter a title for your list');
      return;
    }
    
    if (!targetLanguage) {
      setValidationError('Please select a target language');
      return;
    }
    
    setValidationError('');
    
    await createList({
      title,
      description,
      targetLanguage,
      userId: 'user1', // This would come from auth in a real app
    });
    
    router.back();
  };
  
  const getLanguageName = (code: string) => {
    if (!code) return 'Select a language';
    const language = languages.find(lang => lang.code === code);
    return language ? language.name : code;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]} edges={['bottom']}>
      <Stack.Screen options={{ title: 'Create Word List' }} />
      
      <ScrollView contentContainerStyle={styles.content}>
        {validationError ? (
          <View style={[styles.errorContainer, { backgroundColor: themeColors.error + '20' }]}>
            <Text style={[styles.errorText, { color: themeColors.error }]}>{validationError}</Text>
          </View>
        ) : null}
        
        <Input
          label="List Title"
          placeholder="Enter a title for your list"
          value={title}
          onChangeText={setTitle}
        />
        
        <Input
          label="Description (Optional)"
          placeholder="Add a description for your list"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          style={styles.descriptionInput}
        />
        
        <Text style={[styles.label, { color: themeColors.text }]}>Target Language</Text>
        <TouchableOpacity
          style={[
            styles.languageSelector,
            { backgroundColor: themeColors.card, borderColor: themeColors.border }
          ]}
          onPress={() => setShowLanguageSelector(!showLanguageSelector)}
        >
          <Text style={[
            styles.languageSelectorText,
            { color: targetLanguage ? themeColors.text : themeColors.textSecondary }
          ]}>
            {getLanguageName(targetLanguage)}
          </Text>
          <ChevronDown size={20} color={themeColors.textSecondary} />
        </TouchableOpacity>
        
        {showLanguageSelector && (
          <View style={[styles.languageDropdown, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
            <ScrollView style={styles.languageList} nestedScrollEnabled>
              {languages.map(language => (
                <TouchableOpacity
                  key={language.code}
                  style={[
                    styles.languageItem,
                    language.code === targetLanguage && { backgroundColor: themeColors.primary + '20' }
                  ]}
                  onPress={() => {
                    setTargetLanguage(language.code);
                    setShowLanguageSelector(false);
                  }}
                >
                  <Text style={[styles.languageItemText, { color: themeColors.text }]}>
                    {language.name}
                  </Text>
                  {language.code === targetLanguage && (
                    <Check size={20} color={themeColors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
        
        <Button
          title="Create List"
          onPress={handleCreateList}
          isLoading={isLoading}
          style={styles.createButton}
        />
      </ScrollView>
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
  errorContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
  },
  descriptionInput: {
    height: 100,
    paddingTop: 12,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: '500',
  },
  languageSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  languageSelectorText: {
    fontSize: 16,
  },
  languageDropdown: {
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
    maxHeight: 200,
  },
  languageList: {
    padding: 8,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 4,
  },
  languageItemText: {
    fontSize: 16,
  },
  createButton: {
    marginTop: 16,
  },
});