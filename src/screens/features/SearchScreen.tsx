import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Searchbar, Card, Title, Paragraph, Text, Chip, ActivityIndicator, Button, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ListsStackParamList, WordList, Word } from '../../types';
import { commonStyles } from '../../styles/theme';

type SearchScreenNavigationProp = StackNavigationProp<ListsStackParamList, 'Search'>;

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
];

const mockWords: Word[] = [
  {
    id: '1',
    listId: '1',
    value: 'apple',
    meaning: 'elma',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    listId: '1',
    value: 'book',
    meaning: 'kitap',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    listId: '2',
    value: 'meeting',
    meaning: 'toplantı',
    createdAt: new Date().toISOString(),
  },
];

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{
    lists: WordList[];
    words: Word[];
  }>({ lists: [], words: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'lists' | 'words'>('all');

  const navigation = useNavigation<SearchScreenNavigationProp>();

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      performSearch(searchQuery);
    } else {
      setSearchResults({ lists: [], words: [] });
    }
  }, [searchQuery, activeTab]);

  const performSearch = (query: string) => {
    setIsLoading(true);
    
    // Gerçek uygulamada API çağrısı yapılır
    // Şimdilik mock veri kullanıyoruz
    setTimeout(() => {
      const filteredLists = mockLists.filter(list => 
        list.name.toLowerCase().includes(query.toLowerCase()) ||
        list.description.toLowerCase().includes(query.toLowerCase())
      );
      
      const filteredWords = mockWords.filter(word => 
        word.value.toLowerCase().includes(query.toLowerCase()) ||
        word.meaning.toLowerCase().includes(query.toLowerCase())
      );
      
      setSearchResults({
        lists: activeTab === 'words' ? [] : filteredLists,
        words: activeTab === 'lists' ? [] : filteredWords,
      });
      
      setIsLoading(false);
    }, 500);
  };

  const renderListItem = ({ item }: { item: WordList }) => {
    return (
      <Card 
        style={styles.card}
        onPress={() => navigation.navigate('ListDetail', { listId: item.id, listName: item.name })}
      >
        <Card.Content>
          <Title style={styles.cardTitle}>{item.name}</Title>
          <Paragraph style={styles.cardDescription} numberOfLines={2}>
            {item.description}
          </Paragraph>
          <View style={styles.cardFooter}>
            <Chip icon="book" style={styles.chip}>
              {item.wordCount} kelime
            </Chip>
            <Text style={styles.dateText}>
              {new Date(item.createdAt).toLocaleDateString('tr-TR')}
            </Text>
          </View>
        </Card.Content>
      </Card>
    );
  };

  const renderWordItem = ({ item }: { item: Word }) => {
    // Mock listelerden kelimeye ait liste adını bul
    const list = mockLists.find(list => list.id === item.listId);
    
    return (
      <Card 
        style={styles.wordCard}
        onPress={() => navigation.navigate('ListDetail', { listId: item.listId, listName: list?.name || '' })}
      >
        <Card.Content>
          <View style={styles.wordHeader}>
            <Text style={styles.wordText}>{item.value}</Text>
            <Text style={styles.meaningText}>{item.meaning}</Text>
          </View>
          {list && (
            <View style={styles.listInfo}>
              <MaterialCommunityIcons name="playlist-edit" size={16} color="#94A3B8" />
              <Text style={styles.listName}>{list.name}</Text>
            </View>
          )}
        </Card.Content>
      </Card>
    );
  };

  const renderEmptyResult = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.emptyText}>Aranıyor...</Text>
        </View>
      );
    }
    
    if (searchQuery.trim().length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="magnify" size={64} color="#94A3B8" />
          <Text style={styles.emptyText}>Kelime veya liste aramak için yukarıdaki arama çubuğunu kullanın</Text>
        </View>
      );
    }
    
    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons name="magnify-close" size={64} color="#94A3B8" />
        <Text style={styles.emptyText}>"{searchQuery}" için sonuç bulunamadı</Text>
        <Text style={styles.emptySubText}>Farklı anahtar kelimeler deneyebilir veya yeni bir liste oluşturabilirsiniz</Text>
        <Button 
          mode="contained" 
          onPress={() => navigation.navigate('CreateList')}
          style={styles.createButton}
          icon="plus"
        >
          Yeni Liste Oluştur
        </Button>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Kelime veya liste ara..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
          iconColor="#94A3B8"
          inputStyle={{ color: '#FFFFFF' }}
          onSubmitEditing={() => performSearch(searchQuery)}
        />
      </View>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
            Tümü
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'lists' && styles.activeTab]}
          onPress={() => setActiveTab('lists')}
        >
          <Text style={[styles.tabText, activeTab === 'lists' && styles.activeTabText]}>
            Listeler
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'words' && styles.activeTab]}
          onPress={() => setActiveTab('words')}
        >
          <Text style={[styles.tabText, activeTab === 'words' && styles.activeTabText]}>
            Kelimeler
          </Text>
        </TouchableOpacity>
      </View>
      
      {(searchResults.lists.length > 0 || searchResults.words.length > 0) ? (
        <FlatList
          data={[
            ...(activeTab !== 'words' && searchResults.lists.length > 0 ? [{ type: 'listHeader' }] : []),
            ...(activeTab !== 'words' ? searchResults.lists.map(item => ({ type: 'list', data: item })) : []),
            ...(activeTab !== 'lists' && searchResults.words.length > 0 ? [{ type: 'wordHeader' }] : []),
            ...(activeTab !== 'lists' ? searchResults.words.map(item => ({ type: 'word', data: item })) : []),
          ]}
          renderItem={({ item }) => {
            if (item.type === 'listHeader') {
              return (
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Listeler</Text>
                  <Text style={styles.resultCount}>{searchResults.lists.length} sonuç</Text>
                </View>
              );
            } else if (item.type === 'wordHeader') {
              return (
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Kelimeler</Text>
                  <Text style={styles.resultCount}>{searchResults.words.length} sonuç</Text>
                </View>
              );
            } else if (item.type === 'list') {
              return renderListItem({ item: item.data });
            } else {
              return renderWordItem({ item: item.data });
            }
          }}
          keyExtractor={(item, index) => {
            if (item.type === 'listHeader' || item.type === 'wordHeader') {
              return item.type;
            } else {
              return `${item.type}-${item.data.id}`;
            }
          }}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyResult}
        />
      ) : (
        renderEmptyResult()
      )}
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4CAF50',
  },
  tabText: {
    fontSize: 14,
    color: '#94A3B8',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  resultCount: {
    color: '#94A3B8',
    fontSize: 14,
  },
  card: {
    marginBottom: 16,
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  cardDescription: {
    color: '#94A3B8',
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chip: {
    backgroundColor: '#334155',
  },
  dateText: {
    color: '#64748B',
    fontSize: 12,
  },
  wordCard: {
    marginBottom: 8,
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    borderWidth: 1,
  },
  wordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  wordText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  meaningText: {
    fontSize: 16,
    color: '#94A3B8',
  },
  listInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listName: {
    color: '#94A3B8',
    fontSize: 12,
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    flex: 1,
  },
  emptyText: {
    fontSize: 16,
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
  },
});

export default SearchScreen;
