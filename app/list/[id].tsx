import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Plus, 
  Search, 
  Share2, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Brain, 
  HelpCircle 
} from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { useSettingsStore } from '../../store/settingsStore';
import { useWordListsStore } from '../../store/wordListsStore';
import { WordCard } from '../../components/WordCard';
import { Input } from '../../components/Input';
import { EmptyState } from '../../components/EmptyState';
import { languages } from '../../mocks/languages';
import { Word } from '../../types/wordList';

export default function ListDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { theme } = useSettingsStore();
  const { lists, setCurrentList, deleteList, deleteWord } = useWordListsStore();
  const themeColors = colors[theme === 'dark' ? 'dark' : 'light'];
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  
  // Find the list by id
  const list = lists.find(list => list.id === id);
  
  useEffect(() => {
    if (list) {
      setCurrentList(list);
      
      // Set the header title
      return () => {
        setCurrentList(null);
      };
    }
  }, [list, setCurrentList]);
  
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
  
  const filteredWords = searchQuery
    ? list.words.filter(word => 
        word.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        word.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (word.example && word.example.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : list.words;
  
  const handleDeleteWord = (wordId: string) => {
    Alert.alert(
      'Delete Word',
      'Are you sure you want to delete this word?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => deleteWord(list.id, wordId),
          style: 'destructive',
        },
      ]
    );
  };
  
  const handleDeleteList = () => {
    Alert.alert(
      'Delete List',
      'Are you sure you want to delete this list? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            deleteList(list.id);
            router.back();
          },
          style: 'destructive',
        },
      ]
    );
  };
  
  const getLanguageName = (code: string) => {
    const language = languages.find(lang => lang.code === code);
    return language ? language.name : code;
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]} edges={['bottom']}>
      <Stack.Screen 
        options={{
          title: list.title,
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => setShowOptions(!showOptions)}
              >
                <MoreVertical size={24} color={themeColors.text} />
              </TouchableOpacity>
            </View>
          ),
        }} 
      />
      
      {showOptions && (
        <View style={[styles.optionsMenu, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
          <TouchableOpacity 
            style={styles.optionItem}
            onPress={() => {
              setShowOptions(false);
              // Handle edit list
            }}
          >
            <Edit2 size={20} color={themeColors.text} />
            <Text style={[styles.optionText, { color: themeColors.text }]}>Edit List</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.optionItem}
            onPress={() => {
              setShowOptions(false);
              // Handle share list
            }}
          >
            <Share2 size={20} color={themeColors.text} />
            <Text style={[styles.optionText, { color: themeColors.text }]}>Share List</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.optionItem}
            onPress={() => {
              setShowOptions(false);
              router.push(`/learn/${list.id}`);
            }}
          >
            <Brain size={20} color={themeColors.text} />
            <Text style={[styles.optionText, { color: themeColors.text }]}>Practice</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.optionItem, styles.deleteOption]}
            onPress={() => {
              setShowOptions(false);
              handleDeleteList();
            }}
          >
            <Trash2 size={20} color={themeColors.error} />
            <Text style={[styles.optionText, { color: themeColors.error }]}>Delete List</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <View style={styles.listInfo}>
        <View style={styles.listInfoItem}>
          <Text style={[styles.listInfoLabel, { color: themeColors.textSecondary }]}>Language</Text>
          <Text style={[styles.listInfoValue, { color: themeColors.text }]}>
            {getLanguageName(list.targetLanguage)}
          </Text>
        </View>
        
        <View style={styles.listInfoItem}>
          <Text style={[styles.listInfoLabel, { color: themeColors.textSecondary }]}>Words</Text>
          <Text style={[styles.listInfoValue, { color: themeColors.text }]}>{list.words.length}</Text>
        </View>
        
        {list.description && (
          <View style={styles.listDescription}>
            <Text style={[styles.listInfoLabel, { color: themeColors.textSecondary }]}>Description</Text>
            <Text style={[styles.descriptionText, { color: themeColors.text }]}>{list.description}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.searchContainer}>
        <Input
          placeholder="Search words..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Search size={20} color={themeColors.textSecondary} />}
        />
      </View>
      
      <View style={styles.wordsHeader}>
        <Text style={[styles.wordsTitle, { color: themeColors.text }]}>Words</Text>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: themeColors.primary }]}
          onPress={() => router.push({ pathname: '/list/add-word', params: { listId: list.id } })}
        >
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add Word</Text>
        </TouchableOpacity>
      </View>
      
      {list.words.length === 0 ? (
        <EmptyState
          title="No Words Yet"
          message="Add your first word to start learning"
          icon={<Plus size={64} color={themeColors.primary} />}
          actionLabel="Add Word"
          onAction={() => router.push({ pathname: '/list/add-word', params: { listId: list.id } })}
        />
      ) : (
        <FlatList
          data={filteredWords}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <WordCard
              word={item}
              onEdit={(word) => router.push({ 
                pathname: `/list/edit-word/${word.id}`,
                params: { listId: list.id }
              })}
              onDelete={(word) => handleDeleteWord(word.id)}
              onPlayAudio={(word) => {
                if (!word.audioUrl) {
                  Alert.alert('No Audio', 'This word does not have audio pronunciation.');
                }
              }}
            />
          )}
          contentContainerStyle={styles.wordsList}
          ListEmptyComponent={
            <View style={styles.emptySearch}>
              <Text style={[styles.emptySearchText, { color: themeColors.textSecondary }]}>
                No words found matching "{searchQuery}"
              </Text>
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Text style={[styles.clearSearch, { color: themeColors.primary }]}>Clear Search</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 8,
  },
  optionsMenu: {
    position: 'absolute',
    top: 0,
    right: 16,
    zIndex: 10,
    borderRadius: 8,
    borderWidth: 1,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  optionText: {
    fontSize: 16,
  },
  deleteOption: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  listInfo: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  listInfoItem: {
    marginRight: 24,
    marginBottom: 16,
  },
  listInfoLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  listInfoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  listDescription: {
    width: '100%',
  },
  descriptionText: {
    fontSize: 14,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  wordsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  wordsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  wordsList: {
    padding: 16,
    paddingTop: 0,
  },
  emptySearch: {
    padding: 24,
    alignItems: 'center',
  },
  emptySearchText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  clearSearch: {
    fontSize: 16,
    fontWeight: '500',
  },
});


