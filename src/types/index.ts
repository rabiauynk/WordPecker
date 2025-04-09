// Navigation Types

// Root Stack Navigator Types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  FeaturePlaceholder: {
    featureId: number;
    featureName: string;
    description: string
  };
};

// Auth Stack Navigator Types
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

// Main Tab Navigator Types
export type MainTabParamList = {
  Lists: undefined;
  Learn: undefined;
  Progress: undefined;
  Social: undefined;
  Settings: undefined;
};

// Lists Stack Navigator Types
export type ListsStackParamList = {
  MyLists: undefined;
  CreateList: undefined;
  ListDetail: { listId: string; listName: string };
  AddWord: { listId: string; listName: string };
  Camera: { listId: string; listName: string };
  Search: undefined;
};

// Learn Stack Navigator Types
export type LearnStackParamList = {
  LearnHome: undefined;
  Quiz: { listId: string; listName: string };
};

// Data Types
export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
}

export interface WordList {
  id: string;
  name: string;
  description: string;
  context?: string;
  createdAt: string;
  wordCount?: number;
}

export interface Word {
  id: string;
  listId: string;
  value: string;
  meaning: string;
  createdAt: string;
}

export interface Exercise {
  wordId: string;
  type: 'multiple_choice';
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface Quiz {
  wordId: string;
  type: 'quiz';
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface Progress {
  listId: string;
  wordId: string;
  mastery: number; // 0-100
  lastPracticed: string;
  timesCorrect: number;
  timesIncorrect: number;
}

// Auth Context Types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextProps {
  authState: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}
