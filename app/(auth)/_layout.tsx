import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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

  // Navigasyon hazır olduğunda kontrol etmek için state
  const [isNavigationReady, setIsNavigationReady] = useState(false);

  // İlk render'dan sonra navigasyon hazır olarak işaretlenir
  useEffect(() => {
    // Bir sonraki render döngüsünde navigasyon hazır olarak işaretle
    const timer = setTimeout(() => {
      setIsNavigationReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Kullanıcı oturum açmışsa ana ekrana yönlendir
  useEffect(() => {
    // Navigasyon hazır değilse, hiçbir şey yapma
    if (!isNavigationReady) return;

    if (user) {
      // setTimeout kullanarak navigasyonu bir sonraki döngüye ertele
      const timer = setTimeout(() => {
        router.replace('/(tabs)');
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [user, router, isNavigationReady]);

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