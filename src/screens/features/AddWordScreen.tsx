import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { TextInput, Button, Text, Title, Paragraph, Snackbar, Chip } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ListsStackParamList } from '../../types';
import { commonStyles } from '../../styles/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type AddWordScreenNavigationProp = StackNavigationProp<ListsStackParamList, 'AddWord'>;
type AddWordScreenRouteProp = RouteProp<ListsStackParamList, 'AddWord'>;

const AddWordScreen = () => {
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const [context, setContext] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [wordError, setWordError] = useState('');
  const [meaningError, setMeaningError] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [addedWords, setAddedWords] = useState<{word: string, meaning: string}[]>([]);
  const [addMultiple, setAddMultiple] = useState(false);

  const navigation = useNavigation<AddWordScreenNavigationProp>();
  const route = useRoute<AddWordScreenRouteProp>();
  const { listId, listName } = route.params;

  const validateForm = () => {
    let isValid = true;

    if (!word.trim()) {
      setWordError('Kelime gerekli');
      isValid = false;
    } else {
      setWordError('');
    }

    if (!meaning.trim()) {
      setMeaningError('Anlam gerekli');
      isValid = false;
    } else {
      setMeaningError('');
    }

    return isValid;
  };

  const handleAddWord = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    // Gerçek uygulamada API çağrısı yapılır
    // Şimdilik simüle ediyoruz
    setTimeout(() => {
      setIsLoading(false);
      
      // Başarılı olduğunu varsayalım
      if (addMultiple) {
        // Kelimeyi listeye ekle ve formu temizle
        setAddedWords([...addedWords, { word, meaning }]);
        setWord('');
        setMeaning('');
        setContext('');
        
        // Kullanıcıya bildirim göster
        setSnackbarMessage('Kelime başarıyla eklendi!');
        setSnackbarVisible(true);
      } else {
        // Kullanıcıya bildirim göster
        setSnackbarMessage('Kelime başarıyla eklendi!');
        setSnackbarVisible(true);
        
        // Kısa bir süre sonra liste detay sayfasına yönlendir
        setTimeout(() => {
          navigation.goBack();
        }, 1000);
      }
    }, 1000);
  };

  const handleCameraCapture = () => {
    navigation.navigate('Camera', { listId, listName });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.headerContainer}>
        <Title style={styles.title}>Kelime Ekle</Title>
        <Paragraph style={styles.subtitle}>
          "{listName}" listesine yeni kelimeler ekleyin.
        </Paragraph>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          label="Kelime"
          value={word}
          onChangeText={setWord}
          mode="outlined"
          style={styles.input}
          error={!!wordError}
        />
        {wordError ? <Text style={styles.errorText}>{wordError}</Text> : null}

        <TextInput
          label="Anlam"
          value={meaning}
          onChangeText={setMeaning}
          mode="outlined"
          style={styles.input}
          error={!!meaningError}
        />
        {meaningError ? <Text style={styles.errorText}>{meaningError}</Text> : null}

        <TextInput
          label="Bağlam/Örnek Cümle (İsteğe Bağlı)"
          value={context}
          onChangeText={setContext}
          mode="outlined"
          style={styles.input}
          multiline
          numberOfLines={3}
          placeholder="Kelimeyi içeren bir cümle veya kullanım örneği"
        />

        <View style={styles.optionsContainer}>
          <TouchableOpacity 
            style={styles.optionRow}
            onPress={() => setAddMultiple(!addMultiple)}
          >
            <MaterialCommunityIcons 
              name={addMultiple ? "checkbox-marked" : "checkbox-blank-outline"} 
              size={24} 
              color={addMultiple ? "#4CAF50" : "#94A3B8"} 
            />
            <Text style={styles.optionText}>Birden fazla kelime ekle</Text>
          </TouchableOpacity>
        </View>

        <Button 
          mode="contained" 
          onPress={handleAddWord} 
          style={styles.button}
          loading={isLoading}
          disabled={isLoading}
        >
          {addMultiple ? "Kelimeyi Ekle ve Devam Et" : "Kelimeyi Ekle"}
        </Button>

        <Button 
          mode="outlined" 
          onPress={handleCameraCapture} 
          style={styles.cameraButton}
          icon="camera"
          disabled={isLoading}
        >
          Kamera ile Kelime Yakala
        </Button>

        <Button 
          mode="text" 
          onPress={() => navigation.goBack()} 
          style={styles.cancelButton}
          disabled={isLoading}
        >
          {addMultiple && addedWords.length > 0 ? "Tamamla" : "İptal"}
        </Button>
      </View>

      {addMultiple && addedWords.length > 0 && (
        <View style={styles.addedWordsContainer}>
          <Title style={styles.addedWordsTitle}>Eklenen Kelimeler</Title>
          <View style={styles.chipContainer}>
            {addedWords.map((item, index) => (
              <Chip 
                key={index} 
                style={styles.wordChip}
                onClose={() => {
                  const newWords = [...addedWords];
                  newWords.splice(index, 1);
                  setAddedWords(newWords);
                }}
              >
                {item.word} - {item.meaning}
              </Chip>
            ))}
          </View>
        </View>
      )}

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2000}
        action={{
          label: 'Tamam',
          onPress: () => setSnackbarVisible(false),
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
    padding: 16,
  },
  headerContainer: {
    marginBottom: 24,
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
  },
  formContainer: {
    width: '100%',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#1E293B',
  },
  optionsContainer: {
    marginBottom: 24,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionText: {
    color: '#FFFFFF',
    marginLeft: 8,
  },
  button: {
    marginBottom: 16,
    paddingVertical: 8,
    backgroundColor: '#4CAF50',
  },
  cameraButton: {
    marginBottom: 16,
    borderColor: '#4CAF50',
  },
  cancelButton: {
    marginBottom: 16,
  },
  errorText: {
    color: '#EF4444',
    marginBottom: 8,
    fontSize: 14,
  },
  addedWordsContainer: {
    marginTop: 24,
    marginBottom: 16,
  },
  addedWordsTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  wordChip: {
    margin: 4,
    backgroundColor: '#334155',
  },
});

export default AddWordScreen;
