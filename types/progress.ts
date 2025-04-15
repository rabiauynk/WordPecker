export interface DailyProgress {
  date: string;
  wordsLearned: number;
  wordsReviewed: number;
  quizzesTaken: number;
  correctAnswers: number;
  totalQuestions: number;
}

export interface WordProgress {
  wordId: string;
  masteryLevel: number;
  lastReviewed: string;
  reviewCount: number;
}

export interface ProgressState {
  dailyProgress: DailyProgress[];
  wordProgress: Record<string, WordProgress>;
  streak: number;
  isLoading: boolean;
  error: string | null;
}