import { EmptyState } from '@/components/EmptyState';
import { colors } from '@/constants/colors';
import { useSettingsStore } from '@/store/settingsStore';
import { useWordListsStore } from '@/store/wordListsStore';
import { useRouter } from 'expo-router';
import { Brain, CheckCircle, HelpCircle, Repeat, Zap } from 'lucide-react-native';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LearnScreen() {
  const router = useRouter();
  const { theme } = useSettingsStore();
  const { lists } = useWordListsStore();
  const themeColors = colors[theme === 'dark' ? 'dark' : 'light'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: themeColors.text }]}>Learn</Text>
      </View>

      {lists.length === 0 ? (
        <EmptyState
          title="No Lists to Learn From"
          message="Create a word list first to start learning"
          icon={<Brain size={64} color={themeColors.primary} />}
          actionLabel="Create List"
          onAction={() => router.push('/list/create')}
        />
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.learningModes}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Learning Modes</Text>

            <TouchableOpacity
              style={[styles.modeCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}
              onPress={() => router.push('/learn/flashcards')}
            >
              <View style={styles.modeIconContainer}>
                <Repeat size={24} color={themeColors.primary} />
              </View>
              <View style={styles.modeContent}>
                <Text style={[styles.modeTitle, { color: themeColors.text }]}>Flashcards</Text>
                <Text style={[styles.modeDescription, { color: themeColors.textSecondary }]}>
                  Review words with interactive flashcards
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modeCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}
              onPress={() => lists.length > 0 ? router.push(`/learn/${lists[0].id}`) : null}
            >
              <View style={styles.modeIconContainer}>
                <CheckCircle size={24} color={themeColors.primary} />
              </View>
              <View style={styles.modeContent}>
                <Text style={[styles.modeTitle, { color: themeColors.text }]}>Multiple Choice</Text>
                <Text style={[styles.modeDescription, { color: themeColors.textSecondary }]}>
                  Test your knowledge with multiple choice questions
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modeCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}
              onPress={() => lists.length > 0 ? router.push(`/learn/${lists[0].id}`) : null}
            >
              <View style={styles.modeIconContainer}>
                <HelpCircle size={24} color={themeColors.primary} />
              </View>
              <View style={styles.modeContent}>
                <Text style={[styles.modeTitle, { color: themeColors.text }]}>Fill in the Blanks</Text>
                <Text style={[styles.modeDescription, { color: themeColors.textSecondary }]}>
                  Complete sentences with the correct words
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modeCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}
              onPress={() => lists.length > 0 ? router.push(`/learn/${lists[0].id}`) : null}
            >
              <View style={styles.modeIconContainer}>
                <Zap size={24} color={themeColors.primary} />
              </View>
              <View style={styles.modeContent}>
                <Text style={[styles.modeTitle, { color: themeColors.text }]}>Quick Quiz</Text>
                <Text style={[styles.modeDescription, { color: themeColors.textSecondary }]}>
                  Take a quick quiz from your word lists
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.yourLists}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Your Lists</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.listsScroll}>
              {lists.map(list => (
                <TouchableOpacity
                  key={list.id}
                  style={[styles.listCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}
                  onPress={() => router.push(`/learn/${list.id}`)}
                >
                  <View style={[styles.listImageContainer, { backgroundColor: themeColors.primary + '20' }]}>
                    <Image
                      source={{ uri: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=1471&auto=format&fit=crop' }}
                      style={styles.listImage}
                      resizeMode="cover"
                    />
                  </View>
                  <Text style={[styles.listTitle, { color: themeColors.text }]} numberOfLines={1}>
                    {list.title}
                  </Text>
                  <Text style={[styles.listCount, { color: themeColors.textSecondary }]}>
                    {list.wordCount} words
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.specialFeatures}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Special Features</Text>

            <View style={styles.featuresGrid}>
              <TouchableOpacity
                style={[styles.featureCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}
                onPress={() => router.push('/geo-vocab')}
              >
                <Text style={[styles.featureTitle, { color: themeColors.text }]}>GeoVocab</Text>
                <Text style={[styles.featureDescription, { color: themeColors.textSecondary }]}>
                  Learn words based on your location
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.featureCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}
                onPress={() => router.push('/emoji-mood')}
              >
                <Text style={[styles.featureTitle, { color: themeColors.text }]}>EmojiMood</Text>
                <Text style={[styles.featureDescription, { color: themeColors.textSecondary }]}>
                  Learn emotion-based vocabulary
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  learningModes: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modeCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  modeIconContainer: {
    marginRight: 16,
  },
  modeContent: {
    flex: 1,
  },
  modeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  modeDescription: {
    fontSize: 14,
  },
  yourLists: {
    marginBottom: 24,
  },
  listsScroll: {
    marginBottom: 8,
  },
  listCard: {
    width: 150,
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    borderWidth: 1,
  },
  listImageContainer: {
    width: 126,
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
    overflow: 'hidden',
  },
  listImage: {
    width: '100%',
    height: '100%',
  },
  listTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  listCount: {
    fontSize: 12,
  },
  specialFeatures: {
    marginBottom: 24,
  },
  featuresGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  featureCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 12,
  },
});
