import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Image } from 'react-native';
import { Card, Title, Paragraph, Button, Text, Avatar, Chip, Divider, FAB, Searchbar, ActivityIndicator, Badge } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainTabParamList, WordList, User } from '../../types';
import { commonStyles } from '../../styles/theme';

type SocialScreenNavigationProp = StackNavigationProp<MainTabParamList, 'Social'>;

// Örnek veri
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Ahmet Yılmaz',
    email: 'ahmet@example.com',
    createdAt: new Date().toISOString(),
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    id: '2',
    name: 'Ayşe Demir',
    email: 'ayse@example.com',
    createdAt: new Date().toISOString(),
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
  },
  {
    id: '3',
    name: 'Mehmet Kaya',
    email: 'mehmet@example.com',
    createdAt: new Date().toISOString(),
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
  },
];

const mockSharedLists = [
  {
    id: '1',
    listId: '101',
    listName: 'İngilizce İş Terimleri',
    description: 'İş hayatında kullanılan temel İngilizce kelimeler',
    wordCount: 45,
    sharedBy: mockUsers[0],
    sharedAt: new Date().toISOString(),
    likes: 12,
    comments: 3,
    isLiked: false,
  },
  {
    id: '2',
    listId: '102',
    listName: 'Seyahat İngilizcesi',
    description: 'Yurtdışı seyahatlerinde işinize yarayacak kelimeler',
    wordCount: 32,
    sharedBy: mockUsers[1],
    sharedAt: new Date(Date.now() - 86400000).toISOString(), // 1 gün önce
    likes: 8,
    comments: 5,
    isLiked: true,
  },
  {
    id: '3',
    listId: '103',
    listName: 'Teknoloji Terimleri',
    description: 'Yazılım ve teknoloji alanında sık kullanılan terimler',
    wordCount: 60,
    sharedBy: mockUsers[2],
    sharedAt: new Date(Date.now() - 172800000).toISOString(), // 2 gün önce
    likes: 15,
    comments: 7,
    isLiked: false,
  },
];

const mockFriends = [
  {
    ...mockUsers[0],
    isOnline: true,
    lastActive: new Date().toISOString(),
    wordsLearned: 120,
    listsCreated: 5,
  },
  {
    ...mockUsers[1],
    isOnline: false,
    lastActive: new Date(Date.now() - 3600000).toISOString(), // 1 saat önce
    wordsLearned: 85,
    listsCreated: 3,
  },
  {
    ...mockUsers[2],
    isOnline: true,
    lastActive: new Date().toISOString(),
    wordsLearned: 210,
    listsCreated: 8,
  },
];

const SocialScreen = () => {
  const [activeTab, setActiveTab] = useState<'feed' | 'friends'>('feed');
  const [sharedLists, setSharedLists] = useState([]);
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navigation = useNavigation<SocialScreenNavigationProp>();

  useEffect(() => {
    // Gerçek uygulamada API'den veri çekilir
    // Şimdilik mock veri kullanıyoruz
    setTimeout(() => {
      setSharedLists(mockSharedLists);
      setFriends(mockFriends);
      setIsLoading(false);
    }, 1000);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    // Gerçek uygulamada API'den veri yenilenir
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleLike = (id: string) => {
    // Gerçek uygulamada API çağrısı yapılır
    // Şimdilik yerel state'i güncelliyoruz
    setSharedLists(
      sharedLists.map(item => {
        if (item.id === id) {
          const isLiked = !item.isLiked;
          return {
            ...item,
            isLiked,
            likes: isLiked ? item.likes + 1 : item.likes - 1,
          };
        }
        return item;
      })
    );
  };

  const handleAddFriend = () => {
    // Arkadaş ekleme işlevi
  };

  const renderSharedListItem = ({ item }) => {
    const sharedDate = new Date(item.sharedAt).toLocaleDateString('tr-TR');
    
    return (
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Avatar.Image 
              source={{ uri: item.sharedBy.avatar }} 
              size={40} 
            />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{item.sharedBy.name}</Text>
              <Text style={styles.sharedDate}>{sharedDate}</Text>
            </View>
          </View>
          
          <Title style={styles.listTitle}>{item.listName}</Title>
          <Paragraph style={styles.listDescription}>{item.description}</Paragraph>
          
          <View style={styles.statsContainer}>
            <Chip icon="book" style={styles.statChip}>
              {item.wordCount} kelime
            </Chip>
          </View>
        </Card.Content>
        
        <Divider style={styles.divider} />
        
        <Card.Actions style={styles.cardActions}>
          <Button 
            icon={item.isLiked ? "thumb-up" : "thumb-up-outline"} 
            onPress={() => handleLike(item.id)}
            style={item.isLiked ? styles.likedButton : {}}
          >
            {item.likes}
          </Button>
          <Button icon="comment-outline">
            {item.comments}
          </Button>
          <Button 
            icon="content-copy" 
            onPress={() => {
              // Liste kopyalama işlevi
            }}
          >
            Kopyala
          </Button>
        </Card.Actions>
      </Card>
    );
  };

  const renderFriendItem = ({ item }) => {
    return (
      <Card style={styles.friendCard}>
        <Card.Content style={styles.friendCardContent}>
          <View style={styles.friendHeader}>
            <View style={styles.avatarContainer}>
              <Avatar.Image 
                source={{ uri: item.avatar }} 
                size={50} 
              />
              {item.isOnline && (
                <Badge 
                  style={styles.onlineBadge} 
                  size={12}
                />
              )}
            </View>
            
            <View style={styles.friendInfo}>
              <Text style={styles.friendName}>{item.name}</Text>
              <Text style={styles.friendStatus}>
                {item.isOnline ? 'Çevrimiçi' : `Son görülme: ${new Date(item.lastActive).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`}
              </Text>
            </View>
          </View>
          
          <View style={styles.friendStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{item.wordsLearned}</Text>
              <Text style={styles.statLabel}>Öğrenilen</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{item.listsCreated}</Text>
              <Text style={styles.statLabel}>Liste</Text>
            </View>
          </View>
          
          <View style={styles.friendActions}>
            <Button 
              mode="outlined" 
              icon="message-outline"
              style={styles.messageButton}
              onPress={() => {
                // Mesaj gönderme işlevi
              }}
            >
              Mesaj
            </Button>
            <Button 
              mode="outlined" 
              icon="account-details"
              style={styles.profileButton}
              onPress={() => {
                // Profil görüntüleme işlevi
              }}
            >
              Profil
            </Button>
          </View>
        </Card.Content>
      </Card>
    );
  };

  const renderEmptyFeed = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.emptyText}>Paylaşımlar yükleniyor...</Text>
        </View>
      );
    }
    
    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons name="share-variant" size={64} color="#94A3B8" />
        <Text style={styles.emptyText}>Henüz paylaşılan liste yok.</Text>
        <Text style={styles.emptySubText}>Arkadaşlarınız liste paylaştığında burada görünecek.</Text>
      </View>
    );
  };

  const renderEmptyFriends = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.emptyText}>Arkadaşlar yükleniyor...</Text>
        </View>
      );
    }
    
    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons name="account-group" size={64} color="#94A3B8" />
        <Text style={styles.emptyText}>Henüz arkadaşınız yok.</Text>
        <Text style={styles.emptySubText}>Birlikte öğrenmek için arkadaş ekleyin.</Text>
        <Button 
          mode="contained" 
          onPress={handleAddFriend}
          style={styles.addFriendButton}
          icon="account-plus"
        >
          Arkadaş Ekle
        </Button>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'feed' && styles.activeTab]}
          onPress={() => setActiveTab('feed')}
        >
          <Text style={[styles.tabText, activeTab === 'feed' && styles.activeTabText]}>
            Akış
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'friends' && styles.activeTab]}
          onPress={() => setActiveTab('friends')}
        >
          <Text style={[styles.tabText, activeTab === 'friends' && styles.activeTabText]}>
            Arkadaşlar
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'feed' ? (
        <>
          <FlatList
            data={sharedLists}
            renderItem={renderSharedListItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={renderEmptyFeed}
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
            icon="share-variant"
            onPress={() => {
              // Liste paylaşma ekranına git
            }}
            color="#FFFFFF"
          />
        </>
      ) : (
        <>
          <View style={styles.searchContainer}>
            <Searchbar
              placeholder="Arkadaş ara..."
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={styles.searchbar}
              iconColor="#94A3B8"
              inputStyle={{ color: '#FFFFFF' }}
            />
          </View>
          <FlatList
            data={friends}
            renderItem={renderFriendItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={renderEmptyFriends}
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
            icon="account-plus"
            onPress={handleAddFriend}
            color="#FFFFFF"
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4CAF50',
  },
  tabText: {
    fontSize: 16,
    color: '#94A3B8',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
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
  listContent: {
    padding: 16,
    paddingBottom: 80, // FAB için alan bırak
  },
  card: {
    marginBottom: 16,
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  userInfo: {
    marginLeft: 12,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  sharedDate: {
    fontSize: 12,
    color: '#64748B',
  },
  listTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  listDescription: {
    color: '#94A3B8',
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  statChip: {
    backgroundColor: '#334155',
    marginRight: 8,
  },
  divider: {
    backgroundColor: '#334155',
  },
  cardActions: {
    justifyContent: 'space-between',
  },
  likedButton: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  friendCard: {
    marginBottom: 16,
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    borderWidth: 1,
  },
  friendCardContent: {
    padding: 8,
  },
  friendHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#1E293B',
  },
  friendInfo: {
    marginLeft: 12,
    justifyContent: 'center',
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  friendStatus: {
    fontSize: 12,
    color: '#94A3B8',
  },
  friendStats: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#0F172A',
    borderRadius: 8,
    padding: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#94A3B8',
  },
  friendActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  messageButton: {
    flex: 1,
    marginRight: 8,
    borderColor: '#4CAF50',
  },
  profileButton: {
    flex: 1,
    marginLeft: 8,
    borderColor: '#64748B',
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
  addFriendButton: {
    backgroundColor: '#4CAF50',
  },
});

export default SocialScreen;
