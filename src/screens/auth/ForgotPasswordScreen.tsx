import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { TextInput, Button, Text, Title, Paragraph, Snackbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../types';
import { commonStyles } from '../../styles/theme';

type ForgotPasswordScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('E-posta adresi gerekli');
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Geçerli bir e-posta adresi girin');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleResetPassword = async () => {
    const isEmailValid = validateEmail(email);

    if (isEmailValid) {
      setIsLoading(true);
      
      // Burada normalde API çağrısı yapılır
      // Şimdilik simüle ediyoruz
      setTimeout(() => {
        setIsLoading(false);
        setSnackbarMessage('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.');
        setSnackbarVisible(true);
      }, 1500);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.logoContainer}>
        <Image 
          source={require('../../../assets/icon.png')} 
          style={styles.logo} 
          resizeMode="contain"
        />
        <Title style={styles.title}>Şifremi Unuttum</Title>
        <Paragraph style={styles.subtitle}>
          E-posta adresinizi girin, şifre sıfırlama bağlantısını göndereceğiz.
        </Paragraph>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          label="E-posta"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          error={!!emailError}
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        <Button 
          mode="contained" 
          onPress={handleResetPassword} 
          style={styles.button}
          loading={isLoading}
          disabled={isLoading}
        >
          Şifre Sıfırlama Bağlantısı Gönder
        </Button>
      </View>

      <View style={styles.loginContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}>Giriş ekranına dön</Text>
        </TouchableOpacity>
      </View>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={5000}
        action={{
          label: 'Tamam',
          onPress: () => {
            setSnackbarVisible(false);
            navigation.navigate('Login');
          },
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...commonStyles.container,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#1E293B',
  },
  button: {
    marginBottom: 16,
    paddingVertical: 8,
    backgroundColor: '#4CAF50',
  },
  errorText: {
    color: '#EF4444',
    marginBottom: 8,
    fontSize: 14,
  },
  loginContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  loginLink: {
    color: '#4CAF50',
    fontSize: 16,
  },
});

export default ForgotPasswordScreen;
