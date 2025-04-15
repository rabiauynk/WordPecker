import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, LogIn } from 'lucide-react-native';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { colors } from '../../constants/colors';
import { useSettingsStore } from '../../store/settingsStore';
import { useAuthStore } from '../../store/authStore';

export default function LoginScreen() {
  const router = useRouter();
  const { theme } = useSettingsStore();
  const { login, loginWithProvider, isLoading, error } = useAuthStore();
  const themeColors = colors[theme === 'dark' ? 'dark' : 'light'];
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleLogin = async () => {
    // Simple validation
    if (!email.trim() || !password.trim()) {
      setValidationError('Email and password are required');
      return;
    }
    
    if (!email.includes('@')) {
      setValidationError('Please enter a valid email address');
      return;
    }
    
    setValidationError('');
    await login(email, password);
    
    // If login is successful, the auth store will update the user state
    // and the useEffect in the welcome screen will redirect to the main app
  };

  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    await loginWithProvider(provider);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: themeColors.text }]}>Welcome Back</Text>
        <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
          Log in to continue your language learning journey
        </Text>
        
        {(error || validationError) && (
          <View style={[styles.errorContainer, { backgroundColor: themeColors.error + '20' }]}>
            <Text style={[styles.errorText, { color: themeColors.error }]}>
              {validationError || error}
            </Text>
          </View>
        )}
        
        <View style={styles.form}>
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Mail size={20} color={themeColors.textSecondary} />}
          />
          
          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            leftIcon={<Lock size={20} color={themeColors.textSecondary} />}
          />
          
          <TouchableOpacity 
            onPress={() => router.push('/forgot-password')}
            style={styles.forgotPassword}
          >
            <Text style={[styles.forgotPasswordText, { color: themeColors.primary }]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
          
          <Button
            title="Log In"
            onPress={handleLogin}
            isLoading={isLoading}
            style={styles.loginButton}
            leftIcon={<LogIn size={20} color="#FFFFFF" />}
          />
        </View>
        
        <View style={styles.divider}>
          <View style={[styles.dividerLine, { backgroundColor: themeColors.border }]} />
          <Text style={[styles.dividerText, { color: themeColors.textSecondary }]}>OR</Text>
          <View style={[styles.dividerLine, { backgroundColor: themeColors.border }]} />
        </View>
        
        <View style={styles.socialButtons}>
          <Button
            title="Continue with Google"
            onPress={() => handleSocialLogin('google')}
            variant="outline"
            style={styles.socialButton}
          />
          
          {Platform.OS === 'ios' && (
            <Button
              title="Continue with Apple"
              onPress={() => handleSocialLogin('apple')}
              variant="outline"
              style={styles.socialButton}
            />
          )}
        </View>
      </View>
      
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: themeColors.textSecondary }]}>
          Don't have an account?
        </Text>
        <TouchableOpacity onPress={() => router.push('/register')}>
          <Text style={[styles.footerLink, { color: themeColors.primary }]}>
            Create Account
          </Text>
        </TouchableOpacity>
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
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
  },
  errorContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
  },
  form: {
    marginBottom: 24,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
  },
  loginButton: {
    marginTop: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 14,
  },
  socialButtons: {
    gap: 16,
  },
  socialButton: {
    width: '100%',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 24,
    gap: 4,
  },
  footerText: {
    fontSize: 14,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});