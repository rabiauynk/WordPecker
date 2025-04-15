import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Flame } from 'lucide-react-native';
import { colors } from '../constants/colors';
import { useSettingsStore } from '../store/settingsStore';

interface StreakIndicatorProps {
  count: number;
  size?: 'small' | 'medium' | 'large';
}

export const StreakIndicator: React.FC<StreakIndicatorProps> = ({
  count,
  size = 'medium',
}) => {
  const { theme } = useSettingsStore();
  const themeColors = colors[theme === 'dark' ? 'dark' : 'light'];

  const getSize = () => {
    switch (size) {
      case 'small':
        return {
          container: { padding: 6 },
          icon: 16,
          text: { fontSize: 12 },
        };
      case 'large':
        return {
          container: { padding: 12 },
          icon: 28,
          text: { fontSize: 20 },
        };
      default:
        return {
          container: { padding: 8 },
          icon: 20,
          text: { fontSize: 16 },
        };
    }
  };

  const sizeStyles = getSize();

  return (
    <View style={[styles.container, sizeStyles.container]}>
      <Flame size={sizeStyles.icon} color="#FF9800" />
      <Text style={[styles.count, sizeStyles.text, { color: themeColors.text }]}>{count}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  count: {
    fontWeight: 'bold',
  },
});