import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Card, Title, Paragraph, Button, Text, ProgressBar, IconButton, ActivityIndicator } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LearnStackParamList, Quiz } from '../../types';
import { commonStyles } from '../../styles/theme';

type QuizScreenNavigationProp = StackNavigationProp<LearnStackParamList, 'Quiz'>;
type QuizScreenRouteProp = RouteProp<LearnStackParamList, 'Quiz'>;

// Örnek quiz soruları
const mockQuizQuestions: Quiz[] = [
  {
    wordId: '1',
    type: 'quiz',
    question: '"Apple" kelimesinin anlamı nedir?',
    options: ['Elma', 'Armut', 'Muz', 'Portakal'],
    correctAnswer: 'Elma',
  },
  {
    wordId: '2',
    type: 'quiz',
    question: '"Book" kelimesinin anlamı nedir?',
    options: ['Defter', 'Kalem', 'Kitap', 'Silgi'],
    correctAnswer: 'Kitap',
  },
  {
    wordId: '3',
    type: 'quiz',
    question: '"House" kelimesinin anlamı nedir?',
    options: ['Araba', 'Ev', 'Bahçe', 'Sokak'],
    correctAnswer: 'Ev',
  },
  {
    wordId: '4',
    type: 'quiz',
    question: '"Car" kelimesinin anlamı nedir?',
    options: ['Bisiklet', 'Motosiklet', 'Araba', 'Uçak'],
    correctAnswer: 'Araba',
  },
  {
    wordId: '5',
    type: 'quiz',
    question: '"Computer" kelimesinin anlamı nedir?',
    options: ['Telefon', 'Tablet', 'Bilgisayar', 'Televizyon'],
    correctAnswer: 'Bilgisayar',
  },
];

const { width } = Dimensions.get('window');

const QuizScreen = () => {
  const [questions, setQuestions] = useState<Quiz[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [slideAnim] = useState(new Animated.Value(0));

  const navigation = useNavigation<QuizScreenNavigationProp>();
  const route = useRoute<QuizScreenRouteProp>();
  const { listId, listName } = route.params;

  useEffect(() => {
    // Gerçek uygulamada API'den veri çekilir
    // Şimdilik mock veri kullanıyoruz
    setTimeout(() => {
      setQuestions(mockQuizQuestions);
      setIsLoading(false);
    }, 1000);
  }, [listId]);

  const handleOptionSelect = (option: string) => {
    if (selectedOption !== null) return; // Zaten bir seçenek seçilmişse, yeni seçime izin verme
    
    setSelectedOption(option);
    const currentQuestion = questions[currentQuestionIndex];
    const correct = option === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(score + 1);
    }
    
    // 1.5 saniye sonra bir sonraki soruya geç
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        // Sağa doğru kaydırma animasyonu
        Animated.timing(slideAnim, {
          toValue: -width,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setSelectedOption(null);
          setIsCorrect(null);
          slideAnim.setValue(width); // Yeni soru için sağdan başla
          
          // Sola doğru kaydırma animasyonu
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start();
        });
      } else {
        // Quiz tamamlandı
        setIsQuizCompleted(true);
      }
    }, 1500);
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setScore(0);
    setIsQuizCompleted(false);
    slideAnim.setValue(0);
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Quiz hazırlanıyor...</Text>
      </View>
    );
  }

  if (isQuizCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    let resultMessage = '';
    let resultIcon = '';
    
    if (percentage >= 80) {
      resultMessage = 'Harika! Mükemmel bir sonuç!';
      resultIcon = 'trophy';
    } else if (percentage >= 60) {
      resultMessage = 'İyi iş! Biraz daha pratik yapabilirsin.';
      resultIcon = 'thumb-up';
    } else {
      resultMessage = 'Daha fazla pratik yapman gerekiyor.';
      resultIcon = 'book-open-variant';
    }
    
    return (
      <View style={[styles.container, styles.resultContainer]}>
        <Card style={styles.resultCard}>
          <Card.Content style={styles.resultCardContent}>
            <MaterialCommunityIcons name={resultIcon} size={64} color="#4CAF50" />
            <Title style={styles.resultTitle}>Quiz Tamamlandı!</Title>
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreText}>Skorun:</Text>
              <Text style={styles.scoreValue}>{score}/{questions.length}</Text>
            </View>
            <ProgressBar 
              progress={score / questions.length} 
              color="#4CAF50" 
              style={styles.scoreProgressBar} 
            />
            <Text style={styles.resultMessage}>{resultMessage}</Text>
          </Card.Content>
          <Card.Actions style={styles.resultActions}>
            <Button 
              mode="contained" 
              onPress={restartQuiz}
              style={styles.restartButton}
              icon="restart"
            >
              Yeniden Başla
            </Button>
            <Button 
              mode="outlined" 
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              Listeye Dön
            </Button>
          </Card.Actions>
        </Card>
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = (currentQuestionIndex + 1) / questions.length;

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Soru {currentQuestionIndex + 1}/{questions.length}
        </Text>
        <ProgressBar 
          progress={progress} 
          color="#4CAF50" 
          style={styles.progressBar} 
        />
      </View>

      <Animated.View 
        style={[
          styles.questionContainer,
          { transform: [{ translateX: slideAnim }] }
        ]}
      >
        <Card style={styles.questionCard}>
          <Card.Content>
            <Title style={styles.questionTitle}>{currentQuestion.question}</Title>
          </Card.Content>
        </Card>

        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedOption === option;
            const isCorrectOption = currentQuestion.correctAnswer === option;
            
            let optionStyle = styles.optionCard;
            let textStyle = styles.optionText;
            
            if (isSelected) {
              if (isCorrect) {
                optionStyle = { ...optionStyle, ...styles.correctOptionCard };
                textStyle = { ...textStyle, ...styles.correctOptionText };
              } else {
                optionStyle = { ...optionStyle, ...styles.incorrectOptionCard };
                textStyle = { ...textStyle, ...styles.incorrectOptionText };
              }
            } else if (selectedOption !== null && isCorrectOption) {
              // Kullanıcı yanlış seçenek seçtiğinde doğru cevabı göster
              optionStyle = { ...optionStyle, ...styles.correctOptionCard };
              textStyle = { ...textStyle, ...styles.correctOptionText };
            }
            
            return (
              <TouchableOpacity
                key={index}
                style={optionStyle}
                onPress={() => handleOptionSelect(option)}
                disabled={selectedOption !== null}
              >
                <Text style={textStyle}>{option}</Text>
                {isSelected && isCorrect && (
                  <MaterialCommunityIcons name="check-circle" size={24} color="#FFFFFF" />
                )}
                {isSelected && !isCorrect && (
                  <MaterialCommunityIcons name="close-circle" size={24} color="#FFFFFF" />
                )}
                {!isSelected && selectedOption !== null && isCorrectOption && (
                  <MaterialCommunityIcons name="check-circle" size={24} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </Animated.View>

      <View style={styles.navigationContainer}>
        <Button 
          mode="text" 
          onPress={() => navigation.goBack()}
          style={styles.exitButton}
          icon="exit-to-app"
        >
          Çıkış
        </Button>
        <Text style={styles.scoreIndicator}>Skor: {score}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...commonStyles.container,
    padding: 16,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#94A3B8',
    marginTop: 16,
    fontSize: 16,
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressText: {
    color: '#94A3B8',
    marginBottom: 8,
    textAlign: 'center',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  questionContainer: {
    flex: 1,
  },
  questionCard: {
    marginBottom: 24,
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    borderWidth: 1,
    padding: 8,
  },
  questionTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  optionsContainer: {
    marginBottom: 24,
  },
  optionCard: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  correctOptionCard: {
    backgroundColor: '#065F46', // Yeşil arka plan
    borderColor: '#10B981',
  },
  incorrectOptionCard: {
    backgroundColor: '#7F1D1D', // Kırmızı arka plan
    borderColor: '#EF4444',
  },
  optionText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  correctOptionText: {
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  incorrectOptionText: {
    color: '#FFFFFF',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  exitButton: {
    borderColor: '#64748B',
  },
  scoreIndicator: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  resultContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultCard: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    borderWidth: 1,
    width: '100%',
    maxWidth: 400,
  },
  resultCardContent: {
    alignItems: 'center',
    padding: 24,
  },
  resultTitle: {
    fontSize: 24,
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 24,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 8,
  },
  scoreText: {
    fontSize: 16,
    color: '#94A3B8',
  },
  scoreValue: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  scoreProgressBar: {
    height: 8,
    borderRadius: 4,
    width: '100%',
    marginBottom: 24,
  },
  resultMessage: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
  },
  resultActions: {
    borderTopWidth: 1,
    borderTopColor: '#334155',
    justifyContent: 'space-between',
    padding: 16,
  },
  restartButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#4CAF50',
  },
  backButton: {
    flex: 1,
    marginLeft: 8,
    borderColor: '#64748B',
  },
});

export default QuizScreen;
