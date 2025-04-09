import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Card, Title, Paragraph, Text, ProgressBar, Chip, ActivityIndicator, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BarChart, LineChart, PieChart } from 'react-native-chart-kit';
import { commonStyles } from '../../styles/theme';

// Örnek veri
const mockStats = {
  totalWords: 150,
  learnedWords: 87,
  mastery: 0.58, // 0-1 arası
  streak: 7, // gün
  totalLists: 5,
  activeLists: 3,
  dailyGoal: 20,
  dailyProgress: 15,
};

const mockWeeklyActivity = [
  { day: 'Pzt', words: 12 },
  { day: 'Sal', words: 18 },
  { day: 'Çar', words: 15 },
  { day: 'Per', words: 25 },
  { day: 'Cum', words: 10 },
  { day: 'Cmt', words: 8 },
  { day: 'Paz', words: 15 },
];

const mockMasteryDistribution = [
  { name: 'Mükemmel', count: 32, color: '#4CAF50' },
  { name: 'İyi', count: 25, color: '#8BC34A' },
  { name: 'Orta', count: 18, color: '#FFC107' },
  { name: 'Zayıf', count: 12, color: '#FF9800' },
  { name: 'Yeni', count: 63, color: '#9E9E9E' },
];

const mockMonthlyProgress = {
  labels: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz'],
  datasets: [
    {
      data: [20, 45, 68, 92, 120, 150],
      color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
      strokeWidth: 2,
    },
  ],
};

const { width } = Dimensions.get('window');

const ProgressScreen = () => {
  const [stats, setStats] = useState(null);
  const [weeklyActivity, setWeeklyActivity] = useState([]);
  const [masteryDistribution, setMasteryDistribution] = useState([]);
  const [monthlyProgress, setMonthlyProgress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');

  useEffect(() => {
    // Gerçek uygulamada API'den veri çekilir
    // Şimdilik mock veri kullanıyoruz
    setTimeout(() => {
      setStats(mockStats);
      setWeeklyActivity(mockWeeklyActivity);
      setMasteryDistribution(mockMasteryDistribution);
      setMonthlyProgress(mockMonthlyProgress);
      setIsLoading(false);
    }, 1000);
  }, []);

  const chartConfig = {
    backgroundGradientFrom: '#1E293B',
    backgroundGradientTo: '#1E293B',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#4CAF50',
    },
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>İlerleme verileri yükleniyor...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Özet Kartı */}
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Title style={styles.cardTitle}>Öğrenme Özeti</Title>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="book" size={24} color="#4CAF50" />
              <Text style={styles.statValue}>{stats.totalWords}</Text>
              <Text style={styles.statLabel}>Toplam Kelime</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="book-check" size={24} color="#4CAF50" />
              <Text style={styles.statValue}>{stats.learnedWords}</Text>
              <Text style={styles.statLabel}>Öğrenilen</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="fire" size={24} color="#F59E0B" />
              <Text style={styles.statValue}>{stats.streak}</Text>
              <Text style={styles.statLabel}>Gün Serisi</Text>
            </View>
          </View>
          
          <View style={styles.masteryContainer}>
            <View style={styles.masteryLabelContainer}>
              <Text style={styles.masteryLabel}>Genel Hakimiyet</Text>
              <Text style={styles.masteryPercentage}>{Math.round(stats.mastery * 100)}%</Text>
            </View>
            <ProgressBar 
              progress={stats.mastery} 
              color="#4CAF50" 
              style={styles.masteryProgressBar} 
            />
          </View>
        </Card.Content>
      </Card>

      {/* Günlük Hedef Kartı */}
      <Card style={styles.goalCard}>
        <Card.Content>
          <Title style={styles.cardTitle}>Günlük Hedef</Title>
          
          <View style={styles.goalContainer}>
            <View style={styles.goalLabelContainer}>
              <Text style={styles.goalLabel}>Bugünkü İlerleme</Text>
              <Text style={styles.goalProgress}>{stats.dailyProgress}/{stats.dailyGoal} kelime</Text>
            </View>
            <ProgressBar 
              progress={stats.dailyProgress / stats.dailyGoal} 
              color="#4CAF50" 
              style={styles.goalProgressBar} 
            />
          </View>
        </Card.Content>
      </Card>

      {/* Haftalık Aktivite Grafiği */}
      <Card style={styles.chartCard}>
        <Card.Content>
          <Title style={styles.cardTitle}>Haftalık Aktivite</Title>
          
          <View style={styles.timeRangeContainer}>
            <Chip 
              selected={timeRange === 'week'} 
              onPress={() => setTimeRange('week')}
              style={[styles.timeRangeChip, timeRange === 'week' && styles.selectedTimeRangeChip]}
              textStyle={timeRange === 'week' ? styles.selectedTimeRangeText : styles.timeRangeText}
            >
              Hafta
            </Chip>
            <Chip 
              selected={timeRange === 'month'} 
              onPress={() => setTimeRange('month')}
              style={[styles.timeRangeChip, timeRange === 'month' && styles.selectedTimeRangeChip]}
              textStyle={timeRange === 'month' ? styles.selectedTimeRangeText : styles.timeRangeText}
            >
              Ay
            </Chip>
            <Chip 
              selected={timeRange === 'year'} 
              onPress={() => setTimeRange('year')}
              style={[styles.timeRangeChip, timeRange === 'year' && styles.selectedTimeRangeChip]}
              textStyle={timeRange === 'year' ? styles.selectedTimeRangeText : styles.timeRangeText}
            >
              Yıl
            </Chip>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <BarChart
              data={{
                labels: weeklyActivity.map(item => item.day),
                datasets: [
                  {
                    data: weeklyActivity.map(item => item.words),
                  },
                ],
              }}
              width={width - 32}
              height={220}
              chartConfig={chartConfig}
              style={styles.chart}
              showValuesOnTopOfBars
              fromZero
            />
          </ScrollView>
        </Card.Content>
      </Card>

      {/* Hakimiyet Dağılımı */}
      <Card style={styles.chartCard}>
        <Card.Content>
          <Title style={styles.cardTitle}>Kelime Hakimiyeti</Title>
          
          <View style={styles.pieChartContainer}>
            <PieChart
              data={masteryDistribution.map(item => ({
                name: item.name,
                population: item.count,
                color: item.color,
                legendFontColor: '#94A3B8',
                legendFontSize: 12,
              }))}
              width={width - 32}
              height={220}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>
        </Card.Content>
      </Card>

      {/* Aylık İlerleme */}
      <Card style={styles.chartCard}>
        <Card.Content>
          <Title style={styles.cardTitle}>Aylık İlerleme</Title>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <LineChart
              data={monthlyProgress}
              width={width - 32}
              height={220}
              chartConfig={chartConfig}
              style={styles.chart}
              bezier
            />
          </ScrollView>
        </Card.Content>
      </Card>
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
  summaryCard: {
    marginBottom: 16,
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
  },
  masteryContainer: {
    marginBottom: 8,
  },
  masteryLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  masteryLabel: {
    color: '#94A3B8',
  },
  masteryPercentage: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  masteryProgressBar: {
    height: 8,
    borderRadius: 4,
  },
  goalCard: {
    marginBottom: 16,
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    borderWidth: 1,
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
  chartCard: {
    marginBottom: 16,
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    borderWidth: 1,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timeRangeChip: {
    backgroundColor: '#334155',
    marginRight: 8,
  },
  selectedTimeRangeChip: {
    backgroundColor: '#4CAF50',
  },
  timeRangeText: {
    color: '#94A3B8',
  },
  selectedTimeRangeText: {
    color: '#FFFFFF',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 8,
  },
  pieChartContainer: {
    alignItems: 'center',
  },
});

export default ProgressScreen;
