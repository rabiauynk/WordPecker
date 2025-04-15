import React, { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Home, BookOpen, Brain, BarChart2, Settings } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { useSettingsStore } from '../../store/settingsStore';
import { useAuthStore } from '../../store/authStore';
import { useWordListsStore } from '../../store/wordListsStore';
import { useProgressStore } from '../../store/progressStore';

export default function TabLayout() {
  const { theme } = useSettingsStore();
  const systemTheme = useColorScheme();
  const activeTheme = theme === 'system' ? systemTheme || 'light' : theme;
  const themeColors = colors[activeTheme === 'dark' ? 'dark' : 'light'];
  
  const { user } = useAuthStore();
  const { fetchLists } = useWordListsStore();
  const { fetchProgress } = useProgressStore();
  
  useEffect(() => {
    if (user) {
      // Fetch initial data
      fetchLists();
      fetchProgress();
    }
  }, [user, fetchLists, fetchProgress]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: themeColors.primary,
        tabBarInactiveTintColor: themeColors.inactive,
        tabBarStyle: {
          backgroundColor: themeColors.background,
          borderTopColor: themeColors.border,
        },
        headerStyle: {
          backgroundColor: themeColors.background,
        },
        headerTintColor: themeColors.text,
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="lists"
        options={{
          title: 'Lists',
          tabBarIcon: ({ color, size }) => <BookOpen size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Learn',
          tabBarIcon: ({ color, size }) => <Brain size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          tabBarIcon: ({ color, size }) => <BarChart2 size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}