import { Button } from '@/components/Button';
import { WordCard } from '@/components/WordCard';
import { colors } from '@/constants/colors';
import { useSettingsStore } from '@/store/settingsStore';
import { Stack } from 'expo-router';
import { Check, RefreshCw, Smile } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// English emoji moods and related words
const emojiMoods = [
  { emoji: '😊', mood: 'Happy', words: [
    { id: 'h1', term: 'cheerful', definition: 'noticeably happy and optimistic', example: 'You look very cheerful today.', masteryLevel: 0, createdAt: new Date().toISOString() },
    { id: 'h2', term: 'joyful', definition: 'feeling, expressing, or causing great pleasure and happiness', example: 'We had a joyful weekend.', masteryLevel: 0, createdAt: new Date().toISOString() },
    { id: 'h3', term: 'delighted', definition: 'feeling or showing great pleasure', example: 'She was delighted to pass the exam.', masteryLevel: 0, createdAt: new Date().toISOString() },
  ]},
  { emoji: '😢', mood: 'Sad', words: [
    { id: 's1', term: 'sorrowful', definition: 'feeling or showing grief', example: 'We watched a sorrowful movie.', masteryLevel: 0, createdAt: new Date().toISOString() },
    { id: 's2', term: 'melancholic', definition: 'feeling or expressing pensive sadness', example: 'He became melancholic when he heard the news.', masteryLevel: 0, createdAt: new Date().toISOString() },
    { id: 's3', term: 'gloomy', definition: 'dark or poorly lit, especially so as to appear depressing', example: 'He was looking out the window with a gloomy expression.', masteryLevel: 0, createdAt: new Date().toISOString() },
  ]},
  { emoji: '😡', mood: 'Angry', words: [
    { id: 'a1', term: 'furious', definition: 'extremely angry', example: 'He left the room in a furious manner.', masteryLevel: 0, createdAt: new Date().toISOString() },
    { id: 'a2', term: 'irritated', definition: 'showing or feeling slight anger', example: 'He woke up very irritated this morning.', masteryLevel: 0, createdAt: new Date().toISOString() },
    { id: 'a3', term: 'enraged', definition: 'very angry; furious', example: 'He was speaking in an enraged tone.', masteryLevel: 0, createdAt: new Date().toISOString() },
  ]},
  { emoji: '😴', mood: 'Tired', words: [
    { id: 't1', term: 'exhausted', definition: 'drained of energy or effectiveness', example: 'He returned from work in an exhausted state.', masteryLevel: 0, createdAt: new Date().toISOString() },
    { id: 't2', term: 'weary', definition: 'feeling or showing tiredness', example: 'She felt weary because she was sick.', masteryLevel: 0, createdAt: new Date().toISOString() },
    { id: 't3', term: 'fatigued', definition: 'extremely tired', example: 'He was fatigued after the long walk.', masteryLevel: 0, createdAt: new Date().toISOString() },
  ]},
  { emoji: '😮', mood: 'Surprised', words: [
    { id: 'su1', term: 'astonished', definition: 'greatly surprised or impressed', example: 'He listened to the news with astonishment.', masteryLevel: 0, createdAt: new Date().toISOString() },
    { id: 'su2', term: 'startled', definition: 'feeling or showing sudden shock or alarm', example: 'He was startled when he heard the news.', masteryLevel: 0, createdAt: new Date().toISOString() },
    { id: 'su3', term: 'bewildered', definition: 'perplexed and confused; very puzzled', example: 'He looked around with a bewildered expression.', masteryLevel: 0, createdAt: new Date().toISOString() },
  ]},
  { emoji: '😨', mood: 'Scared', words: [
    { id: 'sc1', term: 'frightened', definition: 'afraid or anxious', example: 'He jumped up in a frightened state from the sound.', masteryLevel: 0, createdAt: new Date().toISOString() },
    { id: 'sc2', term: 'anxious', definition: 'feeling or showing worry, nervousness', example: 'He is very anxious due to recent events.', masteryLevel: 0, createdAt: new Date().toISOString() },
    { id: 'sc3', term: 'worried', definition: 'anxious or troubled about actual or potential problems', example: 'He was looking at the clock with worried eyes.', masteryLevel: 0, createdAt: new Date().toISOString() },
  ]},
];

export default function EmojiMoodScreen() {
  const { theme } = useSettingsStore();
  const themeColors = colors[theme === 'dark' ? 'dark' : 'light'];

  const [selectedMood, setSelectedMood] = useState<typeof emojiMoods[0] | null>(null);
  const [userSentence, setUserSentence] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleSelectMood = (mood: typeof emojiMoods[0]) => {
    setSelectedMood(mood);
    setIsSubmitted(false);
    setUserSentence('');
    setFeedback('');
  };

  const handleSubmitSentence = () => {
    if (!userSentence.trim()) {
      return;
    }

    const containsMoodWord = selectedMood?.words.some(word =>
      userSentence.toLowerCase().includes(word.term.toLowerCase())
    );

    if (containsMoodWord) {
      setFeedback('Harika! You used one of the emotion words correctly.');
    } else {
      setFeedback('Try again! Remember to use one of the emotion words in your sentence.');
    }

    setIsSubmitted(true);
  };

  const handleTryAgain = () => {
    setIsSubmitted(false);
    setUserSentence('');
    setFeedback('');
  };

  const handleNewMood = () => {
    setSelectedMood(null);
    setIsSubmitted(false);
    setUserSentence('');
    setFeedback('');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]} edges={['bottom']}>
      <Stack.Screen options={{ title: 'Emotion Words' }} />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: themeColors.text }]}>Emotion Words</Text>
          <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
            Learn words related to different emotions
          </Text>
        </View>

        {!selectedMood ? (
          <>
            <Text style={[styles.instruction, { color: themeColors.text }]}>
              Select an emotion to see related words:
            </Text>

            <View style={styles.emojiGrid}>
              {emojiMoods.map((mood, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.emojiCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}
                  onPress={() => handleSelectMood(mood)}
                >
                  <Text style={styles.emoji}>{mood.emoji}</Text>
                  <Text style={[styles.moodName, { color: themeColors.text }]}>{mood.mood}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : (
          <>
            <View style={[styles.selectedMoodCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
              <Text style={styles.selectedEmoji}>{selectedMood.emoji}</Text>
              <Text style={[styles.selectedMoodName, { color: themeColors.text }]}>{selectedMood.mood}</Text>
              <TouchableOpacity
                style={[styles.changeMoodButton, { borderColor: themeColors.border }]}
                onPress={handleNewMood}
              >
                <Text style={[styles.changeMoodText, { color: themeColors.primary }]}>Change Emotion</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.vocabularySection}>
              <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Words</Text>

              {selectedMood.words.map(word => (
                <WordCard
                  key={word.id}
                  word={word}
                  showActions={false}
                />
              ))}
            </View>

            <View style={styles.practiceSection}>
              <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Practice</Text>
              <Text style={[styles.practiceInstruction, { color: themeColors.textSecondary }]}>
                Write a sentence using one of the words above:
              </Text>

              <View style={[styles.inputContainer, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
                <TextInput
                  style={[styles.sentenceInput, { color: themeColors.text }]}
                  placeholder="Write your sentence here..."
                  placeholderTextColor={themeColors.textSecondary}
                  value={userSentence}
                  onChangeText={setUserSentence}
                  multiline
                  editable={!isSubmitted}
                />
              </View>

              {isSubmitted ? (
                <>
                  <View style={[
                    styles.feedbackContainer,
                    {
                      backgroundColor: feedback.includes('Harika')
                        ? themeColors.success + '20'
                        : themeColors.warning + '20'
                    }
                  ]}>
                    <Text style={[
                      styles.feedbackText,
                      {
                        color: feedback.includes('Harika')
                          ? themeColors.success
                          : themeColors.warning
                      }
                    ]}>
                      {feedback.includes('Harika') ? 'Great! You used one of the emotion words correctly.' : 'Try again! Remember to use one of the emotion words in your sentence.'}
                    </Text>
                  </View>

                  <View style={styles.actionButtons}>
                    <Button
                      title="Try Again"
                      onPress={handleTryAgain}
                      variant="outline"
                      leftIcon={<RefreshCw size={20} color={themeColors.primary} />}
                      style={styles.actionButton}
                    />

                    <Button
                      title="New Emotion"
                      onPress={handleNewMood}
                      leftIcon={<Smile size={20} color="#FFFFFF" />}
                      style={styles.actionButton}
                    />
                  </View>
                </>
              ) : (
                <Button
                  title="Check Sentence"
                  onPress={handleSubmitSentence}
                  disabled={!userSentence.trim()}
                  leftIcon={<Check size={20} color="#FFFFFF" />}
                  style={StyleSheet.flatten([
                    styles.checkButton,
                    !userSentence.trim() && { opacity: 0.5 }
                  ])}
                />
              )}
            </View>
          </>
        )}
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
  instruction: {
    fontSize: 16,
    marginBottom: 16,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  emojiCard: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  moodName: {
    fontSize: 14,
    fontWeight: '500',
  },
  selectedMoodCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 24,
  },
  selectedEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  selectedMoodName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  changeMoodButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  changeMoodText: {
    fontSize: 14,
    fontWeight: '500',
  },
  vocabularySection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  practiceSection: {
    marginBottom: 24,
  },
  practiceInstruction: {
    fontSize: 14,
    marginBottom: 12,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  sentenceInput: {
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  checkButton: {
    marginTop: 8,
  },
  feedbackContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  feedbackText: {
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  }
});

