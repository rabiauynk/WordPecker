import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { Text, Button, Chip, Card, Title, Paragraph, Snackbar } from 'react-native-paper';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ListsStackParamList } from '../../types';
import { commonStyles } from '../../styles/theme';

type CameraScreenNavigationProp = StackNavigationProp<ListsStackParamList, 'Camera'>;
type CameraScreenRouteProp = RouteProp<ListsStackParamList, 'Camera'>;

// OCR işlemi simülasyonu için örnek kelimeler
const mockExtractedWords = [
  { word: 'innovation', meaning: 'yenilik' },
  { word: 'technology', meaning: 'teknoloji' },
  { word: 'development', meaning: 'gelişim' },
  { word: 'application', meaning: 'uygulama' },
  { word: 'mobile', meaning: 'mobil' },
  { word: 'language', meaning: 'dil' },
  { word: 'learning', meaning: 'öğrenme' },
];

const CameraScreen = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedWords, setExtractedWords] = useState<{ word: string; meaning: string; selected: boolean }[]>([]);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const cameraRef = useRef<Camera>(null);
  const navigation = useNavigation<CameraScreenNavigationProp>();
  const route = useRoute<CameraScreenRouteProp>();
  const { listId, listName } = route.params;

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const onCameraReady = () => {
    setIsCameraReady(true);
  };

  const takePicture = async () => {
    if (cameraRef.current && isCameraReady && !isCapturing) {
      setIsCapturing(true);
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: true,
        });
        
        processImage(photo.uri);
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Hata', 'Fotoğraf çekilirken bir hata oluştu.');
        setIsCapturing(false);
      }
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('İzin Gerekli', 'Galeriye erişim izni vermeniz gerekiyor.');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled) {
        processImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Hata', 'Görsel seçilirken bir hata oluştu.');
    }
  };

  const processImage = (imageUri: string) => {
    setIsProcessing(true);
    
    // Gerçek uygulamada burada OCR API çağrısı yapılır
    // Şimdilik simüle ediyoruz
    setTimeout(() => {
      // Mock veriyi kullan ve her kelimeye selected: true ekle
      const words = mockExtractedWords.map(word => ({
        ...word,
        selected: true
      }));
      
      setExtractedWords(words);
      setIsCapturing(false);
      setIsProcessing(false);
    }, 2000);
  };

  const toggleWordSelection = (index: number) => {
    const updatedWords = [...extractedWords];
    updatedWords[index].selected = !updatedWords[index].selected;
    setExtractedWords(updatedWords);
  };

  const addSelectedWords = () => {
    const selectedWords = extractedWords.filter(word => word.selected);
    
    if (selectedWords.length === 0) {
      Alert.alert('Uyarı', 'Lütfen en az bir kelime seçin.');
      return;
    }

    // Gerçek uygulamada API çağrısı yapılır
    // Şimdilik simüle ediyoruz
    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      setSnackbarMessage(`${selectedWords.length} kelime başarıyla eklendi!`);
      setSnackbarVisible(true);
      
      // Kısa bir süre sonra liste detay sayfasına yönlendir
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    }, 1000);
  };

  if (hasPermission === null) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.permissionText}>Kamera izni isteniyor...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <MaterialCommunityIcons name="camera-off" size={64} color="#94A3B8" />
        <Text style={styles.permissionText}>Kamera erişimi reddedildi.</Text>
        <Button 
          mode="contained" 
          onPress={pickImage}
          style={styles.galleryButton}
          icon="image"
        >
          Galeriden Seç
        </Button>
        <Button 
          mode="outlined" 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          Geri Dön
        </Button>
      </View>
    );
  }

  if (isProcessing) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.processingText}>Görsel işleniyor ve kelimeler çıkarılıyor...</Text>
      </View>
    );
  }

  if (extractedWords.length > 0) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.wordsContainer}>
          <Title style={styles.title}>Çıkarılan Kelimeler</Title>
          <Paragraph style={styles.subtitle}>
            "{listName}" listesine eklemek istediğiniz kelimeleri seçin.
          </Paragraph>
          
          {extractedWords.map((item, index) => (
            <Card 
              key={index} 
              style={[
                styles.wordCard,
                item.selected && styles.selectedWordCard
              ]}
              onPress={() => toggleWordSelection(index)}
            >
              <Card.Content style={styles.wordCardContent}>
                <View>
                  <Text style={styles.wordText}>{item.word}</Text>
                  <Text style={styles.meaningText}>{item.meaning}</Text>
                </View>
                <MaterialCommunityIcons 
                  name={item.selected ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"} 
                  size={24} 
                  color={item.selected ? "#4CAF50" : "#94A3B8"} 
                />
              </Card.Content>
            </Card>
          ))}
          
          <View style={styles.actionButtons}>
            <Button 
              mode="contained" 
              onPress={addSelectedWords}
              style={styles.addButton}
              icon="plus"
            >
              Seçilen Kelimeleri Ekle
            </Button>
            <Button 
              mode="outlined" 
              onPress={() => {
                setExtractedWords([]);
                setIsCapturing(false);
              }}
              style={styles.retakeButton}
              icon="camera-retake"
            >
              Yeniden Çek
            </Button>
          </View>
        </ScrollView>

        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={2000}
        >
          {snackbarMessage}
        </Snackbar>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        type={cameraType}
        onCameraReady={onCameraReady}
        ratio="16:9"
      >
        <View style={styles.cameraControls}>
          <View style={styles.cameraButtonsContainer}>
            <TouchableOpacity 
              style={styles.flipButton}
              onPress={() => {
                setCameraType(
                  cameraType === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
                );
              }}
              disabled={isCapturing}
            >
              <MaterialCommunityIcons name="camera-flip" size={28} color="#FFFFFF" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.captureButton}
              onPress={takePicture}
              disabled={!isCameraReady || isCapturing}
            >
              {isCapturing ? (
                <ActivityIndicator size="large" color="#FFFFFF" />
              ) : (
                <View style={styles.captureButtonInner} />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.galleryPickButton}
              onPress={pickImage}
              disabled={isCapturing}
            >
              <MaterialCommunityIcons name="image" size={28} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.instructionContainer}>
            <Text style={styles.instructionText}>
              Kelime içeren bir metni çerçeve içine alın ve fotoğraf çekin
            </Text>
          </View>
        </View>
      </Camera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  cameraButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 30,
  },
  flipButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
  },
  galleryPickButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 16,
    alignItems: 'center',
  },
  instructionText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
  permissionText: {
    color: '#94A3B8',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  galleryButton: {
    marginTop: 16,
    backgroundColor: '#4CAF50',
  },
  backButton: {
    marginTop: 16,
    borderColor: '#64748B',
  },
  processingText: {
    color: '#94A3B8',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    maxWidth: '80%',
  },
  wordsContainer: {
    padding: 16,
    paddingBottom: 32,
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
    marginBottom: 24,
  },
  wordCard: {
    marginBottom: 8,
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    borderWidth: 1,
  },
  selectedWordCard: {
    borderColor: '#4CAF50',
    borderWidth: 2,
  },
  wordCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wordText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  meaningText: {
    fontSize: 14,
    color: '#94A3B8',
  },
  actionButtons: {
    marginTop: 24,
  },
  addButton: {
    marginBottom: 16,
    backgroundColor: '#4CAF50',
  },
  retakeButton: {
    borderColor: '#64748B',
  },
});

export default CameraScreen;
