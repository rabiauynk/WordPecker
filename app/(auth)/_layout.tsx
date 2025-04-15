import { Stack, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { useColorScheme } from "react-native";
import { colors } from "../../constants/colors";
import { useAuthStore } from "../../store/authStore";
import { useSettingsStore } from "../../store/settingsStore";

export default function AuthLayout() {
  const { theme } = useSettingsStore();
  const { user } = useAuthStore();
  const router = useRouter();
  const systemTheme = useColorScheme();
  const activeTheme = theme === 'system' ? systemTheme || 'light' : theme;
  const themeColors = colors[activeTheme === 'dark' ? 'dark' : 'light'];

  // Kullanıcı oturum açmışsa ana ekrana yönlendir
  useEffect(() => {
    if (user) {
      router.replace('/(tabs)');
    }
  }, [user, router]);

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: themeColors.background,
        },
        headerTintColor: themeColors.text,
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: themeColors.background,
        },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ title: "Log In" }} />
      <Stack.Screen name="register" options={{ title: "Create Account" }} />
      <Stack.Screen name="forgot-password" options={{ title: "Reset Password" }} />
    </Stack>
  );
}