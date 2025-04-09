import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { Card, Title, Paragraph, Button, FAB, Text, Searchbar, Chip, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ListsStackParamList, WordList } from '../../types';
import { commonStyles } from '../../styles/theme';

type ListsScreenNavigationProp = StackNavigationProp<ListsStackParamList, 'MyLists'>;

// Örnek veri
const mockLists: WordList[] = [
  {
    id: '1',
    name: 'İngilizce Günlük Konuşma',
    description: 'Günlük hayatta kullanılan temel İngilizce kelimeler',
    createdAt: new Date().toISOString(),
    wordCount: 42,
  },
  {
    id: '2',
    name: 'İş İngilizcesi',
    description: 'İş hayatında sıkça kullanılan terimler ve ifadeler',
    createdAt: new Date().toISOString(),
    wordCount: 28,
  },
  {
    id: '3',
    name: 'Seyahat Terimleri',
    description: 'Seyahat ederken ihtiyaç duyabileceğiniz kelimeler',
    createdAt: new Date().toISOString(),
    wordCount: 35,
  },
  {
    id: '4',
    name: 'Teknoloji Terimleri',
    description: 'Bilgisayar ve teknoloji alanında kullanılan terimler',
    createdAt: new Date().toISOString(),
    wordCount: 50,
  },
  {
    id: '5',
    name: 'Akademik İngilizce',
    description: 'Akademik çalışmalarda kullanılan kelimeler ve ifadeler',
    createdAt: new Date().toISOString(),
    wordCount: 63,
  },
];

const ListsScreen = () => {
  const [lists, setLists] = useState<WordList[]>([]);
  const [filteredLists, setFilteredLists] = useState<WordList[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'count'>('date');

  const navigation = useNavigation<ListsScreenNavigationProp>();

  useEffect(() => {
    // Gerçek uygulamada API'den veri çekilir
    // Şimdilik mock veri kullanıyoruz
    setTimeout(() => {
      setLists(mockLists);
      setFilteredLists(mockLists);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredLists(lists);
    } else {
      const filtered = lists.filter(list => 
        list.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        list.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredLists(filtered);
    }
  }, [searchQuery, lists]);

  useEffect(() => {
    let sorted = [...filteredLists];
    
    if (sortBy === 'name') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'date') {
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'count') {
      sorted.sort((a, b) => (b.wordCount || 0) - (a.wordCount || 0));
    }
    
    setFilteredLists(sorted);
  }, [sortBy]);

  const onRefresh = () => {
    setRefreshing(true);
    // Gerçek uygulamada API'den veri yenilenir
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const renderListItem = ({ item }: { item: WordList }) => {
    const createdDate = new Date(item.createdAt).toLocaleDateString('tr-TR');
    
    return (
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Title style={styles.cardTitle}>{item.name}</Title>
            <Chip icon="book-open-variant" style={styles.wordCountChip}>
              {item.wordCount} kelime
            </Chip>
          </View>
          <Paragraph style={styles.cardDescription}>{item.description}</Paragraph>
          <Text style={styles.dateText}>Oluşturulma: {createdDate}</Text>
        </Card.Content>
        <Card.Actions style={styles.cardActions}>
          <Button 
            mode="text" 
            onPress={() => navigation.navigate('ListDetail', { listId: item.id, listName: item.name })}
            icon="format-list-bulleted"
          >
            Detaylar
          </Button>
          <Button 
            mode="text" 
            onPress={() => navigation.navigate('Learn', { listId: item.id, listName: item.name })}
            icon="book-open-variant"
          >
            Öğren
          </Button>
          <Button 
            mode="text" 
            onPress={() => navigation.navigate('Quiz', { listId: item.id, listName: item.name })}
            icon="head-question"
          >
            Quiz
          </Button>
        </Card.Actions>
      </Card>
    );
  };

  const renderEmptyList = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.emptyText}>Listeler yükleniyor...</Text>
        </View>
      );
    }
    
    if (searchQuery) {
      return (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="magnify-close" size={64} color="#94A3B8" />
          <Text style={styles.emptyText}>Aramanızla eşleşen liste bulunamadı.</Text>
        </View>
      );
    }
    
    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons name="playlist-plus" size={64} color="#94A3B8" />
        <Text style={styles.emptyText}>Henüz kelime listeniz yok.</Text>
        <Text style={styles.emptySubText}>İlk listenizi oluşturmak için aşağıdaki butona tıklayın.</Text>
        <Button 
          mode="contained" 
          onPress={() => navigation.navigate('CreateList')}
          style={styles.createButton}
          icon="plus"
        >
          Liste Oluştur
        </Button>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Liste ara..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
          iconColor="#94A3B8"
          inputStyle={{ color: '#FFFFFF' }}
        />
      </View>
      
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Sırala:</Text>
        <View style={styles.chipContainer}>
          <Chip 
            selected={sortBy === 'date'} 
            onPress={() => setSortBy('date')}
            style={[styles.chip, sortBy === 'date' && styles.selectedChip]}
            textStyle={sortBy === 'date' ? styles.selectedChipText : styles.chipText}
          >
            Tarih
          </Chip>
          <Chip 
            selected={sortBy === 'name'} 
            onPress={() => setSortBy('name')}
            style={[styles.chip, sortBy === 'name' && styles.selectedChip]}
            textStyle={sortBy === 'name' ? styles.selectedChipText : styles.chipText}
          >
            İsim
          </Chip>
          <Chip 
            selected={sortBy === 'count'} 
            onPress={() => setSortBy('count')}
            style={[styles.chip, sortBy === 'count' && styles.selectedChip]}
            textStyle={sortBy === 'count' ? styles.selectedChipText : styles.chipText}
          >
            Kelime Sayısı
          </Chip>
        </View>
      </View>

      <FlatList
        data={filteredLists}
        renderItem={renderListItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#4CAF50']}
            tintColor="#4CAF50"
          />
        }
      />

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('CreateList')}
        color="#FFFFFF"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...commonStyles.container,
    padding: 0,
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  searchbar: {
    backgroundColor: '#1E293B',
    elevation: 0,
    borderWidth: 1,
    borderColor: '#334155',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  filterLabel: {
    color: '#94A3B8',
    marginRight: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    backgroundColor: '#1E293B',
    marginRight: 8,
    marginBottom: 8,
  },
  selectedChip: {
    backgroundColor: '#4CAF50',
  },
  chipText: {
    color: '#94A3B8',
  },
  selectedChipText: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  card: {
    marginBottom: 16,
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    flex: 1,
  },
  wordCountChip: {
    backgroundColor: '#334155',
  },
  cardDescription: {
    color: '#94A3B8',
    marginBottom: 8,
  },
  dateText: {
    color: '#64748B',
    fontSize: 12,
  },
  cardActions: {
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#4CAF50',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    color: '#94A3B8',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 8,
    textAlign: 'center',
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: '#4CAF50',
    marginTop: 16,
  },
});

export default ListsScreen;
