import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Dimensions, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Card, Divider, Paragraph, Title } from 'react-native-paper';

type RootStackParamList = {
  Home: undefined;
  FeaturePlaceholder: { featureId: number; featureName: string; description: string };
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

// Özellik tanımlamaları
const features = [
  {
    id: 1,
    name: 'Kullanıcı Girişi',
    description: 'E-posta/şifre ve sosyal medya ile güvenli ve kullanıcı dostu giriş/kayıt sistemi.',
    expectedFunctionality: [
      'E-posta/şifre ile kullanıcı kaydı',
      'E-posta/şifre ile giriş',
      'Şifre kurtarma',
      'Kullanıcı profili görüntüleme ve yönetimi',
      'Oturum yönetimi',
      'Güvenli token saklama'
    ]
  },
  {
    id: 2,
    name: 'Kelime Listeleri',
    description: 'Kullanıcının oluşturduğu tüm kelime listelerini detayları ve yönetim seçenekleriyle görüntüleme.',
    expectedFunctionality: [
      'Tüm listeleri önizleme bilgileriyle gösterme',
      'Liste sıralama ve filtreleme seçenekleri',
      'Hızlı eylemler (öğrenme, test, detaylar)',
      'İlerleme göstergeleri',
      'Yenileme ve sayfalama'
    ]
  },
  {
    id: 3,
    name: 'Liste Oluştur',
    description: 'İsim, açıklama ve bağlam bilgileriyle yeni kelime listesi oluşturma.',
    expectedFunctionality: [
      'Doğrulama ile liste oluşturma formu',
      'İsteğe bağlı kaynak belirtme alanı',
      'Liste için dil seçimi',
      'Oluşturma sonrası kelime ekleme seçeneği',
      'Yaygın liste türleri için şablonlar'
    ]
  },
  {
    id: 4,
    name: 'Kelime Ekle',
    description: 'Mevcut listeye anlamları ve bağlam örnekleriyle yeni kelimeler ekleme.',
    expectedFunctionality: [
      'Otomatik tamamlama önerileriyle kelime ekleme formu',
      'API ile otomatik anlam getirme',
      'Toplu kelime ekleme özelliği',
      'Bağlam örneği alanı',
      'Resim/telaffuz ilişkilendirme (opsiyonel)'
    ]
  },
  {
    id: 5,
    name: 'Öğrenme Modu',
    description: 'Duolingo tarzı alıştırmalarla liste kelimelerini öğrenme deneyimi.',
    expectedFunctionality: [
      'Çoktan seçmeli alıştırmalar',
      'Oturum sırasında ilerleme takibi',
      'Motivasyon için seri sayacı',
      'Cevaplara geri bildirim',
      'Oturum devamı ve geçmişi',
      'Çeşitli alıştırma türleri'
    ]
  },
  {
    id: 6,
    name: 'Test Modu',
    description: 'Liste kelimelerini daha zorlu bir test formatıyla sınama.',
    expectedFunctionality: [
      'Öğrenme modundan daha zorlu sorular',
      'Puan takibi ve geçmişi',
      'Süre sınırı seçeneği',
      'Yanlış cevapları gözden geçirme',
      'Test sonuç özeti',
      'Sonuçları paylaşma özelliği'
    ]
  },
  {
    id: 7,
    name: 'Liste Detayları',
    description: 'Tüm kelimeleri ve yönetim seçenekleriyle kelime listesinin detaylı görünümü.',
    expectedFunctionality: [
      'Listedeki tüm kelimeleri anlamlarıyla gösterme',
      'Kelime düzenleme ve silme',
      'Liste bilgilerini düzenleme',
      'İlerleme istatistikleri',
      'Öğrenme/Test modu başlatma seçenekleri',
      'Kelime sıralama ve filtreleme'
    ]
  },
  {
    id: 8,
    name: 'İlerleme Takibi',
    description: 'Tüm listeler ve kelimeler için istatistikler ve görselleştirmelerle öğrenme ilerlemesini takip etme.',
    expectedFunctionality: [
      'Genel öğrenme istatistikleri',
      'Liste bazında ilerleme görünümü',
      'Kelime hakimiyet göstergeleri',
      'İlerleme geçmişi grafikleri',
      'Öğrenme serileri ve başarılar',
      'Önerilen tekrar kelimeleri'
    ]
  },
  {
    id: 9,
    name: 'Arama',
    description: 'Listeler ve kelimeler arasında filtreleme seçenekleriyle arama işlevi.',
    expectedFunctionality: [
      'Tüm içerikte genel arama',
      'Liste, tarih, ilerleme seviyesine göre filtreleme',
      'Son aramalar geçmişi',
      'Sesli arama özelliği',
      'Önerilen arama terimleri',
      'Arama sonuçlarından doğrudan eylemler'
    ]
  },
  {
    id: 10,
    name: 'Ayarlar',
    description: 'Öğrenme deneyimini özelleştirmek için uygulama ayarları ve tercihler.',
    expectedFunctionality: [
      'Tema ve görünüm ayarları',
      'Bildirim tercihleri',
      'Varsayılan liste seçenekleri',
      'Öğrenme oturumu yapılandırmaları',
      'Veri yönetimi (dışa/içe aktarma/temizleme)',
      'Hesap ayarları entegrasyonu'
    ]
  },
  {
    id: 11,
    name: 'Yenilikçi Özellik 1',
    description: 'Mobil özellikleri kullanan ve dil öğrenmeyi geliştiren ilk yenilikçi özelliğinizi tasarlayın.',
    expectedFunctionality: [
      'Temel uygulamada olmayan benzersiz değer önerisi',
      'Mobil özelliklerin kullanımı',
      'Mevcut özelliklerle entegrasyon',
      'Kullanıcı dostu deneyim',
      'Performans değerlendirmesi'
    ]
  },
  {
    id: 12,
    name: 'Yenilikçi Özellik 2',
    description: 'Mobil dil öğrenenler için benzersiz bir avantaj sunan ikinci yenilikçi özelliğinizi tasarlayın.',
    expectedFunctionality: [
      'Öğrenme etkinliğini artıran özgün fikir',
      'Mobil öncelikli tasarım yaklaşımı',
      'Uygulama iş akışıyla entegrasyon',
      'Erişilebilir ve sezgisel arayüz',
      'Kaynak verimli uygulama'
    ]
  }
];

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const navigateToFeature = (feature: typeof features[0]) => {
    navigation.navigate('FeaturePlaceholder', {
      featureId: feature.id,
      featureName: feature.name,
      description: feature.description
    });
  };

  // Yeni eklenen ekranlar için navigasyon fonksiyonları
  const navigateToLists = () => {
    navigation.navigate('FeaturePlaceholder', {
      featureId: 4,
      featureName: 'Kelime Listeleri',
      description: 'Tüm kelime listelerinizi görüntüleyin ve yönetin.'
    });
  };

  const navigateToLearn = () => {
    navigation.navigate('FeaturePlaceholder', {
      featureId: 7,
      featureName: 'Öğrenme Modu',
      description: 'Kelimelerinizi interaktif alıştırmalarla öğrenin.'
    });
  };

  const navigateToProgress = () => {
    navigation.navigate('FeaturePlaceholder', {
      featureId: 8,
      featureName: 'İlerleme Takibi',
      description: 'Öğrenme ilerlemenizi takip edin.'
    });
  };

  const navigateToSettings = () => {
    navigation.navigate('FeaturePlaceholder', {
      featureId: 10,
      featureName: 'Ayarlar',
      description: 'Uygulama ayarlarını özelleştirin.'
    });
  };

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Title style={styles.title}>WordPecker</Title>
          <Paragraph style={styles.subtitle}>
            Kişiselleştirilmiş Dil Öğrenme Uygulaması
          </Paragraph>
        </View>

        <View style={styles.grid}>
          {features.map((feature) => (
            <Card key={feature.id} style={styles.card}>
              <Card.Content>
                <Title style={styles.cardTitle}>{feature.name}</Title>
                <Paragraph style={styles.cardDescription} numberOfLines={2}>
                  {feature.description}
                </Paragraph>
              </Card.Content>
              <Card.Actions>
                <Button
                  mode="contained"
                  onPress={() => navigateToFeature(feature)}
                  style={styles.button}
                >
                  İncele
                </Button>
              </Card.Actions>
            </Card>
          ))}
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollViewContent}
      showsVerticalScrollIndicator={true}
    >
      <View style={styles.header}>
        <Title style={styles.title}>WordPecker</Title>
        <Paragraph style={styles.subtitle}>
          Kişiselleştirilmiş Dil Öğrenme Uygulaması
        </Paragraph>
      </View>

      {/* Hızlı Erişim Kartları */}
      <View style={styles.quickAccessContainer}>
        <Card style={styles.quickAccessCard} onPress={navigateToLists}>
          <Card.Content style={styles.quickAccessContent}>
            <Text style={styles.quickAccessText}>Listelerim</Text>
          </Card.Content>
        </Card>

        <Card style={styles.quickAccessCard} onPress={navigateToLearn}>
          <Card.Content style={styles.quickAccessContent}>
            <Text style={styles.quickAccessText}>Öğren</Text>
          </Card.Content>
        </Card>

        <Card style={styles.quickAccessCard} onPress={navigateToProgress}>
          <Card.Content style={styles.quickAccessContent}>
            <Text style={styles.quickAccessText}>İlerleme</Text>
          </Card.Content>
        </Card>

        <Card style={styles.quickAccessCard} onPress={navigateToSettings}>
          <Card.Content style={styles.quickAccessContent}>
            <Text style={styles.quickAccessText}>Ayarlar</Text>
          </Card.Content>
        </Card>
      </View>

      <Divider style={styles.divider} />

      <Title style={styles.sectionTitle}>Tüm Özellikler</Title>

      <View style={styles.grid}>
        {features.map((feature) => (
          <Card key={feature.id} style={styles.card}>
            <Card.Content>
              <Title style={styles.cardTitle}>{feature.name}</Title>
              <Paragraph style={styles.cardDescription} numberOfLines={2}>
                {feature.description}
              </Paragraph>
            </Card.Content>
            <Card.Actions>
              <Button
                mode="contained"
                onPress={() => navigateToFeature(feature)}
                style={styles.button}
              >
                İncele
              </Button>
            </Card.Actions>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: Platform.select({
    web: {
      height: Dimensions.get('window').height,
      overflow: 'scroll',
      padding: 16,
      backgroundColor: '#0F172A',
    },
    default: {
      flex: 1,
      padding: 16,
      backgroundColor: '#0F172A',
    },
  }),
  scrollViewContent: {
    ...(Platform.OS === 'web' ? {
      minHeight: '100%',
    } : {
      flexGrow: 1,
    }),
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
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
  },
  instructions: {
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 24,
    color: '#94A3B8',
  },
  quickAccessContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  quickAccessCard: {
    width: '48%',
    marginBottom: 16,
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    borderWidth: 1,
  },
  quickAccessContent: {
    alignItems: 'center',
    padding: 16,
  },
  quickAccessText: {
    color: '#FFFFFF',
    marginTop: 8,
    fontSize: 16,
  },
  divider: {
    backgroundColor: '#334155',
    height: 1,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 20,
    ...(Platform.OS === 'web' ? {
      maxWidth: 1200,
      marginHorizontal: 'auto',
    } : {}),
  },
  card: {
    width: Platform.OS === 'web' ? '31%' : '48%',
    marginBottom: 16,
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    borderWidth: 1,
    ...(Platform.OS === 'web' ? {
      minWidth: 280,
    } : {}),
  },
  cardTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  cardDescription: {
    color: '#94A3B8', // slate.400
    fontSize: 14,
  },
  button: {
    backgroundColor: '#4CAF50', // Green
  }
});

export default HomeScreen;
