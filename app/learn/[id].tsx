import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Brain, Repeat, CheckCircle, HelpCircle, Zap } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useSettingsStore } from '@/store/settingsStore';
import { useWordListsStore } from '@/store/wordListsStore';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/Button';

export default function LearnListScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { theme } = useSettingsStore();
  const { lists } = useWordListsStore();
  const themeColors = colors[theme === 'dark' ? 'dark' : 'light'];
  
  // Find the list by id
  const list = lists.find(list => list.id === id);
  
  if (!list) {
    return (
      <EmptyState
        title="List Not Found"
        message="The word list you're looking for doesn't exist"
        icon={<HelpCircle size={64} color={themeColors.primary} />}
        actionLabel="Go Back"
        onAction={() => router.back()}
      />
    );
  }
  
  if (list.words.length === 0) {
    return (
      <EmptyState
        title="No Words to Learn"
        message="Add some words to this list first"
        icon={<Brain size={64} color={themeColors.primary} />}
        actionLabel="Add Words"
        onAction={() => router.push({ pathname: '/list/add-word', params: { listId: list.id } })}
      />
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]} edges={['bottom']}>
      <Stack.Screen options={{ title: `Learn: ${list.title}` }} />
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: themeColors.text }]}>Choose Learning Mode</Text>
          <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
            Select how you want to practice {list.words.length} words
          </Text>
        </View>
        
        <View style={styles.modes}>
          <TouchableOpacity 
            style={[styles.modeCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}
            onPress={() => router.push({ pathname: '/learn/flashcards', params: { listId: list.id } })}
          >
            <View style={[styles.modeIcon, { backgroundColor: themeColors.primary + '20' }]}>
              <Repeat size={24} color={themeColors.primary} />
            </View>
            <View style={styles.modeContent}>
              <Text style={[styles.modeName, { color: themeColors.text }]}>Flashcards</Text>
              <Text style={[styles.modeDescription, { color: themeColors.textSecondary }]}>
                Review words with interactive flashcards
              </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.modeCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}
            onPress={() => router.push({ pathname: '/quiz/multiple-choice', params: { listId: list.id } })}
          >
            <View style={[styles.modeIcon, { backgroundColor: themeColors.primary + '20' }]}>
              <CheckCircle size={24} color={themeColors.primary} />
            </View>
            <View style={styles.modeContent}>
              <Text style={[styles.modeName, { color: themeColors.text }]}>Multiple Choice</Text>
              <Text style={[styles.modeDescription, { color: themeColors.textSecondary }]}>
                Test your knowledge with multiple choice questions
              </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.modeCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}
            onPress={() => router.push({ pathname: '/quiz/fill-blanks', params: { listId: list.id } })}
          >
            <View style={[styles.modeIcon, { backgroundColor: themeColors.primary + '20' }]}>
              <HelpCircle size={24} color={themeColors.primary} />
            </View>
            <View style={styles.modeContent}>
              <Text style={[styles.modeName, { color: themeColors.text }]}>Fill in the Blanks</Text>
              <Text style={[styles.modeDescription, { color: themeColors.textSecondary }]}>
                Complete sentences with the correct words
              </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.modeCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}
            onPress={() => router.push({ pathname: '/quiz/quick', params: { listId: list.id } })}
          >
            <View style={[styles.modeIcon, { backgroundColor: themeColors.primary + '20' }]}>
              <Zap size={24} color={themeColors.primary} />
            </View>
            <View style={styles.modeContent}>
              <Text style={[styles.modeName, { color: themeColors.text }]}>Quick Quiz</Text>
              <Text style={[styles.modeDescription, { color: themeColors.textSecondary }]}>
                Take a quick 5-question quiz
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.stats}>
          <Text style={[styles.statsTitle, { color: themeColors.text }]}>List Stats</Text>
          
          <View style={[styles.statsCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>Words</Text>
              <Text style={[styles.statValue, { color: themeColors.text }]}>{list.words.length}</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>Mastered</Text>
              <Text style={[styles.statValue, { color: themeColors.text }]}>
                {list.words.filter(word => word.masteryLevel >= 4).length}
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>Learning</Text>
              <Text style={[styles.statValue, { color: themeColors.text }]}>
                {list.words.filter(word => word.masteryLevel > 0 && word.masteryLevel < 4).length}
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>New</Text>
              <Text style={[styles.statValue, { color: themeColors.text }]}>
                {list.words.filter(word => word.masteryLevel === 0).length}
              </Text>
            </View>
          </View>
        </View>
        
        <Button
          title="Back to List"
          onPress={() => router.push(`/list/${list.id}`)}
          variant="outline"
          style={styles.backButton}
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
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  modes: {
    marginBottom: 24,
  },
  modeCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  modeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  modeContent: {
    flex: 1,
  },
  modeName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  modeDescription: {
    fontSize: 14,
  },
  stats: {
    marginBottom: 24,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsCard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  statItem: {
    width: '50%',
    marginBottom: 16,
  },
  statLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  backButton: {
    marginBottom: 16,
  },
});
