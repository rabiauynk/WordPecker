import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { colors } from '../../constants/colors';
import { useAuthStore } from '../../store/authStore';
import { useSettingsStore } from '../../store/settingsStore';

export default function WelcomeScreen() {
  const router = useRouter();
  const { theme } = useSettingsStore();
  const { user } = useAuthStore();
  const themeColors = colors[theme === 'dark' ? 'dark' : 'light'];

  const [isMounted, setIsMounted] = useState(false);

  // First effect to set the mounted state
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Second effect to handle navigation after component is mounted
  useEffect(() => {
    // Only navigate if the component is mounted and user exists
    if (isMounted && user) {
      // Use setTimeout to ensure this happens after layout is complete
      const timer = setTimeout(() => {
        router.replace('/(tabs)');
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [user, router, isMounted]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=1471&auto=format&fit=crop' }}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={[styles.title, { color: themeColors.text }]}>BuzzWords</Text>
        <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
          Learn languages smarter, not harder
        </Text>

        <View style={styles.features}>
          <Text style={[styles.featureItem, { color: themeColors.text }]}>
            • Create personalized word lists
          </Text>
          <Text style={[styles.featureItem, { color: themeColors.text }]}>
            • Learn with interactive quizzes
          </Text>
          <Text style={[styles.featureItem, { color: themeColors.text }]}>
            • Track your progress
          </Text>
          <Text style={[styles.featureItem, { color: themeColors.text }]}>
            • Learn words based on location
          </Text>
        </View>
      </View>

      <View style={styles.buttons}>
        <Button
          title="Log In"
          onPress={() => router.push('/login')}
          variant="primary"
          style={styles.button}
        />
        <Button
          title="Create Account"
          onPress={() => router.push('/register')}
          variant="outline"
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#5B9BD5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    overflow: 'hidden',
  },
  logo: {
    width: 120,
    height: 120,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 32,
  },
  features: {
    alignSelf: 'flex-start',
    marginBottom: 32,
  },
  featureItem: {
    fontSize: 16,
    marginBottom: 12,
  },
  buttons: {
    width: '100%',
    padding: 24,
    gap: 16,
  },
  button: {
    width: '100%',
  },
});