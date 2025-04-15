import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../constants/colors';
import { useSettingsStore } from '../store/settingsStore';

interface QuizOptionProps {
  text: string;
  isSelected: boolean;
  isCorrect: boolean;
  isRevealed: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

export const QuizOption: React.FC<QuizOptionProps> = ({
  text,
  isSelected,
  isCorrect,
  isRevealed,
  onSelect,
  disabled
}) => {
  const { theme } = useSettingsStore();
  const themeColors = colors[theme === 'dark' ? 'dark' : 'light'];

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { 
          backgroundColor: themeColors.card,
          borderColor: isSelected ? themeColors.primary : themeColors.border,
          opacity: disabled ? 0.5 : 1
        },
        isRevealed && isSelected && {
          backgroundColor: isCorrect ? themeColors.success + '20' : themeColors.error + '20',
          borderColor: isCorrect ? themeColors.success : themeColors.error,
        }
      ]}
      onPress={onSelect}
      disabled={disabled}
    >
      <Text style={[styles.text, { color: themeColors.text }]}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
  }
});

