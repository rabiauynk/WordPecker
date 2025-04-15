import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Book, Clock, Hash } from 'lucide-react-native';
import { WordList } from '../types/wordList';
import { colors } from '../constants/colors';
import { useSettingsStore } from '../store/settingsStore';
import { languages } from '../mocks/languages';

interface WordListCardProps {
  list: WordList;
  onPress: (list: WordList) => void;
}

export const WordListCard: React.FC<WordListCardProps> = ({ list, onPress }) => {
  const { theme } = useSettingsStore();
  const themeColors = colors[theme === 'dark' ? 'dark' : 'light'];
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  const getLanguageName = (code: string) => {
    const language = languages.find(lang => lang.code === code);
    return language ? language.name : code;
  };

  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: themeColors.card, borderColor: themeColors.border }]} 
      onPress={() => onPress(list)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: themeColors.text }]}>{list.title}</Text>
        <View style={[styles.languageTag, { backgroundColor: themeColors.primary }]}>
          <Text style={styles.languageText}>{getLanguageName(list.targetLanguage)}</Text>
        </View>
      </View>
      
      {list.description && (
        <Text style={[styles.description, { color: themeColors.textSecondary }]} numberOfLines={2}>
          {list.description}
        </Text>
      )}
      
      <View style={styles.footer}>
        <View style={styles.infoItem}>
          <Hash size={16} color={themeColors.textSecondary} />
          <Text style={[styles.infoText, { color: themeColors.textSecondary }]}>
            {list.wordCount} words
          </Text>
        </View>
        
        <View style={styles.infoItem}>
          <Clock size={16} color={themeColors.textSecondary} />
          <Text style={[styles.infoText, { color: themeColors.textSecondary }]}>
            Updated {formatDate(list.updatedAt)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  languageTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  languageText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 12,
  },
});