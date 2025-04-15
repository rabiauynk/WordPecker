import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, ArrowLeft } from 'lucide-react-native';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { colors } from '../../constants/colors';
import { useSettingsStore } from '../../store/settingsStore';
import { useAuthStore } from '../../store/authStore';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { theme } = useSettingsStore();
  const { resetPassword, isLoading, error } = useAuthStore();
  const themeColors = colors[theme === 'dark' ? 'dark' : 'light'];
  
  const [email, setEmail] = useState('');
  const [validationError, setValidationError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleResetPassword = async () => {
    // Simple validation
    if (!email.trim()) {
      setValidationError('Email is required');
      return;
    }
    
    if (!email.includes('@')) {
      setValidationError('Please enter a valid email address');
      return;
    }
    
    setValidationError('');
    await resetPassword(email);
    setIsSubmitted(true);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => router.back()}
      >
        <ArrowLeft size={24} color={themeColors.text} />
      </TouchableOpacity>
      
      <View style={styles.content}>
        {!isSubmitted ? (
          <>
            <Text style={[styles.title, { color: themeColors.text }]}>Reset Password</Text>
            <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
              Enter your email address and we'll send you instructions to reset your password
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
              
              <Button
                title="Send Reset Link"
                onPress={handleResetPassword}
                isLoading={isLoading}
                style={styles.resetButton}
              />
            </View>
          </>
        ) : (
          <View style={styles.successContainer}>
            <Text style={[styles.title, { color: themeColors.text }]}>Check Your Email</Text>
            <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
              We've sent password reset instructions to {email}
            </Text>
            
            <Button
              title="Back to Login"
              onPress={() => router.push('/login')}
              style={styles.backToLoginButton}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    padding: 16,
  },
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 0,
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
  resetButton: {
    marginTop: 16,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backToLoginButton: {
    marginTop: 32,
    minWidth: 200,
  },
});
