import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ProgressState, WordProgress, DailyProgress } from '../types/progress';
import { mockDailyProgress } from '../mocks/progress';

interface ProgressStore extends ProgressState {
  fetchProgress: () => Promise<void>;
  updateWordProgress: (wordId: string, masteryChange: number) => void;
  recordQuizResult: (correctAnswers: number, totalQuestions: number) => void;
  recordWordLearned: (wordId: string) => void;
  recordWordReviewed: (wordId: string, wasCorrect: boolean) => void;
  getStreakCount: () => number;
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      dailyProgress: [],
      wordProgress: {},
      streak: 0,
      isLoading: false,
      error: null,

      fetchProgress: async () => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Use mock data
          set({ 
            dailyProgress: mockDailyProgress,
            streak: 7, // Mock streak
            isLoading: false 
          });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : "Failed to fetch progress", isLoading: false });
        }
      },

      updateWordProgress: (wordId, masteryChange) => {
        set(state => {
          const currentProgress = state.wordProgress[wordId] || {
            wordId,
            masteryLevel: 0,
            lastReviewed: new Date().toISOString(),
            reviewCount: 0
          };
          
          const newMasteryLevel = Math.max(0, Math.min(5, currentProgress.masteryLevel + masteryChange));
          
          return {
            wordProgress: {
              ...state.wordProgress,
              [wordId]: {
                ...currentProgress,
                masteryLevel: newMasteryLevel,
                lastReviewed: new Date().toISOString(),
                reviewCount: currentProgress.reviewCount + 1
              }
            }
          };
        });
      },

      recordQuizResult: (correctAnswers, totalQuestions) => {
        set(state => {
          const today = new Date().toISOString().split('T')[0];
          const todayProgress = state.dailyProgress.find(p => p.date === today);
          
          let updatedDailyProgress;
          if (todayProgress) {
            updatedDailyProgress = state.dailyProgress.map(p => 
              p.date === today 
                ? {
                    ...p,
                    quizzesTaken: p.quizzesTaken + 1,
                    correctAnswers: p.correctAnswers + correctAnswers,
                    totalQuestions: p.totalQuestions + totalQuestions
                  }
                : p
            );
          } else {
            updatedDailyProgress = [
              ...state.dailyProgress,
              {
                date: today,
                wordsLearned: 0,
                wordsReviewed: 0,
                quizzesTaken: 1,
                correctAnswers,
                totalQuestions
              }
            ];
          }
          
          // Update streak if user had activity today
          const streak = state.streak + (todayProgress ? 0 : 1);
          
          return {
            dailyProgress: updatedDailyProgress,
            streak
          };
        });
      },

      recordWordLearned: (wordId) => {
        set(state => {
          const today = new Date().toISOString().split('T')[0];
          const todayProgress = state.dailyProgress.find(p => p.date === today);
          
          let updatedDailyProgress;
          if (todayProgress) {
            updatedDailyProgress = state.dailyProgress.map(p => 
              p.date === today 
                ? { ...p, wordsLearned: p.wordsLearned + 1 }
                : p
            );
          } else {
            updatedDailyProgress = [
              ...state.dailyProgress,
              {
                date: today,
                wordsLearned: 1,
                wordsReviewed: 0,
                quizzesTaken: 0,
                correctAnswers: 0,
                totalQuestions: 0
              }
            ];
          }
          
          // Update streak if user had activity today
          const streak = state.streak + (todayProgress ? 0 : 1);
          
          return {
            dailyProgress: updatedDailyProgress,
            streak
          };
        });
      },

      recordWordReviewed: (wordId, wasCorrect) => {
        set(state => {
          const today = new Date().toISOString().split('T')[0];
          const todayProgress = state.dailyProgress.find(p => p.date === today);
          
          let updatedDailyProgress;
          if (todayProgress) {
            updatedDailyProgress = state.dailyProgress.map(p => 
              p.date === today 
                ? { 
                    ...p, 
                    wordsReviewed: p.wordsReviewed + 1,
                    correctAnswers: wasCorrect ? p.correctAnswers + 1 : p.correctAnswers,
                    totalQuestions: p.totalQuestions + 1
                  }
                : p
            );
          } else {
            updatedDailyProgress = [
              ...state.dailyProgress,
              {
                date: today,
                wordsLearned: 0,
                wordsReviewed: 1,
                quizzesTaken: 0,
                correctAnswers: wasCorrect ? 1 : 0,
                totalQuestions: 1
              }
            ];
          }
          
          // Update streak if user had activity today
          const streak = state.streak + (todayProgress ? 0 : 1);
          
          // Update word progress
          const currentProgress = state.wordProgress[wordId] || {
            wordId,
            masteryLevel: 0,
            lastReviewed: new Date().toISOString(),
            reviewCount: 0
          };
          
          const masteryChange = wasCorrect ? 1 : -1;
          const newMasteryLevel = Math.max(0, Math.min(5, currentProgress.masteryLevel + masteryChange));
          
          return {
            dailyProgress: updatedDailyProgress,
            wordProgress: {
              ...state.wordProgress,
              [wordId]: {
                ...currentProgress,
                masteryLevel: newMasteryLevel,
                lastReviewed: new Date().toISOString(),
                reviewCount: currentProgress.reviewCount + 1
              }
            },
            streak
          };
        });
      },

      getStreakCount: () => {
        return get().streak;
      },
    }),
    {
      name: 'progress-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);