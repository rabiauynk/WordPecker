import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Search, BookOpen } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useSettingsStore } from '@/store/settingsStore';
import { useWordListsStore } from '@/store/wordListsStore';
import { WordListCard } from '@/components/WordListCard';
import { Input } from '@/components/Input';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/Button';

export default function ListsScreen() {
  const router = useRouter();
  const { theme } = useSettingsStore();
  const { lists, searchLists } = useWordListsStore();
  const themeColors = colors[theme === 'dark' ? 'dark' : 'light'];
  
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredLists = searchQuery ? searchLists(searchQuery) : lists;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: themeColors.text }]}>My Word Lists</Text>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: themeColors.primary }]}
          onPress={() => router.push('/list/create')}
        >
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <Input
          placeholder="Search lists..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Search size={20} color={themeColors.textSecondary} />}
        />
      </View>
      
      {lists.length === 0 ? (
        <EmptyState
          title="No Lists Yet"
          message="Create your first word list to start learning"
          icon={<BookOpen size={64} color={themeColors.primary} />}
          actionLabel="Create List"
          onAction={() => router.push('/list/create')}
        />
      ) : (
        <FlatList
          data={filteredLists}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <WordListCard
              list={item}
              onPress={(list) => router.push(`/list/${list.id}`)}
            />
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptySearch}>
              <Text style={[styles.emptySearchText, { color: themeColors.textSecondary }]}>
                No lists found matching "{searchQuery}"
              </Text>
              <Button
                title="Clear Search"
                onPress={() => setSearchQuery('')}
                variant="outline"
                size="small"
                style={styles.clearButton}
              />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    padding: 16,
  },
  listContent: {
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
    marginBottom: 16,
  },
  clearButton: {
    minWidth: 120,
  },
});
