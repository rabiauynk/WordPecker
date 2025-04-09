import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { Card, Title, Paragraph, Button, FAB, Text, Chip, Menu, Divider, IconButton, ActivityIndicator } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ListsStackParamList, Word, WordList } from '../../types';
import { commonStyles } from '../../styles/theme';

type ListDetailScreenNavigationProp = StackNavigationProp<ListsStackParamList, 'ListDetail'>;
type ListDetailScreenRouteProp = RouteProp<ListsStackParamList, 'ListDetail'>;

// Örnek veri
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
    listId: '1',
    value: 'computer',
    meaning: 'bilgisayar',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    listId: '1',
    value: 'house',
    meaning: 'ev',
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    listId: '1',
    value: 'car',
    meaning: 'araba',
    createdAt: new Date().toISOString(),
  },
];

const mockListDetails: WordList = {
  id: '1',
  name: 'İngilizce Günlük Konuşma',
  description: 'Günlük hayatta kullanılan temel İngilizce kelimeler',
  context: 'İngilizce konuşma kitabı',
  createdAt: new Date().toISOString(),
  wordCount: 42,
};

const ListDetailScreen = () => {
  const [words, setWords] = useState<Word[]>([]);
  const [listDetails, setListDetails] = useState<WordList | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const navigation = useNavigation<ListDetailScreenNavigationProp>();
  const route = useRoute<ListDetailScreenRouteProp>();
  const { listId, listName } = route.params;

  useEffect(() => {
    // Gerçek uygulamada API'den veri çekilir
    // Şimdilik mock veri kullanıyoruz
    setTimeout(() => {
      setWords(mockWords);
      setListDetails(mockListDetails);
      setIsLoading(false);
    }, 1000);
  }, [listId]);

  const onRefresh = () => {
    setRefreshing(true);
    // Gerçek uygulamada API'den veri yenilenir
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleDeleteWord = (wordId: string) => {
    Alert.alert(
      'Kelimeyi Sil',
      'Bu kelimeyi silmek istediğinizden emin misiniz?',
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Sil',
          onPress: () => {
            // Gerçek uygulamada API çağrısı yapılır
            // Şimdilik yerel state'i güncelliyoruz
            setWords(words.filter(word => word.id !== wordId));
          },
          style: 'destructive',
        },
      ],
    );
  };

  const handleDeleteList = () => {
    Alert.alert(
      'Listeyi Sil',
      'Bu listeyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Sil',
          onPress: () => {
            // Gerçek uygulamada API çağrısı yapılır
            // Şimdilik ana sayfaya dönüyoruz
            navigation.goBack();
          },
          style: 'destructive',
        },
      ],
    );
  };

  const renderWordItem = ({ item }: { item: Word }) => {
    return (
      <Card style={styles.wordCard}>
        <Card.Content style={styles.wordCardContent}>
          <View style={styles.wordContainer}>
            <Text style={styles.wordText}>{item.value}</Text>
            <Text style={styles.meaningText}>{item.meaning}</Text>
          </View>
          <IconButton
            icon="delete"
            size={20}
            onPress={() => handleDeleteWord(item.id)}
            style={styles.deleteButton}
            color="#EF4444"
          />
        </Card.Content>
      </Card>
    );
  };

  const renderEmptyList = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.emptyText}>Kelimeler yükleniyor...</Text>
        </View>
      );
    }
    
    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons name="book-plus" size={64} color="#94A3B8" />
        <Text style={styles.emptyText}>Bu listede henüz kelime yok.</Text>
        <Text style={styles.emptySubText}>Kelime eklemek için aşağıdaki butona tıklayın.</Text>
        <Button 
          mode="contained" 
          onPress={() => navigation.navigate('AddWord', { listId, listName })}
          style={styles.addButton}
          icon="plus"
        >
          Kelime Ekle
        </Button>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Liste yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {listDetails && (
        <Card style={styles.listInfoCard}>
          <Card.Content>
            <View style={styles.listInfoHeader}>
              <Title style={styles.listTitle}>{listDetails.name}</Title>
              <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={
                  <IconButton
                    icon="dots-vertical"
                    size={24}
                    onPress={() => setMenuVisible(true)}
                    color="#FFFFFF"
                  />
                }
                contentStyle={styles.menuContent}
              >
                <Menu.Item
                  onPress={() => {
                    setMenuVisible(false);
                    // Liste düzenleme ekranına git
                  }}
                  title="Listeyi Düzenle"
                  leadingIcon="pencil"
                />
                <Divider />
                <Menu.Item
                  onPress={() => {
                    setMenuVisible(false);
                    handleDeleteList();
                  }}
                  title="Listeyi Sil"
                  leadingIcon="delete"
                  titleStyle={{ color: '#EF4444' }}
                />
              </Menu>
            </View>
            
            {listDetails.description && (
              <Paragraph style={styles.listDescription}>{listDetails.description}</Paragraph>
            )}
            
            {listDetails.context && (
              <View style={styles.contextContainer}>
                <Text style={styles.contextLabel}>Kaynak:</Text>
                <Text style={styles.contextText}>{listDetails.context}</Text>
              </View>
            )}

            <View style={styles.statsContainer}>
              <Chip icon="book" style={styles.statChip}>
                {words.length} kelime
              </Chip>
              <Chip icon="calendar" style={styles.statChip}>
                {new Date(listDetails.createdAt).toLocaleDateString('tr-TR')}
              </Chip>
            </View>

            <View style={styles.actionButtonsContainer}>
              <Button 
                mode="contained" 
                onPress={() => navigation.navigate('Learn', { listId, listName })}
                style={[styles.actionButton, styles.learnButton]}
                icon="book-open-variant"
              >
                Öğren
              </Button>
              <Button 
                mode="contained" 
                onPress={() => navigation.navigate('Quiz', { listId, listName })}
                style={[styles.actionButton, styles.quizButton]}
                icon="head-question"
              >
                Quiz
              </Button>
            </View>
          </Card.Content>
        </Card>
      )}

      <View style={styles.wordsHeaderContainer}>
        <Title style={styles.wordsTitle}>Kelimeler</Title>
        <Button 
          mode="text" 
          onPress={() => navigation.navigate('AddWord', { listId, listName })}
          icon="plus"
        >
          Kelime Ekle
        </Button>
      </View>

      <FlatList
        data={words}
        renderItem={renderWordItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.wordsList}
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
        onPress={() => navigation.navigate('AddWord', { listId, listName })}
        color="#FFFFFF"
      />
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
  listInfoCard: {
    marginBottom: 16,
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    borderWidth: 1,
  },
  listInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    flex: 1,
  },
  listDescription: {
    color: '#94A3B8',
    marginBottom: 8,
  },
  contextContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  contextLabel: {
    color: '#64748B',
    marginRight: 4,
  },
  contextText: {
    color: '#94A3B8',
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  statChip: {
    backgroundColor: '#334155',
    marginRight: 8,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  learnButton: {
    backgroundColor: '#4CAF50',
  },
  quizButton: {
    backgroundColor: '#FF9800',
  },
  wordsHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  wordsTitle: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  wordsList: {
    paddingBottom: 80, // FAB için alan bırak
  },
  wordCard: {
    marginBottom: 8,
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    borderWidth: 1,
  },
  wordCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  wordContainer: {
    flex: 1,
  },
  wordText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  meaningText: {
    fontSize: 14,
    color: '#94A3B8',
  },
  deleteButton: {
    margin: 0,
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
  addButton: {
    backgroundColor: '#4CAF50',
  },
  menuContent: {
    backgroundColor: '#1E293B',
  },
});

export default ListDetailScreen;
