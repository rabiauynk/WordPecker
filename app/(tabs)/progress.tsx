import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarChart2, TrendingUp, Award, Clock } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { useSettingsStore } from '../../store/settingsStore';
import { useProgressStore } from '../../store/progressStore';
import { ProgressBar } from '../../components/ProgressBar';
import { StreakIndicator } from '../../components/StreakIndicator';

export default function ProgressScreen() {
  const { theme } = useSettingsStore();
  const { dailyProgress, streak } = useProgressStore();
  const themeColors = colors[theme === 'dark' ? 'dark' : 'light'];
  
  // Get last 7 days of progress
  const last7Days = [...dailyProgress]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 7)
    .reverse();
  
  // Calculate overall stats
  const totalWordsLearned = dailyProgress.reduce((sum, day) => sum + day.wordsLearned, 0);
  const totalWordsReviewed = dailyProgress.reduce((sum, day) => sum + day.wordsReviewed, 0);
  const totalQuizzesTaken = dailyProgress.reduce((sum, day) => sum + day.quizzesTaken, 0);
  
  const totalCorrectAnswers = dailyProgress.reduce((sum, day) => sum + day.correctAnswers, 0);
  const totalQuestions = dailyProgress.reduce((sum, day) => sum + day.totalQuestions, 0);
  const overallAccuracy = totalQuestions > 0 ? totalCorrectAnswers / totalQuestions : 0;
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: themeColors.text }]}>Your Progress</Text>
          <StreakIndicator count={streak} size="large" />
        </View>
        
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
            <View style={styles.statIconContainer}>
              <Award size={24} color={themeColors.primary} />
            </View>
            <Text style={[styles.statValue, { color: themeColors.text }]}>{totalWordsLearned}</Text>
            <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>Words Learned</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
            <View style={styles.statIconContainer}>
              <Clock size={24} color={themeColors.primary} />
            </View>
            <Text style={[styles.statValue, { color: themeColors.text }]}>{totalWordsReviewed}</Text>
            <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>Words Reviewed</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
            <View style={styles.statIconContainer}>
              <BarChart2 size={24} color={themeColors.primary} />
            </View>
            <Text style={[styles.statValue, { color: themeColors.text }]}>{totalQuizzesTaken}</Text>
            <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>Quizzes Taken</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
            <View style={styles.statIconContainer}>
              <TrendingUp size={24} color={themeColors.primary} />
            </View>
            <Text style={[styles.statValue, { color: themeColors.text }]}>
              {Math.round(overallAccuracy * 100)}%
            </Text>
            <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>Overall Accuracy</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Last 7 Days</Text>
          
          {last7Days.length > 0 ? (
            <View style={styles.weeklyProgress}>
              {last7Days.map((day, index) => (
                <View key={day.date} style={styles.dayProgress}>
                  <View style={styles.dayHeader}>
                    <Text style={[styles.dayDate, { color: themeColors.text }]}>
                      {formatDate(day.date)}
                    </Text>
                    <Text style={[styles.dayStats, { color: themeColors.textSecondary }]}>
                      {day.wordsLearned} learned, {day.wordsReviewed} reviewed
                    </Text>
                  </View>
                  
                  <ProgressBar 
                    progress={day.totalQuestions > 0 ? day.correctAnswers / day.totalQuestions : 0}
                    height={8}
                    showPercentage
                  />
                </View>
              ))}
            </View>
          ) : (
            <View style={[styles.emptyState, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
              <Text style={[styles.emptyStateText, { color: themeColors.textSecondary }]}>
                No activity recorded in the last 7 days. Start learning to see your progress!
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Overall Progress</Text>
          
          <View style={[styles.overallCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
            <View style={styles.overallStat}>
              <Text style={[styles.overallLabel, { color: themeColors.textSecondary }]}>Words Learned</Text>
              <ProgressBar 
                progress={Math.min(totalWordsLearned / 500, 1)} // Assuming 500 is a goal
                label={`${totalWordsLearned} words`}
                showPercentage
              />
            </View>
            
            <View style={styles.overallStat}>
              <Text style={[styles.overallLabel, { color: themeColors.textSecondary }]}>Quiz Accuracy</Text>
              <ProgressBar 
                progress={overallAccuracy}
                label={`${Math.round(overallAccuracy * 100)}%`}
                showPercentage
              />
            </View>
            <View style={styles.overallStat}>
              <Text style={[styles.overallLabel, { color: themeColors.textSecondary }]}>Daily Streak</Text>
              <ProgressBar 
                progress={Math.min(streak / 30, 1)} // Assuming 30 days is a goal
                label={`${streak} days`}
                showPercentage
                color="#FF9800"
              />
            </View>
          </View>
        </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    width: '47%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  statIconContainer: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  weeklyProgress: {
    gap: 16,
  },
  dayProgress: {
    marginBottom: 8,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dayDate: {
    fontSize: 14,
    fontWeight: '500',
  },
  dayStats: {
    fontSize: 12,
  },
  emptyState: {
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    textAlign: 'center',
  },
  overallCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  overallStat: {
    marginBottom: 16,
  },
  overallLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
});
