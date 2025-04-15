export interface Word {
  id: string;
  term: string;
  definition: string;
  example?: string;
  imageUrl?: string;
  audioUrl?: string;
  createdAt: string;
  lastReviewed?: string;
  masteryLevel: number; // 0-5 scale
}

export interface WordList {
  id: string;
  title: string;
  description?: string;
  targetLanguage: string;
  createdAt: string;
  updatedAt: string;
  wordCount: number;
  words: Word[];
  userId: string;
}

export interface WordListsState {
  lists: WordList[];
  currentList: WordList | null;
  isLoading: boolean;
  error: string | null;
}