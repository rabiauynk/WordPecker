import { useRouter } from 'expo-router';
import { BookOpen, Brain, MapPin, Smile } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProgressBar } from '../../components/ProgressBar';
import { StreakIndicator } from '../../components/StreakIndicator';
import { WordListCard } from '../../components/WordListCard';
import { colors } from '../../constants/colors';
import { useTranslation } from '../../constants/translations';
import { useAuthStore } from '../../store/authStore';
import { useLanguageStore } from '../../store/languageStore';
import { useProgressStore } from '../../store/progressStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useWordListsStore } from '../../store/wordListsStore';

export default function HomeScreen() {
  const router = useRouter();
  const { theme } = useSettingsStore((state) => state);
  const { user } = useAuthStore();
  const { lists } = useWordListsStore();
  const { streak, dailyProgress } = useProgressStore();
  const { language } = useLanguageStore();
  const t = useTranslation(language);
  const themeColors = colors[theme === 'dark' ? 'dark' : 'light'];

  // Get recent lists (up to 3)
  const recentLists = [...lists]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  // Calculate today's progress
  const today = new Date().toISOString().split('T')[0];
  const todayProgress = dailyProgress.find(p => p.date === today) || {
    wordsLearned: 0,
    wordsReviewed: 0,
    quizzesTaken: 0,
    correctAnswers: 0,
    totalQuestions: 0,
  };

  const quizAccuracy = todayProgress.totalQuestions > 0
    ? todayProgress.correctAnswers / todayProgress.totalQuestions
    : 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: themeColors.text }]}>
              {t('welcome')}, {user?.displayName || t('learner')}!
            </Text>
            <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
              {t('readyToLearn')}
            </Text>
          </View>
          <StreakIndicator count={streak} size="large" />
        </View>

        <View style={styles.todayProgress}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>{t('todaysProgress')}</Text>

          <View style={styles.progressGrid}>
            <View style={styles.progressItem}>
              <Text style={[styles.progressLabel, { color: themeColors.textSecondary }]}>{t('wordsLearned')}</Text>
              <Text style={[styles.progressValue, { color: themeColors.text }]}>{todayProgress.wordsLearned}</Text>
            </View>

            <View style={styles.progressItem}>
              <Text style={[styles.progressLabel, { color: themeColors.textSecondary }]}>{t('wordsReviewed')}</Text>
              <Text style={[styles.progressValue, { color: themeColors.text }]}>{todayProgress.wordsReviewed}</Text>
            </View>

            <View style={styles.progressItem}>
              <Text style={[styles.progressLabel, { color: themeColors.textSecondary }]}>{t('quizzesTaken')}</Text>
              <Text style={[styles.progressValue, { color: themeColors.text }]}>{todayProgress.quizzesTaken}</Text>
            </View>

            <View style={styles.progressItem}>
              <Text style={[styles.progressLabel, { color: themeColors.textSecondary }]}>{t('quizAccuracy')}</Text>
              <Text style={[styles.progressValue, { color: themeColors.text }]}>
                {Math.round(quizAccuracy * 100)}%
              </Text>
            </View>
          </View>

          <ProgressBar
            progress={quizAccuracy}
            height={8}
            showPercentage={false}
            label={t('quizAccuracy')}
          />
        </View>

        <View style={styles.quickActions}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>{t('quickActions')}</Text>

          <View style={styles.actionGrid}>
            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}
              onPress={() => router.push('/geo-vocab')}
            >
              <MapPin size={24} color={themeColors.primary} />
              <Text style={[styles.actionTitle, { color: themeColors.text }]}>{t('geoVocab')}</Text>
              <Text style={[styles.actionDescription, { color: themeColors.textSecondary }]}>
                {t('learnBasedOnLocation')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}
              onPress={() => router.push('/emoji-mood')}
            >
              <Smile size={24} color={themeColors.primary} />
              <Text style={[styles.actionTitle, { color: themeColors.text }]}>{t('emojiMood')}</Text>
              <Text style={[styles.actionDescription, { color: themeColors.textSecondary }]}>
                {t('learnEmotionVocabulary')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}
              onPress={() => router.push('/lists')}
            >
              <BookOpen size={24} color={themeColors.primary} />
              <Text style={[styles.actionTitle, { color: themeColors.text }]}>{t('myLists')}</Text>
              <Text style={[styles.actionDescription, { color: themeColors.textSecondary }]}>
                Kelime listelerinizi görüntüleyin ve yönetin
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}
              onPress={() => router.push('/learn')}
            >
              <Brain size={24} color={themeColors.primary} />
              <Text style={[styles.actionTitle, { color: themeColors.text }]}>{t('practice')}</Text>
              <Text style={[styles.actionDescription, { color: themeColors.textSecondary }]}>
                {t('startLearningSession')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {recentLists.length > 0 && (
          <View style={styles.recentLists}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: themeColors.text }]}>{t('recentLists')}</Text>
              <TouchableOpacity onPress={() => router.push('/lists')}>
                <Text style={[styles.seeAll, { color: themeColors.primary }]}>{t('seeAll')}</Text>
              </TouchableOpacity>
            </View>

            {recentLists.map(list => (
              <WordListCard
                key={list.id}
                list={list}
                onPress={(list) => router.push(`/list/${list.id}`)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
  },
  todayProgress: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  progressGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  progressItem: {
    width: '50%',
    marginBottom: 16,
  },
  progressLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  progressValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  quickActions: {
    marginBottom: 24,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  actionCard: {
    width: '47%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 12,
  },
  recentLists: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAll: {
    fontSize: 14,
  },
});

