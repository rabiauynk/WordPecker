import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Word, WordList, WordListsState } from '../types/wordList';

// Create mock data since it's missing from the mocks file
const mockWordLists: WordList[] = [
  {
    id: 'list_1',
    title: 'Basic Spanish Vocabulary',
    description: 'Essential words for beginners',
    targetLanguage: 'es',
    createdAt: '2023-09-15T10:30:00Z',
    updatedAt: '2023-10-01T14:20:00Z',
    wordCount: 3,
    userId: 'user123',
    words: [
      {
        id: 'word_1',
        term: 'hola',
        definition: 'hello',
        example: '¡Hola! ¿Cómo estás?',
        createdAt: '2023-09-15T10:35:00Z',
        masteryLevel: 4
      },
      {
        id: 'word_2',
        term: 'gracias',
        definition: 'thank you',
        example: 'Muchas gracias por tu ayuda.',
        createdAt: '2023-09-15T10:40:00Z',
        masteryLevel: 3
      },
      {
        id: 'word_3',
        term: 'adiós',
        definition: 'goodbye',
        example: '¡Adiós! Hasta mañana.',
        createdAt: '2023-09-15T10:45:00Z',
        masteryLevel: 2
      }
    ]
  },
  {
    id: 'list_2',
    title: 'French Food Vocabulary',
    description: 'Words related to food and dining',
    targetLanguage: 'fr',
    createdAt: '2023-09-20T09:15:00Z',
    updatedAt: '2023-09-25T16:40:00Z',
    wordCount: 3,
    userId: 'user123',
    words: [
      {
        id: 'word_4',
        term: 'pain',
        definition: 'bread',
        example: 'Je voudrais acheter du pain, s\'il vous plaît.',
        createdAt: '2023-09-20T09:20:00Z',
        masteryLevel: 1
      },
      {
        id: 'word_5',
        term: 'fromage',
        definition: 'cheese',
        example: 'La France est connue pour ses fromages.',
        createdAt: '2023-09-20T09:25:00Z',
        masteryLevel: 0
      },
      {
        id: 'word_6',
        term: 'vin',
        definition: 'wine',
        example: 'Un verre de vin rouge, s\'il vous plaît.',
        createdAt: '2023-09-20T09:30:00Z',
        masteryLevel: 2
      }
    ]
  },
  {
    id: 'list_3',
    title: 'Japanese Greetings',
    description: 'Common greetings and phrases',
    targetLanguage: 'ja',
    createdAt: '2023-09-25T11:00:00Z',
    updatedAt: '2023-09-28T13:45:00Z',
    wordCount: 3,
    userId: 'user123',
    words: [
      {
        id: 'word_7',
        term: 'こんにちは',
        definition: 'hello/good afternoon',
        example: 'こんにちは、元気ですか？',
        createdAt: '2023-09-25T11:05:00Z',
        masteryLevel: 1
      },
      {
        id: 'word_8',
        term: 'ありがとう',
        definition: 'thank you',
        example: 'ありがとうございます。',
        createdAt: '2023-09-25T11:10:00Z',
        masteryLevel: 0
      },
      {
        id: 'word_9',
        term: 'さようなら',
        definition: 'goodbye',
        example: 'さようなら、また明日。',
        createdAt: '2023-09-25T11:15:00Z',
        masteryLevel: 0
      }
    ]
  }
];

interface WordListsStore extends WordListsState {
  fetchLists: () => Promise<void>;
  createList: (list: Omit<WordList, 'id' | 'createdAt' | 'updatedAt' | 'wordCount' | 'words'>) => Promise<void>;
  updateList: (id: string, data: Partial<WordList>) => Promise<void>;
  deleteList: (id: string) => Promise<void>;
  setCurrentList: (list: WordList | null) => void;
  addWord: (listId: string, word: Omit<Word, 'id' | 'createdAt' | 'masteryLevel'>) => Promise<void>;
  updateWord: (listId: string, wordId: string, data: Partial<Word>) => Promise<void>;
  deleteWord: (listId: string, wordId: string) => Promise<void>;
  searchLists: (query: string) => WordList[];
  searchWords: (query: string) => { list: WordList, word: Word }[];
}

export const useWordListsStore = create<WordListsStore>()(
  persist(
    (set, get) => ({
      lists: [],
      currentList: null,
      isLoading: false,
      error: null,

      fetchLists: async () => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Use mock data
          set({ lists: mockWordLists, isLoading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : "Failed to fetch lists", isLoading: false });
        }
      },

      createList: async (list) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));

          const newList: WordList = {
            ...list,
            id: `list_${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            wordCount: 0,
            words: [],
          };

          set(state => ({
            lists: [...state.lists, newList],
            isLoading: false
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : "Failed to create list", isLoading: false });
        }
      },

      updateList: async (id, data) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));

          set(state => ({
            lists: state.lists.map(list =>
              list.id === id
                ? { ...list, ...data, updatedAt: new Date().toISOString() }
                : list
            ),
            currentList: state.currentList?.id === id
              ? { ...state.currentList, ...data, updatedAt: new Date().toISOString() }
              : state.currentList,
            isLoading: false
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : "Failed to update list", isLoading: false });
        }
      },

      deleteList: async (id) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));

          set(state => ({
            lists: state.lists.filter(list => list.id !== id),
            currentList: state.currentList?.id === id ? null : state.currentList,
            isLoading: false
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : "Failed to delete list", isLoading: false });
        }
      },

      setCurrentList: (list) => {
        set({ currentList: list });
      },

      addWord: async (listId, word) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));

          const newWord: Word = {
            ...word,
            id: `word_${Date.now()}`,
            createdAt: new Date().toISOString(),
            masteryLevel: 0,
          };

          set(state => {
            const updatedLists = state.lists.map(list => {
              if (list.id === listId) {
                const updatedWords = [...list.words, newWord];
                return {
                  ...list,
                  words: updatedWords,
                  wordCount: updatedWords.length,
                  updatedAt: new Date().toISOString()
                };
              }
              return list;
            });

            const updatedCurrentList = state.currentList?.id === listId
              ? {
                  ...state.currentList,
                  words: [...state.currentList.words, newWord],
                  wordCount: state.currentList.wordCount + 1,
                  updatedAt: new Date().toISOString()
                }
              : state.currentList;

            return {
              lists: updatedLists,
              currentList: updatedCurrentList,
              isLoading: false
            };
          });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : "Failed to add word", isLoading: false });
        }
      },

      updateWord: async (listId, wordId, data) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));

          set(state => {
            const updatedLists = state.lists.map(list => {
              if (list.id === listId) {
                const updatedWords = list.words.map(word =>
                  word.id === wordId ? { ...word, ...data } : word
                );
                return {
                  ...list,
                  words: updatedWords,
                  updatedAt: new Date().toISOString()
                };
              }
              return list;
            });

            const updatedCurrentList = state.currentList?.id === listId
              ? {
                  ...state.currentList,
                  words: state.currentList.words.map(word =>
                    word.id === wordId ? { ...word, ...data } : word
                  ),
                  updatedAt: new Date().toISOString()
                }
              : state.currentList;

            return {
              lists: updatedLists,
              currentList: updatedCurrentList,
              isLoading: false
            };
          });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : "Failed to update word", isLoading: false });
        }
      },

      deleteWord: async (listId, wordId) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));

          set(state => {
            const updatedLists = state.lists.map(list => {
              if (list.id === listId) {
                const updatedWords = list.words.filter(word => word.id !== wordId);
                return {
                  ...list,
                  words: updatedWords,
                  wordCount: updatedWords.length,
                  updatedAt: new Date().toISOString()
                };
              }
              return list;
            });

            const updatedCurrentList = state.currentList?.id === listId
              ? {
                  ...state.currentList,
                  words: state.currentList.words.filter(word => word.id !== wordId),
                  wordCount: state.currentList.wordCount - 1,
                  updatedAt: new Date().toISOString()
                }
              : state.currentList;

            return {
              lists: updatedLists,
              currentList: updatedCurrentList,
              isLoading: false
            };
          });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : "Failed to delete word", isLoading: false });
        }
      },

      searchLists: (query) => {
        const { lists } = get();
        if (!query.trim()) return lists;

        const lowerQuery = query.toLowerCase();
        return lists.filter(list =>
          list.title.toLowerCase().includes(lowerQuery) ||
          (list.description && list.description.toLowerCase().includes(lowerQuery))
        );
      },

      searchWords: (query) => {
        const { lists } = get();
        if (!query.trim()) return [];

        const lowerQuery = query.toLowerCase();
        const results: { list: WordList, word: Word }[] = [];

        lists.forEach(list => {
          list.words.forEach(word => {
            if (
              word.term.toLowerCase().includes(lowerQuery) ||
              word.definition.toLowerCase().includes(lowerQuery) ||
              (word.example && word.example.toLowerCase().includes(lowerQuery))
            ) {
              results.push({ list, word });
            }
          });
        });

        return results;
      },
    }),
    {
      name: 'word-lists-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);