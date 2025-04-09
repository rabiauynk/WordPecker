import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { TextInput, Button, Text, Title, Paragraph, Snackbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ListsStackParamList } from '../../types';
import { commonStyles } from '../../styles/theme';

type CreateListScreenNavigationProp = StackNavigationProp<ListsStackParamList, 'CreateList'>;

const CreateListScreen = () => {
  const [listName, setListName] = useState('');
  const [description, setDescription] = useState('');
  const [context, setContext] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [nameError, setNameError] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const navigation = useNavigation<CreateListScreenNavigationProp>();

  const validateForm = () => {
    let isValid = true;

    if (!listName.trim()) {
      setNameError('Liste adı gerekli');
      isValid = false;
    } else if (listName.length < 3) {
      setNameError('Liste adı en az 3 karakter olmalıdır');
      isValid = false;
    } else {
      setNameError('');
    }

    return isValid;
  };

  const handleCreateList = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    // Gerçek uygulamada API çağrısı yapılır
    // Şimdilik simüle ediyoruz
    setTimeout(() => {
      setIsLoading(false);
      
      // Başarılı olduğunu varsayalım
      const newListId = Math.random().toString(36).substring(7);
      
      // Kullanıcıya bildirim göster
      setSnackbarMessage('Liste başarıyla oluşturuldu!');
      setSnackbarVisible(true);
      
      // Kısa bir süre sonra liste detay sayfasına yönlendir
      setTimeout(() => {
        navigation.navigate('ListDetail', { 
          listId: newListId,
          listName: listName
        });
      }, 1000);
    }, 1500);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.headerContainer}>
        <Title style={styles.title}>Yeni Liste Oluştur</Title>
        <Paragraph style={styles.subtitle}>
          Öğrenmek istediğiniz kelimeler için yeni bir liste oluşturun.
        </Paragraph>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          label="Liste Adı"
          value={listName}
          onChangeText={setListName}
          mode="outlined"
          style={styles.input}
          error={!!nameError}
        />
        {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

        <TextInput
          label="Açıklama (İsteğe Bağlı)"
          value={description}
          onChangeText={setDescription}
          mode="outlined"
          style={styles.input}
          multiline
          numberOfLines={3}
        />

        <TextInput
          label="Bağlam/Kaynak (İsteğe Bağlı)"
          value={context}
          onChangeText={setContext}
          mode="outlined"
          style={styles.input}
          placeholder="Örn: İngilizce kitap, makale, film adı"
          multiline
          numberOfLines={2}
        />

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Liste oluşturduktan sonra kelime ekleyebilirsiniz.
          </Text>
        </View>

        <Button 
          mode="contained" 
          onPress={handleCreateList} 
          style={styles.button}
          loading={isLoading}
          disabled={isLoading}
        >
          Liste Oluştur
        </Button>

        <Button 
          mode="outlined" 
          onPress={() => navigation.goBack()} 
          style={styles.cancelButton}
          disabled={isLoading}
        >
          İptal
        </Button>
      </View>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
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
  infoContainer: {
    backgroundColor: '#1E3A8A',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  infoText: {
    color: '#93C5FD',
  },
  button: {
    marginBottom: 16,
    paddingVertical: 8,
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    borderColor: '#64748B',
  },
  errorText: {
    color: '#EF4444',
    marginBottom: 8,
    fontSize: 14,
  },
});

export default CreateListScreen;
