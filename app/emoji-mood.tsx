import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Smile, Check, RefreshCw } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useSettingsStore } from '@/store/settingsStore';
import { WordCard } from '@/components/WordCard';
import { Button } from '@/components/Button';
import { Word } from '@/types/wordList';

// Türkçe emoji duygu durumları ve ilgili kelimeler
const emojiMoods = [
  { emoji: '😊', mood: 'Mutlu', words: [
    { id: 'h1', term: 'neşeli', definition: 'sevinç dolu, keyifli', example: 'Bugün çok neşeli görünüyorsun.', masteryLevel: 0, createdAt: new Date().toISOString() },
    { id: 'h2', term: 'keyifli', definition: 'hoşnut, memnun', example: 'Keyifli bir hafta sonu geçirdik.', masteryLevel: 0, createdAt: new Date().toISOString() },
    { id: 'h3', term: 'sevinçli', definition: 'mutluluk duyan', example: 'Sınavı kazandığı için çok sevinçliydi.', masteryLevel: 0, createdAt: new Date().toISOString() },
  ]},
  { emoji: '😢', mood: 'Üzgün', words: [
    { id: 's1', term: 'hüzünlü', definition: 'üzüntü veren, kederli', example: 'Hüzünlü bir film izledik.', masteryLevel: 0, createdAt: new Date().toISOString() },
    { id: 's2', term: 'kederli', definition: 'üzüntülü, tasalı', example: 'Haberi duyunca kederli bir hal aldı.', masteryLevel: 0, createdAt: new Date().toISOString() },
    { id: 's3', term: 'mahzun', definition: 'üzgün, kederli', example: 'Mahzun bir şekilde pencereden dışarı bakıyordu.', masteryLevel: 0, createdAt: new Date().toISOString() },
  ]},
  { emoji: '😡', mood: 'Kızgın', words: [
    { id: 'a1', term: 'öfkeli', definition: 'çok kızgın', example: 'Öfkeli bir şekilde odadan çıktı.', masteryLevel: 0, createdAt: new Date().toISOString() },
    { id: 'a2', term: 'sinirli', definition: 'öfkeli, kızgın', example: 'Bu sabah çok sinirli uyandı.', masteryLevel: 0, createdAt: new Date().toISOString() },
    { id: 'a3', term: 'hiddetli', definition: 'çok öfkeli', example: 'Hiddetli bir tonla konuşuyordu.', masteryLevel: 0, createdAt: new Date().toISOString() },
  ]},
  { emoji: '😴', mood: 'Yorgun', words: [
    { id: 't1', term: 'bitkin', definition: 'çok yorgun', example: 'İşten bitkin bir halde döndü.', masteryLevel: 0, createdAt: new Date().toISOString() },
    { id: 't2', term: 'halsiz', definition: 'güçsüz, yorgun', example: 'Hasta olduğu için halsiz hissediyordu.', masteryLevel: 0, createdAt: new Date().toISOString() },
    { id: 't3', term: 'tükenmiş', definition: 'enerjisi bitmiş', example: 'Uzun yürüyüşten sonra tükenmiş haldeydi.', masteryLevel: 0, createdAt: new Date().toISOString() },
  ]},
  { emoji: '😮', mood: 'Şaşkın', words: [
    { id: 'su1', term: 'hayret', definition: 'şaşkınlık', example: 'Hayret içinde haberi dinledi.', masteryLevel: 0, createdAt: new Date().toISOString() },
    { id: 'su2', term: 'afallama', definition: 'beklenmedik durum karşısında şaşırma', example: 'Haberi duyunca afallayıp kaldı.', masteryLevel: 0, createdAt: new Date().toISOString() },
    { id: 'su3', term: 'şaşkın', definition: 'ne yapacağını bilemez durumda', example: 'Şaşkın bir ifadeyle etrafına bakındı.', masteryLevel: 0, createdAt: new Date().toISOString() },
  ]},
  { emoji: '😨', mood: 'Korkmuş', words: [
    { id: 'sc1', term: 'ürkmüş', definition: 'korkmuş, tedirgin', example: 'Sesten ürkmüş bir halde yerinden sıçradı.', masteryLevel: 0, createdAt: new Date().toISOString() },
    { id: 'sc2', term: 'tedirgin', definition: 'huzursuz, kaygılı', example: 'Son olaylardan dolayı çok tedirgin.', masteryLevel: 0, createdAt: new Date().toISOString() },
    { id: 'sc3', term: 'endişeli', definition: 'kaygılı, tasalı', example: 'Endişeli gözlerle saate bakıyordu.', masteryLevel: 0, createdAt: new Date().toISOString() },
  ]},
];

export default function EmojiMoodScreen() {
  const router = useRouter();
  const { theme } = useSettingsStore();
  const themeColors = colors[theme === 'dark' ? 'dark' : 'light'];
  
  const [selectedMood, setSelectedMood] = useState<typeof emojiMoods[0] | null>(null);
  const [userSentence, setUserSentence] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [feedback, setFeedback] = useState('');
  
  const handleSelectMood = (mood: typeof emojiMoods[0]) => {
    setSelectedMood(mood);
    setIsSubmitted(false);
    setUserSentence('');
    setFeedback('');
  };
  
  const handleSubmitSentence = () => {
    if (!userSentence.trim()) {
      return;
    }
    
    const containsMoodWord = selectedMood?.words.some(word => 
      userSentence.toLowerCase().includes(word.term.toLowerCase())
    );
    
    if (containsMoodWord) {
      setFeedback('Harika! Duygu kelimelerinden birini doğru kullandın.');
    } else {
      setFeedback('Tekrar dene! Cümlende duygu kelimelerinden birini kullanmayı unutma.');
    }
    
    setIsSubmitted(true);
  };
  
  const handleTryAgain = () => {
    setIsSubmitted(false);
    setUserSentence('');
    setFeedback('');
  };
  
  const handleNewMood = () => {
    setSelectedMood(null);
    setIsSubmitted(false);
    setUserSentence('');
    setFeedback('');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]} edges={['bottom']}>
      <Stack.Screen options={{ title: 'Duygu Kelimeleri' }} />
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: themeColors.text }]}>Duygu Kelimeleri</Text>
          <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
            Farklı duygularla ilgili kelimeleri öğren
          </Text>
        </View>
        
        {!selectedMood ? (
          <>
            <Text style={[styles.instruction, { color: themeColors.text }]}>
              Kelimelerini görmek istediğin duyguyu seç:
            </Text>
            
            <View style={styles.emojiGrid}>
              {emojiMoods.map((mood, index) => (
                <TouchableOpacity 
                  key={index}
                  style={[styles.emojiCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}
                  onPress={() => handleSelectMood(mood)}
                >
                  <Text style={styles.emoji}>{mood.emoji}</Text>
                  <Text style={[styles.moodName, { color: themeColors.text }]}>{mood.mood}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : (
          <>
            <View style={[styles.selectedMoodCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
              <Text style={styles.selectedEmoji}>{selectedMood.emoji}</Text>
              <Text style={[styles.selectedMoodName, { color: themeColors.text }]}>{selectedMood.mood}</Text>
              <TouchableOpacity 
                style={[styles.changeMoodButton, { borderColor: themeColors.border }]}
                onPress={handleNewMood}
              >
                <Text style={[styles.changeMoodText, { color: themeColors.primary }]}>Duygu Değiştir</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.vocabularySection}>
              <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Kelimeler</Text>
              
              {selectedMood.words.map(word => (
                <WordCard
                  key={word.id}
                  word={word}
                  showActions={false}
                />
              ))}
            </View>
            
            <View style={styles.practiceSection}>
              <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Alıştırma</Text>
              <Text style={[styles.practiceInstruction, { color: themeColors.textSecondary }]}>
                Yukarıdaki kelimelerden birini kullanarak bir cümle yaz:
              </Text>
              
              <View style={[styles.inputContainer, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
                <TextInput
                  style={[styles.sentenceInput, { color: themeColors.text }]}
                  placeholder="Cümleni buraya yaz..."
                  placeholderTextColor={themeColors.textSecondary}
                  value={userSentence}
                  onChangeText={setUserSentence}
                  multiline
                  editable={!isSubmitted}
                />
              </View>
              
              {isSubmitted ? (
                <>
                  <View style={[
                    styles.feedbackContainer, 
                    { 
                      backgroundColor: feedback.includes('Harika') 
                        ? themeColors.success + '20' 
                        : themeColors.warning + '20' 
                    }
                  ]}>
                    <Text style={[
                      styles.feedbackText, 
                      { 
                        color: feedback.includes('Harika') 
                          ? themeColors.success 
                          : themeColors.warning 
                      }
                    ]}>
                      {feedback}
                    </Text>
                  </View>
                  
                  <View style={styles.actionButtons}>
                    <Button
                      title="Tekrar Dene"
                      onPress={handleTryAgain}
                      variant="outline"
                      leftIcon={<RefreshCw size={20} color={themeColors.primary} />}
                      style={styles.actionButton}
                    />
                    
                    <Button
                      title="Yeni Duygu"
                      onPress={handleNewMood}
                      leftIcon={<Smile size={20} color="#FFFFFF" />}
                      style={styles.actionButton}
                    />
                  </View>
                </>
              ) : (
                <Button
                  title="Cümleyi Kontrol Et"
                  onPress={handleSubmitSentence}
                  disabled={!userSentence.trim()}
                  leftIcon={<Check size={20} color="#FFFFFF" />}
                  style={StyleSheet.flatten([
                    styles.checkButton,
                    !userSentence.trim() && { opacity: 0.5 }
                  ])}
                />
              )}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  instruction: {
    fontSize: 16,
    marginBottom: 16,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  emojiCard: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  moodName: {
    fontSize: 14,
    fontWeight: '500',
  },
  selectedMoodCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 24,
  },
  selectedEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  selectedMoodName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  changeMoodButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  changeMoodText: {
    fontSize: 14,
    fontWeight: '500',
  },
  vocabularySection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  practiceSection: {
    marginBottom: 24,
  },
  practiceInstruction: {
    fontSize: 14,
    marginBottom: 12,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  sentenceInput: {
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  checkButton: {
    marginTop: 8,
  },
  feedbackContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  feedbackText: {
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  }
});

