import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Edit2, Trash2, Volume2, VolumeX } from 'lucide-react-native';
import { Word } from '../types/wordList';
import { colors } from '../constants/colors';
import { useSettingsStore } from '../store/settingsStore';

interface WordCardProps {
  word: Word;
  onEdit?: (word: Word) => void;
  onDelete?: (word: Word) => void;
  onPlayAudio?: (word: Word) => void;
  showActions?: boolean;
}

export const WordCard: React.FC<WordCardProps> = ({ 
  word, 
  onEdit, 
  onDelete, 
  onPlayAudio,
  showActions = true
}) => {
  const { theme } = useSettingsStore();
  const themeColors = colors[theme === 'dark' ? 'dark' : 'light'];
  
  const getMasteryLevelColor = (level: number) => {
    const colors = [
      '#F44336', // Level 0 - Red
      '#FF9800', // Level 1 - Orange
      '#FFEB3B', // Level 2 - Yellow
      '#8BC34A', // Level 3 - Light Green
      '#4CAF50', // Level 4 - Green
      '#2196F3', // Level 5 - Blue
    ];
    return colors[level] || colors[0];
  };

  return (
    <View style={[styles.card, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
      <View style={styles.header}>
        <View style={styles.termContainer}>
          <Text style={[styles.term, { color: themeColors.text }]}>{word.term}</Text>
          <View 
            style={[
              styles.masteryIndicator, 
              { backgroundColor: getMasteryLevelColor(word.masteryLevel) }
            ]} 
          />
        </View>
        
        {showActions && (
          <View style={styles.actions}>
            {word.audioUrl && (
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => onPlayAudio && onPlayAudio(word)}
              >
                <Volume2 size={20} color={themeColors.primary} />
              </TouchableOpacity>
            )}
            
            {onEdit && (
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => onEdit(word)}
              >
                <Edit2 size={20} color={themeColors.primary} />
              </TouchableOpacity>
            )}
            
            {onDelete && (
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => onDelete(word)}
              >
                <Trash2 size={20} color={themeColors.error} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
      
      <Text style={[styles.definition, { color: themeColors.text }]}>{word.definition}</Text>
      
      {word.example && (
        <Text style={[styles.example, { color: themeColors.textSecondary }]}>
          "{word.example}"
        </Text>
      )}
      
      {word.imageUrl && (
        <Image 
          source={{ uri: word.imageUrl }} 
          style={styles.image} 
          resizeMode="cover"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  termContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  term: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  masteryIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  definition: {
    fontSize: 16,
    marginBottom: 8,
  },
  example: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginTop: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
});