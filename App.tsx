import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState, useEffect, createContext, useContext } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button, Card, IconButton, Provider as PaperProvider, Paragraph, Title } from 'react-native-paper';
import theme from './src/styles/theme';

// Ekran tipleri
type ScreenType = 
  | 'Home' 
  | 'Login' 
  | 'Register' 
  | 'ForgotPassword'
  | 'Lists' 
  | 'CreateList'
  | 'ListDetail'
  | 'AddWord'
  | 'Learn' 
  | 'Quiz'
  | 'Progress' 
  | 'Search'
  | 'Settings' 
  | 'Social'
  | 'Camera'
  | 'AIRecommendations';

// Navigasyon bağlamı
type NavigationContextType = {
  navigate: (screen: ScreenType, params?: any) => void;
  goBack: () => void;
  currentScreen: ScreenType;
  params: any;
};

const NavigationContext = createContext<NavigationContextType>({
  navigate: () => {},
  goBack: () => {},
  currentScreen: 'Home',
  params: null
});

// Navigasyon kancası
const useNavigation = () => useContext(NavigationContext);

// Ana ekran bileşeni
const HomeScreen = () => {
  const navigation = useNavigation();
  
  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.header}>
        <Title style={styles.title}>BuzzWords</Title>
        <Paragraph style={styles.subtitle}>
          Kişiselleştirilmiş Dil Öğrenme Uygulaması
        </Paragraph>
      </View>
      
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Hoş Geldiniz</Title>
          <Paragraph style={styles.cardText}>
            BuzzWords, kişiselleştirilmiş bir dil öğrenme uygulamasıdır. 
            Tüketilen içeriklerden kelime listeleri oluşturmanıza, 
            etkileşimli alıştırmalarla öğrenmenize ve ilerlemenizi takip etmenize olanak tanır.
          </Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button 
            mode="contained" 
            style={styles.button}
            onPress={() => navigation.navigate('Lists')}
          >
            Başla
          </Button>
        </Card.Actions>
      </Card>
      
      <View style={styles.quickAccessContainer}>
        <TouchableOpacity 
          style={styles.quickAccessItem}
          onPress={() => navigation.navigate('Lists')}
        >
          <MaterialCommunityIcons name="format-list-bulleted" size={32} color="#4CAF50" />
          <Text style={styles.quickAccessText}>Listelerim</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickAccessItem}
          onPress={() => navigation.navigate('Learn')}
        >
          <MaterialCommunityIcons name="book-open-variant" size={32} color="#4CAF50" />
          <Text style={styles.quickAccessText}>Öğren</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickAccessItem}
          onPress={() => navigation.navigate('Progress')}
        >
          <MaterialCommunityIcons name="chart-line" size={32} color="#4CAF50" />
          <Text style={styles.quickAccessText}>İlerleme</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickAccessItem}
          onPress={() => navigation.navigate('Settings')}
        >
          <MaterialCommunityIcons name="cog" size={32} color="#4CAF50" />
          <Text style={styles.quickAccessText}>Ayarlar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickAccessItem}
          onPress={() => navigation.navigate('AIRecommendations')}
        >
          <MaterialCommunityIcons name="brain" size={32} color="#4CAF50" />
          <Text style={styles.quickAccessText}>AI Öneriler</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickAccessItem}
          onPress={() => navigation.navigate('Search')}
        >
          <MaterialCommunityIcons name="magnify" size={32} color="#4CAF50" />
          <Text style={styles.quickAccessText}>Arama</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// AI Önerileri ekranı
const AIRecommendationsScreen = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([
    { word: 'innovation', meaning: 'yenilik', similarity: 0.92 },
    { word: 'technology', meaning: 'teknoloji', similarity: 0.89 },
    { word: 'development', meaning: 'gelişim', similarity: 0.85 },
    { word: 'artificial', meaning: 'yapay', similarity: 0.82 },
    { word: 'intelligence', meaning: 'zeka', similarity: 0.80 },
  ]);

  // Yapay zeka ile kelime önerisi alma simülasyonu
  const getRecommendations = () => {
    setIsLoading(true);
    // Gerçek uygulamada burada TensorFlow.js veya Google Cloud NLP API çağrısı yapılır
    setTimeout(() => {
      setIsLoading(false);
      // Yeni öneriler eklenebilir
      setRecommendations([
        { word: 'algorithm', meaning: 'algoritma', similarity: 0.95 },
        { word: 'machine', meaning: 'makine', similarity: 0.91 },
        { word: 'learning', meaning: 'öğrenme', similarity: 0.88 },
        { word: 'neural', meaning: 'sinirsel', similarity: 0.84 },
        { word: 'network', meaning: 'ağ', similarity: 0.81 },
      ]);
    }, 2000);
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.screenHeader}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Title style={styles.screenTitle}>AI Kelime Önerileri</Title>
      </View>
      
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Yapay Zeka Destekli Öneriler</Title>
          <Paragraph style={styles.cardText}>
            Öğrenme geçmişinize ve içeriklerinize göre size özel kelime önerileri.
            TensorFlow.js ve doğal dil işleme teknolojileri kullanılarak oluşturulur.
          </Paragraph>
          <Button 
            mode="contained" 
            style={styles.button}
            loading={isLoading}
            onPress={getRecommendations}
            icon="brain"
          >
            Yeni Öneriler Al
          </Button>
        </Card.Content>
      </Card>

      {recommendations.map((item, index) => (
        <Card key={index} style={styles.recommendationCard}>
          <Card.Content>
            <View style={styles.recommendationHeader}>
              <Title style={styles.recommendationWord}>{item.word}</Title>
              <Text style={styles.similarityText}>{Math.round(item.similarity * 100)}% eşleşme</Text>
            </View>
            <Paragraph style={styles.recommendationMeaning}>{item.meaning}</Paragraph>
          </Card.Content>
          <Card.Actions>
            <Button 
              mode="text" 
              icon="plus"
              onPress={() => navigation.navigate('AddWord', { word: item.word, meaning: item.meaning })}
            >
              Listeye Ekle
            </Button>
          </Card.Actions>
        </Card>
      ))}
    </ScrollView>
  );
};

// Basit ekran bileşeni
const SimpleScreen = ({ title, description }: { title: string, description: string }) => {
  const navigation = useNavigation();
  
  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.screenHeader}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Title style={styles.screenTitle}>{title}</Title>
      </View>
      
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>{title}</Title>
          <Paragraph style={styles.cardText}>
            {description}
          </Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button 
            mode="contained" 
            style={styles.button}
            onPress={() => navigation.goBack()}
          >
            Geri Dön
          </Button>
        </Card.Actions>
      </Card>
    </ScrollView>
  );
};

// Kimlik doğrulama bağlamı
type AuthContextType = {
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {}
});

// Kimlik doğrulama kancası
const useAuth = () => useContext(AuthContext);

// Giriş ekranı
const LoginScreen = () => {
  const navigation = useNavigation();
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = () => {
    // Basit doğrulama
    if (!email || !password) {
      setError('Lütfen e-posta ve şifrenizi girin.');
      return;
    }

    setIsLoading(true);
    setError('');

    // Gerçek uygulamada burada API çağrısı yapılır
    setTimeout(() => {
      setIsLoading(false);
      // Başarılı giriş simülasyonu
      auth.login(email, password);
      navigation.navigate('Home');
    }, 1500);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.logoContainer}>
        <Title style={styles.appTitle}>BuzzWords</Title>
        <Paragraph style={styles.appSubtitle}>Kişiselleştirilmiş Dil Öğrenme</Paragraph>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Giriş Yap</Title>
          
          {error ? <Paragraph style={styles.errorText}>{error}</Paragraph> : null}
          
          <TextInput
            label="E-posta"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <TextInput
            label="Şifre"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            style={styles.input}
            secureTextEntry
          />
          
          <Button 
            mode="contained" 
            onPress={handleLogin} 
            style={styles.button}
            loading={isLoading}
            disabled={isLoading}
          >
            Giriş Yap
          </Button>
          
          <TouchableOpacity 
            style={styles.textLink}
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            <Text style={styles.linkText}>Şifremi Unuttum</Text>
          </TouchableOpacity>
        </Card.Content>
      </Card>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>Hesabınız yok mu?</Text>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Register')}
          style={styles.registerLink}
        >
          <Text style={styles.registerLinkText}>Kayıt Ol</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Ana uygulama bileşeni
function App(): JSX.Element {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('Home');
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Geliştirme için true
  const [screenParams, setScreenParams] = useState<any>(null);
  const [screenHistory, setScreenHistory] = useState<ScreenType[]>(['Home']);

  // Navigasyon fonksiyonları
  const navigate = (screen: ScreenType, params?: any) => {
    console.log(`Navigating to: ${screen}`, params);
    setCurrentScreen(screen);
    setScreenHistory(prev => [...prev, screen]);
    if (params) {
      setScreenParams(params);
    } else {
      setScreenParams(null);
    }
  };

  const goBack = () => {
    if (screenHistory.length > 1) {
      const newHistory = [...screenHistory];
      newHistory.pop(); // Son ekranı kaldır
      const previousScreen = newHistory[newHistory.length - 1];
      setCurrentScreen(previousScreen);
      setScreenHistory(newHistory);
    } else {
      // Eğer geçmiş yoksa ana ekrana dön
      setCurrentScreen('Home');
    }
  };

  // Kimlik doğrulama fonksiyonları
  const login = (email: string, password: string) => {
    console.log(`Login with: ${email}`);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentScreen('Login');
    setScreenHistory(['Login']);
  };

  // Navigasyon bağlamı değeri
  const navigationContextValue = {
    navigate,
    goBack,
    currentScreen,
    params: screenParams
  };

  // Kimlik doğrulama bağlamı değeri
  const authContextValue = {
    isAuthenticated,
    login,
    logout
  };

  // Geçerli ekranı göster
  const renderScreen = () => {
    // Kimlik doğrulama kontrolü
    if (!isAuthenticated && 
        currentScreen !== 'Login' && 
        currentScreen !== 'Register' && 
        currentScreen !== 'ForgotPassword') {
      return <LoginScreen />;
    }

    switch (currentScreen) {
      case 'Login':
        return <LoginScreen />;
      case 'Register':
        return <SimpleScreen title="Kayıt Ol" description="Kayıt ekranı burada olacak." />;
      case 'ForgotPassword':
        return <SimpleScreen title="Şifremi Unuttum" description="Şifre sıfırlama ekranı burada olacak." />;
      case 'Lists':
        return <SimpleScreen title="Kelime Listeleri" description="Kelime listeleri ekranı burada olacak." />;
      case 'CreateList':
        return <SimpleScreen title="Liste Oluştur" description="Liste oluşturma ekranı burada olacak." />;
      case 'ListDetail':
        return <SimpleScreen title="Liste Detayı" description={`Liste detayı ekranı burada olacak. ${screenParams ? JSON.stringify(screenParams) : ''}`} />;
      case 'AddWord':
        return <SimpleScreen title="Kelime Ekle" description={`Kelime ekleme ekranı burada olacak. ${screenParams ? JSON.stringify(screenParams) : ''}`} />;
      case 'Learn':
        return <SimpleScreen title="Öğrenme Modu" description="Öğrenme modu ekranı burada olacak." />;
      case 'Quiz':
        return <SimpleScreen title="Sınav Modu" description={`Sınav modu ekranı burada olacak. ${screenParams ? JSON.stringify(screenParams) : ''}`} />;
      case 'Progress':
        return <SimpleScreen title="İlerleme Takibi" description="İlerleme takibi ekranı burada olacak." />;
      case 'Search':
        return <SimpleScreen title="Arama" description="Arama ekranı burada olacak." />;
      case 'Settings':
        return <SimpleScreen title="Ayarlar" description="Ayarlar ekranı burada olacak." />;
      case 'Social':
        return <SimpleScreen title="Sosyal" description="Sosyal ekranı burada olacak." />;
      case 'Camera':
        return <SimpleScreen title="Kamera" description="Kamera ekranı burada olacak." />;
      case 'AIRecommendations':
        return <AIRecommendationsScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      <NavigationContext.Provider value={navigationContextValue}>
        <PaperProvider theme={theme}>
          <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
            {renderScreen()}
          </SafeAreaView>
        </PaperProvider>
      </NavigationContext.Provider>
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  contentContainer: {
    padding: 16,
    flexGrow: 1,
    justifyContent: 'center',
  },
  scrollView: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
  },
  card: {
    marginBottom: 16,
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  cardText: {
    color: '#94A3B8',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#4CAF50',
  },
  quickAccessContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 24,
  },
  quickAccessItem: {
    width: '48%',
    backgroundColor: '#1E293B',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    borderColor: '#334155',
    borderWidth: 1,
  },
  quickAccessText: {
    color: '#FFFFFF',
    marginTop: 8,
    fontSize: 16,
  },
  screenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  screenTitle: {
    fontSize: 24,
    color: '#FFFFFF',
    flex: 1,
  },
  // AI Önerileri ekranı için stiller
  recommendationCard: {
    marginBottom: 12,
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    borderWidth: 1,
  },
  recommendationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recommendationWord: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  similarityText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: 'bold',
  },
  recommendationMeaning: {
    color: '#94A3B8',
    fontSize: 16,
  },
  // Giriş ekranı için stiller
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  appSubtitle: {
    fontSize: 16,
    color: '#94A3B8',
    marginTop: 8,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#334155',
  },
  textLink: {
    alignSelf: 'center',
    marginTop: 16,
  },
  linkText: {
    color: '#4CAF50',
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  footerText: {
    color: '#94A3B8',
    fontSize: 14,
  },
  registerLink: {
    marginLeft: 8,
  },
  registerLinkText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#EF4444',
    marginBottom: 16,
  },
});

export default App;
