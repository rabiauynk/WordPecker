import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, Award, HelpCircle, Check, X } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useSettingsStore } from '@/store/settingsStore';
import { useWordListsStore } from '@/store/wordListsStore';
import { useProgressStore } from '@/store/progressStore';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/Button';
import { ProgressBar } from '@/components/ProgressBar';
import { Word } from '@/types/wordList';

interface FillBlankQuestion {
  word: Word;
  sentence: string;
  answer: string;
}

export default function FillBlanksScreen() {
  const { listId } = useLocalSearchParams<{ listId: string }>();
  const router = useRouter();
  const { theme } = useSettingsStore();
  const { lists } = useWordListsStore();
  const { recordQuizResult } = useProgressStore();
  const themeColors = colors[theme === 'dark' ? 'dark' : 'light'];
  
  const list = lists.find(list => list.id === listId);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [questions, setQuestions] = useState<FillBlankQuestion[]>([]);

  const createQuestions = (words: Word[]): FillBlankQuestion[] => {
    const shuffledWords = [...words].sort(() => 0.5 - Math.random());
    const selectedWords = shuffledWords.slice(0, 8); // 8 questions for fill in the blanks
    
    return selectedWords.map(word => {
      let sentence = '';
      
      // Use example if available, otherwise create a simple sentence
      if (word.example) {
        sentence = word.example.replace(new RegExp(word.term, 'gi'), '_____');
      } else {
        sentence = `The definition of _____ is: ${word.definition}`;
      }
      
      return {
        word,
        sentence,
        answer: word.term.toLowerCase(),
      };
    });
  };
  
  useEffect(() => {
    if (list && list.words.length > 0) {
      const generatedQuestions = createQuestions(list.words);
      setQuestions(generatedQuestions);
    }
  }, [list]);

  const handleCheckAnswer = () => {
    if (!userAnswer.trim()) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    const isAnswerCorrect = userAnswer.toLowerCase().trim() === currentQuestion.answer.toLowerCase();
    
    setIsCorrect(isAnswerCorrect);
    setIsAnswerChecked(true);
    
    if (isAnswerCorrect) {
      setCorrectAnswers(prev => prev + 1);
    }
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setUserAnswer('');
      setIsAnswerChecked(false);
    } else {
      setQuizComplete(true);
      recordQuizResult(correctAnswers + (isCorrect ? 1 : 0), questions.length);
    }
  };
  
  const handleRestartQuiz = () => {
    if (!list) return;
    
    const generatedQuestions = createQuestions(list.words);
    setQuestions(generatedQuestions);
    setCurrentQuestionIndex(0);
    setUserAnswer('');
    setIsAnswerChecked(false);
    setIsCorrect(false);
    setCorrectAnswers(0);
    setQuizComplete(false);
  };

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
  
  if (list.words.length < 3) {
    return (
      <EmptyState
        title="Not Enough Words"
        message="You need at least 3 words in this list for fill in the blanks exercises"
        icon={<HelpCircle size={64} color={themeColors.primary} />}
        actionLabel="Add More Words"
        onAction={() => router.push({ pathname: '/list/add-word', params: { listId: list.id } })}
      />
    );
  }
  
  if (questions.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        <Text style={[styles.loading, { color: themeColors.text }]}>Loading questions...</Text>
      </View>
    );
  }
  
  if (quizComplete) {
    const finalScore = correctAnswers;
    const scorePercentage = (finalScore / questions.length) * 100;
    
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]} edges={['bottom']}>
        <Stack.Screen options={{ title: 'Fill in the Blanks' }} />
        
        <View style={styles.resultsContainer}>
          <View style={[styles.resultsCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
            <Award size={64} color={themeColors.primary} />
            <Text style={[styles.resultsTitle, { color: themeColors.text }]}>Exercise Complete!</Text>
            <Text style={[styles.resultsScore, { color: themeColors.text }]}>
              Your Score: {finalScore}/{questions.length} ({Math.round(scorePercentage)}%)
            </Text>
            <ProgressBar 
              progress={finalScore / questions.length}
              height={12}
              showPercentage={false}
            />
            <Text style={[styles.resultsFeedback, { color: themeColors.textSecondary }]}>
              {scorePercentage >= 80 
                ? 'Excellent work! You\'re mastering these words.' 
                : scorePercentage >= 60 
                  ? 'Good job! Keep practicing to improve.' 
                  : 'Keep practicing! You\'ll get better with time.'}
            </Text>
          </View>
          
          <View style={styles.resultsButtons}>
            <Button
              title="Try Again"
              onPress={handleRestartQuiz}
              style={{ width: '100%', marginBottom: 12 }}
            />
            <Button
              title="Back to List"
              onPress={() => router.push(`/learn/${list.id}`)}
              variant="outline"
              style={{ width: '100%' }}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
  
  const currentQuestion = questions[currentQuestionIndex];
  
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]} edges={['bottom']}>
        <Stack.Screen options={{ title: 'Fill in the Blanks' }} />
        
        <View style={styles.content}>
          <View style={styles.progress}>
            <Text style={[styles.progressText, { color: themeColors.text }]}>
              Question {currentQuestionIndex + 1} of {questions.length}
            </Text>
            <ProgressBar 
              progress={currentQuestionIndex / questions.length}
              height={8}
              showPercentage={false}
            />
          </View>
          
          <View style={styles.questionContainer}>
            <Text style={[styles.instructions, { color: themeColors.textSecondary }]}>
              Fill in the blank with the correct word:
            </Text>
            <Text style={[styles.sentence, { color: themeColors.text }]}>
              {currentQuestion.sentence}
            </Text>
          </View>
          
          <View style={styles.answerContainer}>
            <TextInput
              style={[
                styles.answerInput, 
                { 
                  borderColor: isAnswerChecked 
                    ? isCorrect 
                      ? themeColors.success 
                      : themeColors.error 
                    : themeColors.border,
                  color: themeColors.text,
                  backgroundColor: themeColors.card,
                }
              ]}
              placeholder="Type your answer here"
              placeholderTextColor={themeColors.textSecondary}
              value={userAnswer}
              onChangeText={setUserAnswer}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isAnswerChecked}
            />
            
            {isAnswerChecked && (
              <View style={styles.feedbackContainer}>
                {isCorrect ? (
                  <View style={[styles.feedbackBox, { backgroundColor: themeColors.success + '20' }]}>
                    <Check size={20} color={themeColors.success} />
                    <Text style={[styles.feedbackText, { color: themeColors.success }]}>
                      Correct!
                    </Text>
                  </View>
                ) : (
                  <View style={[styles.feedbackBox, { backgroundColor: themeColors.error + '20' }]}>
                    <X size={20} color={themeColors.error} />
                    <Text style={[styles.feedbackText, { color: themeColors.error }]}>
                      Incorrect. The correct answer is: {currentQuestion.answer}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
        
        <View style={[styles.footer, { borderTopColor: themeColors.border }]}>
          {!isAnswerChecked ? (
            <Button
              title="Check Answer"
              onPress={handleCheckAnswer}
              disabled={!userAnswer.trim()}
              style={!userAnswer.trim() ? { opacity: 0.5 } : undefined}
            />
          ) : (
            <Button
              title="Next Question"
              onPress={handleNextQuestion}
              rightIcon={<ChevronRight size={20} color="#FFFFFF" />}
            />
          )}
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    textAlign: 'center',
    marginTop: 24,
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  progress: {
    marginBottom: 24,
  },
  progressText: {
    fontSize: 14,
    marginBottom: 8,
  },
  questionContainer: {
    marginBottom: 24,
  },
  instructions: {
    fontSize: 16,
    marginBottom: 16,
  },
  sentence: {
    fontSize: 20,
    lineHeight: 28,
  },
  answerContainer: {
    marginBottom: 24,
  },
  answerInput: {
    borderWidth: 2,
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    marginBottom: 16,
  },
  feedbackContainer: {
    marginBottom: 16,
  },
  feedbackBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  feedbackText: {
    marginLeft: 8,
    fontSize: 16,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
  resultsContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  resultsCard: {
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 24,
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  resultsScore: {
    fontSize: 18,
    marginBottom: 16,
  },
  resultsFeedback: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
  resultsButtons: {
    width: '100%',
  },
});
