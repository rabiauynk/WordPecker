import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, Award, HelpCircle, Zap } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useSettingsStore } from '@/store/settingsStore';
import { useWordListsStore } from '@/store/wordListsStore';
import { useProgressStore } from '@/store/progressStore';
import { EmptyState } from '@/components/EmptyState';
import { QuizOption } from '@/components/QuizOption';
import { Button } from '@/components/Button';
import { ProgressBar } from '@/components/ProgressBar';
import { Word } from '@/types/wordList';

interface QuizQuestion {
  word: Word;
  options: string[];
  correctOptionIndex: number;
}

export default function QuickQuizScreen() {
  const { listId } = useLocalSearchParams<{ listId: string }>();
  const router = useRouter();
  const { theme } = useSettingsStore();
  const { lists } = useWordListsStore();
  const { recordQuizResult } = useProgressStore();
  const themeColors = colors[theme === 'dark' ? 'dark' : 'light'];
  
  const list = lists.find(list => list.id === listId);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);

  const createQuizQuestions = (words: Word[]): QuizQuestion[] => {
    const shuffledWords = [...words].sort(() => 0.5 - Math.random());
    const quizWords = shuffledWords.slice(0, 5); // 5 questions for quick quiz
    
    return quizWords.map(word => {
      const incorrectOptions = words
        .filter(w => w.id !== word.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map(w => w.definition);
      
      const allOptions = [...incorrectOptions, word.definition].sort(() => 0.5 - Math.random());
      
      return {
        word,
        options: allOptions,
        correctOptionIndex: allOptions.indexOf(word.definition),
      };
    });
  };
  
  useEffect(() => {
    if (list && list.words.length >= 4) {
      const questions = createQuizQuestions(list.words);
      setQuizQuestions(questions);
    }
  }, [list]);

  const handleSelectOption = (index: number) => {
    if (!isAnswerRevealed) {
      setSelectedOptionIndex(index);
    }
  };
  
  const handleCheckAnswer = () => {
    setIsAnswerRevealed(true);
    
    const currentQuestion = quizQuestions[currentQuestionIndex];
    if (selectedOptionIndex === currentQuestion.correctOptionIndex) {
      setCorrectAnswers(prev => prev + 1);
    }
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOptionIndex(null);
      setIsAnswerRevealed(false);
    } else {
      setQuizComplete(true);
      const finalScore = correctAnswers + (selectedOptionIndex === quizQuestions[currentQuestionIndex].correctOptionIndex ? 1 : 0);
      recordQuizResult(finalScore, quizQuestions.length);
    }
  };
  
  const handleRestartQuiz = () => {
    if (!list) return;
    
    const questions = createQuizQuestions(list.words);
    setQuizQuestions(questions);
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setIsAnswerRevealed(false);
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
  
  if (list.words.length < 4) {
    return (
      <EmptyState
        title="Not Enough Words"
        message="You need at least 4 words in this list to take a quiz"
        icon={<HelpCircle size={64} color={themeColors.primary} />}
        actionLabel="Add More Words"
        onAction={() => router.push({ pathname: '/list/add-word', params: { listId: list.id } })}
      />
    );
  }
  
  if (quizQuestions.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        <Text style={[styles.loading, { color: themeColors.text }]}>Loading quiz...</Text>
      </View>
    );
  }
  
  if (quizComplete) {
    const finalScore = correctAnswers + (selectedOptionIndex === quizQuestions[currentQuestionIndex].correctOptionIndex ? 1 : 0);
    const scorePercentage = (finalScore / quizQuestions.length) * 100;
    
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]} edges={['bottom']}>
        <Stack.Screen options={{ title: 'Quick Quiz' }} />
        
        <View style={styles.resultsContainer}>
          <View style={[styles.resultsCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
            <Award size={64} color={themeColors.primary} />
            <Text style={[styles.resultsTitle, { color: themeColors.text }]}>Quiz Complete!</Text>
            <Text style={[styles.resultsScore, { color: themeColors.text }]}>
              Your Score: {finalScore}/{quizQuestions.length} ({Math.round(scorePercentage)}%)
            </Text>
            <ProgressBar 
              progress={finalScore / quizQuestions.length}
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
  
  const currentQuestion = quizQuestions[currentQuestionIndex];
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]} edges={['bottom']}>
      <Stack.Screen options={{ title: 'Quick Quiz' }} />
      
      <View style={styles.content}>
        <View style={styles.progress}>
          <View style={styles.progressHeader}>
            <Text style={[styles.progressText, { color: themeColors.text }]}>
              Question {currentQuestionIndex + 1} of {quizQuestions.length}
            </Text>
            <View style={styles.quickBadge}>
              <Zap size={14} color="#FFFFFF" />
              <Text style={styles.quickBadgeText}>Quick Quiz</Text>
            </View>
          </View>
          <ProgressBar 
            progress={currentQuestionIndex / quizQuestions.length}
            height={8}
            showPercentage={false}
          />
        </View>
        
        <View style={styles.questionContainer}>
          <Text style={[styles.questionLabel, { color: themeColors.textSecondary }]}>
            What is the definition of:
          </Text>
          <Text style={[styles.questionTerm, { color: themeColors.text }]}>
            {currentQuestion.word.term}
          </Text>
        </View>
        
        <View style={styles.options}>
          {currentQuestion.options.map((option, index) => (
            <QuizOption
              key={index}
              text={option}
              isSelected={selectedOptionIndex === index}
              isCorrect={index === currentQuestion.correctOptionIndex}
              isRevealed={isAnswerRevealed}
              onSelect={() => handleSelectOption(index)}
              disabled={isAnswerRevealed}
            />
          ))}
        </View>
      </View>
      
      <View style={[styles.footer, { borderTopColor: themeColors.border }]}>
        {!isAnswerRevealed ? (
          <Button
            title="Check Answer"
            onPress={handleCheckAnswer}
            disabled={selectedOptionIndex === null}
            style={selectedOptionIndex === null ? { opacity: 0.5 } : undefined}
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
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
  },
  quickBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF9800',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  quickBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  questionContainer: {
    marginBottom: 24,
  },
  questionLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  questionTerm: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  options: {
    marginBottom: 24,
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
