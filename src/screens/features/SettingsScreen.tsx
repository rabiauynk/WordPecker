import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Switch, Linking } from 'react-native';
import { Card, Title, Paragraph, Text, Divider, List, Button, Avatar, Dialog, Portal, TextInput } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { commonStyles } from '../../styles/theme';

const SettingsScreen = () => {
  const { authState, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [dailyReminder, setDailyReminder] = useState(true);
  const [reminderTime, setReminderTime] = useState('20:00');
  const [dailyGoal, setDailyGoal] = useState('20');
  const [language, setLanguage] = useState('Türkçe');
  const [showLanguageDialog, setShowLanguageDialog] = useState(false);
  const [showGoalDialog, setShowGoalDialog] = useState(false);
  const [tempDailyGoal, setTempDailyGoal] = useState('20');

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Hesabınızdan çıkış yapmak istediğinizden emin misiniz?',
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Çıkış Yap',
          onPress: () => logout(),
          style: 'destructive',
        },
      ],
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Hesabı Sil',
      'Hesabınızı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz ve tüm verileriniz silinecektir.',
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Hesabı Sil',
          onPress: () => {
            // Hesap silme işlemi
            Alert.alert('Hesap Silindi', 'Hesabınız başarıyla silindi.');
            logout();
          },
          style: 'destructive',
        },
      ],
    );
  };

  const handleSaveDailyGoal = () => {
    const goal = parseInt(tempDailyGoal);
    if (isNaN(goal) || goal < 1) {
      Alert.alert('Hata', 'Lütfen geçerli bir sayı girin.');
      return;
    }
    setDailyGoal(tempDailyGoal);
    setShowGoalDialog(false);
  };

  const languages = [
    { code: 'tr', name: 'Türkçe' },
    { code: 'en', name: 'English' },
    { code: 'de', name: 'Deutsch' },
    { code: 'fr', name: 'Français' },
    { code: 'es', name: 'Español' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Profil Kartı */}
      <Card style={styles.profileCard}>
        <Card.Content style={styles.profileCardContent}>
          <Avatar.Image 
            source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }} 
            size={80} 
          />
          <View style={styles.profileInfo}>
            <Title style={styles.profileName}>{authState.user?.name || 'Kullanıcı'}</Title>
            <Paragraph style={styles.profileEmail}>{authState.user?.email || 'kullanici@example.com'}</Paragraph>
            <Button 
              mode="outlined" 
              onPress={() => {/* Profil düzenleme ekranına git */}}
              style={styles.editProfileButton}
              icon="account-edit"
            >
              Profili Düzenle
            </Button>
          </View>
        </Card.Content>
      </Card>

      {/* Uygulama Ayarları */}
      <Card style={styles.settingsCard}>
        <Card.Content>
          <Title style={styles.settingsTitle}>Uygulama Ayarları</Title>
          
          <List.Item
            title="Karanlık Mod"
            description="Uygulamanın görünümünü değiştir"
            left={props => <List.Icon {...props} icon="theme-light-dark" />}
            right={props => (
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                color="#4CAF50"
              />
            )}
          />
          
          <Divider style={styles.divider} />
          
          <List.Item
            title="Bildirimler"
            description="Uygulama bildirimlerini aç/kapat"
            left={props => <List.Icon {...props} icon="bell" />}
            right={props => (
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                color="#4CAF50"
              />
            )}
          />
          
          <Divider style={styles.divider} />
          
          <List.Item
            title="Günlük Hatırlatıcı"
            description={`Günlük çalışma hatırlatıcısı (${reminderTime})`}
            left={props => <List.Icon {...props} icon="clock" />}
            right={props => (
              <Switch
                value={dailyReminder}
                onValueChange={setDailyReminder}
                color="#4CAF50"
                disabled={!notifications}
              />
            )}
          />
          
          <Divider style={styles.divider} />
          
          <List.Item
            title="Günlük Hedef"
            description={`Günde ${dailyGoal} kelime öğrenme hedefi`}
            left={props => <List.Icon {...props} icon="target" />}
            onPress={() => {
              setTempDailyGoal(dailyGoal);
              setShowGoalDialog(true);
            }}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
          
          <Divider style={styles.divider} />
          
          <List.Item
            title="Uygulama Dili"
            description={language}
            left={props => <List.Icon {...props} icon="translate" />}
            onPress={() => setShowLanguageDialog(true)}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
        </Card.Content>
      </Card>

      {/* Veri ve Gizlilik */}
      <Card style={styles.settingsCard}>
        <Card.Content>
          <Title style={styles.settingsTitle}>Veri ve Gizlilik</Title>
          
          <List.Item
            title="Verileri Dışa Aktar"
            description="Kelime listelerinizi ve ilerlemenizi dışa aktarın"
            left={props => <List.Icon {...props} icon="export" />}
            onPress={() => {
              // Veri dışa aktarma işlemi
              Alert.alert('Bilgi', 'Verileriniz dışa aktarılıyor...');
            }}
          />
          
          <Divider style={styles.divider} />
          
          <List.Item
            title="Verileri İçe Aktar"
            description="Önceden dışa aktarılmış verilerinizi içe aktarın"
            left={props => <List.Icon {...props} icon="import" />}
            onPress={() => {
              // Veri içe aktarma işlemi
              Alert.alert('Bilgi', 'Verileriniz içe aktarılıyor...');
            }}
          />
          
          <Divider style={styles.divider} />
          
          <List.Item
            title="Önbelleği Temizle"
            description="Uygulama önbelleğini temizleyin"
            left={props => <List.Icon {...props} icon="cached" />}
            onPress={() => {
              // Önbellek temizleme işlemi
              Alert.alert('Başarılı', 'Önbellek temizlendi.');
            }}
          />
        </Card.Content>
      </Card>

      {/* Hesap Yönetimi */}
      <Card style={styles.settingsCard}>
        <Card.Content>
          <Title style={styles.settingsTitle}>Hesap Yönetimi</Title>
          
          <List.Item
            title="Şifre Değiştir"
            description="Hesap şifrenizi değiştirin"
            left={props => <List.Icon {...props} icon="lock-reset" />}
            onPress={() => {
              // Şifre değiştirme ekranına git
            }}
          />
          
          <Divider style={styles.divider} />
          
          <List.Item
            title="Çıkış Yap"
            description="Hesabınızdan güvenli çıkış yapın"
            left={props => <List.Icon {...props} icon="logout" color="#FF9800" />}
            onPress={handleLogout}
          />
          
          <Divider style={styles.divider} />
          
          <List.Item
            title="Hesabı Sil"
            description="Hesabınızı ve tüm verilerinizi kalıcı olarak silin"
            left={props => <List.Icon {...props} icon="delete" color="#EF4444" />}
            onPress={handleDeleteAccount}
            titleStyle={{ color: '#EF4444' }}
          />
        </Card.Content>
      </Card>

      {/* Hakkında */}
      <Card style={styles.settingsCard}>
        <Card.Content>
          <Title style={styles.settingsTitle}>Hakkında</Title>
          
          <List.Item
            title="Uygulama Versiyonu"
            description="1.0.0"
            left={props => <List.Icon {...props} icon="information" />}
          />
          
          <Divider style={styles.divider} />
          
          <List.Item
            title="Gizlilik Politikası"
            left={props => <List.Icon {...props} icon="shield-account" />}
            onPress={() => {
              Linking.openURL('https://wordpecker.com/privacy');
            }}
          />
          
          <Divider style={styles.divider} />
          
          <List.Item
            title="Kullanım Koşulları"
            left={props => <List.Icon {...props} icon="file-document" />}
            onPress={() => {
              Linking.openURL('https://wordpecker.com/terms');
            }}
          />
          
          <Divider style={styles.divider} />
          
          <List.Item
            title="Geri Bildirim Gönder"
            left={props => <List.Icon {...props} icon="message-text" />}
            onPress={() => {
              Linking.openURL('mailto:feedback@wordpecker.com');
            }}
          />
        </Card.Content>
      </Card>

      {/* Dil Seçimi Dialog */}
      <Portal>
        <Dialog visible={showLanguageDialog} onDismiss={() => setShowLanguageDialog(false)}>
          <Dialog.Title>Uygulama Dili</Dialog.Title>
          <Dialog.Content>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageOption,
                  language === lang.name && styles.selectedLanguageOption,
                ]}
                onPress={() => {
                  setLanguage(lang.name);
                  setShowLanguageDialog(false);
                }}
              >
                <Text style={[
                  styles.languageText,
                  language === lang.name && styles.selectedLanguageText,
                ]}>
                  {lang.name}
                </Text>
                {language === lang.name && (
                  <MaterialCommunityIcons name="check" size={20} color="#4CAF50" />
                )}
              </TouchableOpacity>
            ))}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowLanguageDialog(false)}>İptal</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Günlük Hedef Dialog */}
      <Portal>
        <Dialog visible={showGoalDialog} onDismiss={() => setShowGoalDialog(false)}>
          <Dialog.Title>Günlük Hedef</Dialog.Title>
          <Dialog.Content>
            <Paragraph style={styles.dialogText}>
              Her gün kaç kelime öğrenmek istiyorsunuz?
            </Paragraph>
            <TextInput
              label="Günlük Hedef"
              value={tempDailyGoal}
              onChangeText={setTempDailyGoal}
              keyboardType="number-pad"
              mode="outlined"
              style={styles.dialogInput}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowGoalDialog(false)}>İptal</Button>
            <Button onPress={handleSaveDailyGoal}>Kaydet</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...commonStyles.container,
    padding: 0,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  profileCard: {
    marginBottom: 16,
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    borderWidth: 1,
  },
  profileCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  profileEmail: {
    color: '#94A3B8',
    marginBottom: 8,
  },
  editProfileButton: {
    borderColor: '#4CAF50',
  },
  settingsCard: {
    marginBottom: 16,
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    borderWidth: 1,
  },
  settingsTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  divider: {
    backgroundColor: '#334155',
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  selectedLanguageOption: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  languageText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  selectedLanguageText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  dialogText: {
    color: '#FFFFFF',
    marginBottom: 16,
  },
  dialogInput: {
    backgroundColor: '#1E293B',
  },
});

export default SettingsScreen;
