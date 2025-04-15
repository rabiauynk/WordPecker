import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight, RotateCcw, Award } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useSettingsStore } from '@/store/settingsStore';
import { useWordListsStore } from '@/store/wordListsStore';
import { useProgressStore } from '@/store/progressStore';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/Button';
import { ProgressBar } from '@/components/ProgressBar';
import { Word } from '@/types/wordList';

const { width } = Dimensions.get('window');

export default function FlashcardsScreen() {
  const { listId } = useLocalSearchParams<{ listId: string }>();
  const router = useRouter();
  const { theme } = useSettingsStore();
  const { lists } = useWordListsStore();
  const { recordWordReviewed } = useProgressStore();
  const themeColors = colors[theme === 'dark' ? 'dark' : 'light'];
  
  const list = lists.find(list => list.id === listId);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [shuffledWords, setShuffledWords] = useState<Word[]>([]);
  const [knownWords, setKnownWords] = useState<Set<string>>(new Set());
  
  // Animation values
  const flipAnimation = useState(new Animated.Value(0))[0];
  const slideAnimation = useState(new Animated.Value(0))[0];
  
  useEffect(() => {
    if (list && list.words.length > 0) {
      // Shuffle the words
      const words = [...list.words].sort(() => 0.5 - Math.random());
      setShuffledWords(words);
    }
  }, [list]);
  
  const flipCard = () => {
    if (isFlipped) {
      Animated.timing(flipAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsFlipped(false));
    } else {
      Animated.timing(flipAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsFlipped(true));
    }
  };
  
  const handleNext = (known: boolean) => {
    // Record the word as reviewed
    if (shuffledWords.length > 0) {
      const currentWord = shuffledWords[currentIndex];
      recordWordReviewed(currentWord.id, known);
      
      if (known) {
        setKnownWords(prev => new Set(prev).add(currentWord.id));
      }
    }
    
    // Animate slide out
    Animated.timing(slideAnimation, {
      toValue: -width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // Reset flip and slide
      flipAnimation.setValue(0);
      slideAnimation.setValue(0);
      setIsFlipped(false);
      
      // Move to next card or complete
      if (currentIndex < shuffledWords.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setCompleted(true);
      }
    });
  };
  
  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setCompleted(false);
    setKnownWords(new Set());
    
    // Reshuffle the words
    if (list) {
      const words = [...list.words].sort(() => 0.5 - Math.random());
      setShuffledWords(words);
    }
  };
  
  // Transform interpolations
  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  
  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });
  
  const frontOpacity = flipAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0, 0],
  });
  
  const backOpacity = flipAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });
  
  if (!list) {
    return (
      <EmptyState
        title="List Not Found"
        message="The word list you're looking for doesn't exist"
        icon={<Award size={64} color={themeColors.primary} />}
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
        icon={<Award size={64} color={themeColors.primary} />}
        actionLabel="Add Words"
        onAction={() => router.push({ pathname: '/list/add-word', params: { listId: list.id } })}
      />
    );
  }
  
  if (completed) {
    const knownCount = knownWords.size;
    const totalCount = shuffledWords.length;
    const percentage = (knownCount / totalCount) * 100;
    
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]} edges={['bottom']}>
        <Stack.Screen options={{ title: 'Flashcards Complete' }} />
        
        <View style={styles.completedContainer}>
          <View style={[styles.completedCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
            <Award size={64} color={themeColors.primary} />
            <Text style={[styles.completedTitle, { color: themeColors.text }]}>Great Job!</Text>
            <Text style={[styles.completedSubtitle, { color: themeColors.textSecondary }]}>
              You've reviewed all {totalCount} words
            </Text>
            
            <View style={styles.statsContainer}>
              <Text style={[styles.statsLabel, { color: themeColors.text }]}>
                Words you knew: {knownCount}/{totalCount} ({Math.round(percentage)}%)
              </Text>
              <ProgressBar 
                progress={knownCount / totalCount}
                height={12}
                showPercentage={false}
              />
            </View>
          </View>
          
          <View style={styles.buttonsContainer}>
            <Button
              title="Practice Again"
              onPress={handleRestart}
              leftIcon={<RotateCcw size={20} color="#FFFFFF" />}
              style={{ marginBottom: 12 }}
            />
            <Button
              title="Back to List"
              onPress={() => router.push(`/learn/${list.id}`)}
              variant="outline"
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
  
  const currentWord = shuffledWords[currentIndex];
  
  if (!currentWord) {
    return (
      <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        <Text style={[styles.loading, { color: themeColors.text }]}>Loading flashcards...</Text>
      </View>
    );
  }
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]} edges={['bottom']}>
      <Stack.Screen options={{ title: `Flashcards: ${list.title}` }} />
      
      <View style={styles.content}>
        <View style={styles.progressContainer}>
          <Text style={[styles.progressText, { color: themeColors.text }]}>
            Card {currentIndex + 1} of {shuffledWords.length}
          </Text>
          <ProgressBar 
            progress={(currentIndex) / shuffledWords.length}
            height={8}
            showPercentage={false}
          />
        </View>
        
        <View style={styles.cardContainer}>
          <Animated.View 
            style={[
              styles.card,
              { 
                backgroundColor: themeColors.card,
                borderColor: themeColors.border,
                transform: [
                  { translateX: slideAnimation },
                  { rotateY: frontInterpolate }
                ],
                opacity: frontOpacity,
              }
            ]}
          >
            <Text style={[styles.cardLabel, { color: themeColors.textSecondary }]}>Term</Text>
            <Text style={[styles.cardTerm, { color: themeColors.text }]}>{currentWord.term}</Text>
            <Text style={[styles.tapHint, { color: themeColors.textSecondary }]}>Tap to flip</Text>
          </Animated.View>
          
          <Animated.View 
            style={[
              styles.card,
              styles.cardBack,
              { 
                backgroundColor: themeColors.card,
                borderColor: themeColors.border,
                transform: [
                  { translateX: slideAnimation },
                  { rotateY: backInterpolate }
                ],
                opacity: backOpacity,
              }
            ]}
          >
            <Text style={[styles.cardLabel, { color: themeColors.textSecondary }]}>Definition</Text>
            <Text style={[styles.cardDefinition, { color: themeColors.text }]}>{currentWord.definition}</Text>
            
            {currentWord.example && (
              <>
                <Text style={[styles.cardLabel, { color: themeColors.textSecondary, marginTop: 16 }]}>Example</Text>
                <Text style={[styles.cardExample, { color: themeColors.text }]}>{currentWord.example}</Text>
              </>
            )}
          </Animated.View>
        </View>
        
        <TouchableOpacity 
          style={styles.flipButton}
          onPress={flipCard}
          activeOpacity={0.7}
        >
          <View style={[styles.flipButtonInner, { backgroundColor: themeColors.primary + '20' }]}>
            <RotateCcw size={24} color={themeColors.primary} />
          </View>
        </TouchableOpacity>
      </View>
      
      <View style={[styles.footer, { borderTopColor: themeColors.border }]}>
        <Button
          title="I Don't Know"
          onPress={() => handleNext(false)}
          variant="outline"
          leftIcon={<ChevronLeft size={20} color={themeColors.primary} />}
          style={{ flex: 1, marginRight: 8 }}
        />
        <Button
          title="I Know This"
          onPress={() => handleNext(true)}
          rightIcon={<ChevronRight size={20} color="#FFFFFF" />}
          style={{ flex: 1, marginLeft: 8 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loading: {
    flex: 1,
    textAlign: 'center',
    marginTop: 24,
    fontSize: 16,
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressText: {
    fontSize: 14,
    marginBottom: 8,
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  card: {
    width: '100%',
    height: 300,
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
    position: 'absolute',
  },
  cardBack: {
    transform: [{ rotateY: '180deg' }],
  },
  cardLabel: {
    fontSize: 14,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  cardTerm: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  cardDefinition: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 8,
  },
  cardExample: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  tapHint: {
    fontSize: 14,
    marginTop: 24,
    opacity: 0.7,
  },
  flipButton: {
    alignItems: 'center',
    marginTop: 24,
  },
  flipButtonInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
  },
  completedContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  completedCard: {
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 24,
  },
  completedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  completedSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  statsContainer: {
    width: '100%',
  },
  statsLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  buttonsContainer: {
    width: '100%',
  },
});
