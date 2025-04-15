import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { useSettingsStore } from '../store/settingsStore';

interface ProgressBarProps {
  progress: number; // 0 to 1
  height?: number;
  label?: string;
  showPercentage?: boolean;
  color?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 8,
  label,
  showPercentage = false,
  color,
}) => {
  const { theme } = useSettingsStore();
  const themeColors = colors[theme === 'dark' ? 'dark' : 'light'];
  
  // Ensure progress is between 0 and 1
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const percentage = Math.round(clampedProgress * 100);
  
  const progressColor = color || themeColors.primary;

  return (
    <View style={styles.container}>
      {(label || showPercentage) && (
        <View style={styles.labelContainer}>
          {label && <Text style={[styles.label, { color: themeColors.text }]}>{label}</Text>}
          {showPercentage && <Text style={[styles.percentage, { color: themeColors.textSecondary }]}>{percentage}%</Text>}
        </View>
      )}
      
      <View style={[styles.track, { height, backgroundColor: themeColors.border }]}>
        <View 
          style={[
            styles.progress, 
            { 
              width: `${percentage}%`, 
              height, 
              backgroundColor: progressColor 
            }
          ]} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 8,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  percentage: {
    fontSize: 14,
  },
  track: {
    width: '100%',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progress: {
    borderRadius: 4,
  },
});
