import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Card, Title, Paragraph, Button, Text, ProgressBar, Chip, ActivityIndicator, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LearnStackParamList, WordList } from '../../types';
import { commonStyles } from '../../styles/theme';

type LearnScreenNavigationProp = StackNavigationProp<LearnStackParamList, 'LearnHome'>;

// Örnek veri
const mockLists: WordList[] = [
  {
    id: '1',
    name: 'İngilizce Günlük Konuşma',
    description: 'Günlük hayatta kullanılan temel İngilizce kelimeler',
    createdAt: new Date().toISOString(),
    wordCount: 42,
    progress: 0.65,
  },
  {
    id: '2',
    name: 'İş İngilizcesi',
    description: 'İş hayatında sıkça kullanılan terimler ve ifadeler',
    createdAt: new Date().toISOString(),
    wordCount: 28,
    progress: 0.3,
  },
  {
    id: '3',
    name: 'Seyahat Terimleri',
    description: 'Seyahat ederken ihtiyaç duyabileceğiniz kelimeler',
    createdAt: new Date().toISOString(),
    wordCount: 35,
    progress: 0.8,
  },
];

const mockRecentActivity = [
  {
    id: '1',
    listId: '1',
    listName: 'İngilizce Günlük Konuşma',
    date: new Date(Date.now() - 3600000).toISOString(), // 1 saat önce
    wordsLearned: 5,
    timeSpent: 15, // dakika
  },
  {
    id: '2',
    listId: '3',
    listName: 'Seyahat Terimleri',
    date: new Date(Date.now() - 86400000).toISOString(), // 1 gün önce
    wordsLearned: 8,
    timeSpent: 20, // dakika
  },
];

const LearnScreen = () => {
  const [lists, setLists] = useState<WordList[]>([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dailyGoal, setDailyGoal] = useState(20); // Günlük hedef kelime sayısı
  const [dailyProgress, setDailyProgress] = useState(12); // Bugün öğrenilen kelime sayısı
  const [streak, setStreak] = useState(5); // Günlük öğrenme serisi

  const navigation = useNavigation<LearnScreenNavigationProp>();

  useEffect(() => {
    // Gerçek uygulamada API'den veri çekilir
    // Şimdilik mock veri kullanıyoruz
    setTimeout(() => {
      setLists(mockLists);
      setRecentActivity(mockRecentActivity);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getProgressColor = (progress: number) => {
    if (progress < 0.3) return '#EF4444'; // Kırmızı
    if (progress < 0.7) return '#F59E0B'; // Turuncu
    return '#4CAF50'; // Yeşil
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffDay > 0) {
      return `${diffDay} gün önce`;
    } else if (diffHour > 0) {
      return `${diffHour} saat önce`;
    } else if (diffMin > 0) {
      return `${diffMin} dakika önce`;
    } else {
      return 'Az önce';
    }
  };

  const renderListItem = ({ item }: { item: WordList }) => {
    const progressColor = getProgressColor(item.progress);
    
    return (
      <Card style={styles.listCard}>
        <Card.Content>
          <Title style={styles.listTitle}>{item.name}</Title>
          <Paragraph style={styles.listDescription} numberOfLines={2}>
            {item.description}
          </Paragraph>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressLabelContainer}>
              <Text style={styles.progressLabel}>İlerleme</Text>
              <Text style={styles.progressPercentage}>{Math.round(item.progress * 100)}%</Text>
            </View>
            <ProgressBar 
              progress={item.progress} 
              color={progressColor} 
              style={styles.progressBar} 
            />
          </View>
          
          <View style={styles.statsContainer}>
            <Chip icon="book" style={styles.statChip}>
              {item.wordCount} kelime
            </Chip>
          </View>
        </Card.Content>
        
        <Card.Actions style={styles.cardActions}>
          <Button 
            mode="contained" 
            onPress={() => navigation.navigate('LearnHome', { listId: item.id, listName: item.name })}
            style={styles.learnButton}
            icon="book-open-variant"
          >
            Öğrenmeye Başla
          </Button>
          <Button 
            mode="outlined" 
            onPress={() => navigation.navigate('Quiz', { listId: item.id, listName: item.name })}
            style={styles.quizButton}
            icon="head-question"
          >
            Quiz
          </Button>
        </Card.Actions>
      </Card>
    );
  };

  const renderActivityItem = ({ item }) => {
    return (
      <Card style={styles.activityCard}>
        <Card.Content style={styles.activityCardContent}>
          <View style={styles.activityInfo}>
            <Text style={styles.activityListName}>{item.listName}</Text>
            <Text style={styles.activityDate}>{formatTimeAgo(item.date)}</Text>
            <View style={styles.activityStats}>
              <Text style={styles.activityStat}>
                <MaterialCommunityIcons name="book-open-variant" size={14} color="#94A3B8" /> {item.wordsLearned} kelime
              </Text>
              <Text style={styles.activityStat}>
                <MaterialCommunityIcons name="clock-outline" size={14} color="#94A3B8" /> {item.timeSpent} dakika
              </Text>
            </View>
          </View>
          <IconButton
            icon="arrow-right"
            size={24}
            onPress={() => navigation.navigate('LearnHome', { listId: item.listId, listName: item.listName })}
            color="#4CAF50"
          />
        </Card.Content>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Günlük İlerleme Kartı */}
      <Card style={styles.dailyProgressCard}>
        <Card.Content>
          <Title style={styles.dailyProgressTitle}>Günlük İlerleme</Title>
          
          <View style={styles.streakContainer}>
            <MaterialCommunityIcons name="fire" size={24} color="#F59E0B" />
            <Text style={styles.streakText}>{streak} günlük seri</Text>
          </View>
          
          <View style={styles.goalContainer}>
            <View style={styles.goalLabelContainer}>
              <Text style={styles.goalLabel}>Günlük Hedef</Text>
              <Text style={styles.goalProgress}>{dailyProgress}/{dailyGoal} kelime</Text>
            </View>
            <ProgressBar 
              progress={dailyProgress / dailyGoal} 
              color="#4CAF50" 
              style={styles.goalProgressBar} 
            />
          </View>
        </Card.Content>
      </Card>

      {/* Son Aktivite */}
      <View style={styles.sectionHeader}>
        <Title style={styles.sectionTitle}>Son Aktivite</Title>
      </View>
      
      {recentActivity.length > 0 ? (
        <FlatList
          data={recentActivity}
          renderItem={renderActivityItem}
          keyExtractor={item => item.id}
          scrollEnabled={false}
        />
      ) : (
        <Card style={styles.emptyActivityCard}>
          <Card.Content style={styles.emptyActivityContent}>
            <MaterialCommunityIcons name="book-open-page-variant" size={48} color="#94A3B8" />
            <Text style={styles.emptyActivityText}>Henüz öğrenme aktiviteniz yok</Text>
            <Text style={styles.emptyActivitySubText}>Öğrenmeye başlamak için bir liste seçin</Text>
          </Card.Content>
        </Card>
      )}

      {/* Kelime Listeleri */}
      <View style={styles.sectionHeader}>
        <Title style={styles.sectionTitle}>Kelime Listeleri</Title>
      </View>
      
      <FlatList
        data={lists}
        renderItem={renderListItem}
        keyExtractor={item => item.id}
        scrollEnabled={false}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...commonStyles.container,
    padding: 0,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
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
  dailyProgressCard: {
    marginBottom: 24,
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    borderWidth: 1,
  },
  dailyProgressTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  streakText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: 'bold',
  },
  goalContainer: {
    marginBottom: 8,
  },
  goalLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  goalLabel: {
    color: '#94A3B8',
  },
  goalProgress: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  goalProgressBar: {
    height: 8,
    borderRadius: 4,
  },
  sectionHeader: {
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  activityCard: {
    marginBottom: 12,
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    borderWidth: 1,
  },
  activityCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  activityInfo: {
    flex: 1,
  },
  activityListName: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  activityDate: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 8,
  },
  activityStats: {
    flexDirection: 'row',
  },
  activityStat: {
    fontSize: 12,
    color: '#94A3B8',
    marginRight: 16,
  },
  emptyActivityCard: {
    marginBottom: 24,
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    borderWidth: 1,
  },
  emptyActivityContent: {
    alignItems: 'center',
    padding: 16,
  },
  emptyActivityText: {
    fontSize: 16,
    color: '#94A3B8',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyActivitySubText: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 8,
    textAlign: 'center',
  },
  listCard: {
    marginBottom: 16,
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    borderWidth: 1,
  },
  listTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  listDescription: {
    color: '#94A3B8',
    marginBottom: 16,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    color: '#94A3B8',
  },
  progressPercentage: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  statChip: {
    backgroundColor: '#334155',
    marginRight: 8,
  },
  cardActions: {
    borderTopWidth: 1,
    borderTopColor: '#334155',
    justifyContent: 'space-between',
  },
  learnButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#4CAF50',
  },
  quizButton: {
    flex: 1,
    marginLeft: 8,
    borderColor: '#FF9800',
  },
});

export default LearnScreen;
