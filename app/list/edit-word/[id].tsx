import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image as ImageIcon, Mic, Volume2 } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '@/constants/colors';
import { useSettingsStore } from '@/store/settingsStore';
import { useWordListsStore } from '@/store/wordListsStore';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';

export default function EditWordScreen() {
  const { id, listId } = useLocalSearchParams<{ id: string; listId: string }>();
  const router = useRouter();
  const { theme } = useSettingsStore();
  const { updateWord, isLoading, lists } = useWordListsStore();
  const themeColors = colors[theme === 'dark' ? 'dark' : 'light'];
  
  // Find the list and word
  const list = lists.find(list => list.id === listId);
  const word = list?.words.find(word => word.id === id);
  
  const [term, setTerm] = useState('');
  const [definition, setDefinition] = useState('');
  const [example, setExample] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [validationError, setValidationError] = useState('');
  
  useEffect(() => {
    if (word) {
      setTerm(word.term);
      setDefinition(word.definition);
      setExample(word.example || '');
      setImageUrl(word.imageUrl || '');
    }
  }, [word]);
  
  if (!list || !word) {
    return (
      <EmptyState
        title="Word Not Found"
        message="The word you're trying to edit doesn't exist"
        actionLabel="Go Back"
        onAction={() => router.back()}
      />
    );
  }
  
  const handleUpdateWord = async () => {
    // Validation
    if (!term.trim()) {
      setValidationError('Please enter a term');
      return;
    }
    
    if (!definition.trim()) {
      setValidationError('Please enter a definition');
      return;
    }
    
    setValidationError('');
    
    await updateWord(list.id, word.id, {
      term,
      definition,
      example: example.trim() || undefined,
      imageUrl: imageUrl || undefined,
    });
    
    router.back();
  };
  
  const pickImage = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return;
      }
    }
    
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    
    if (!result.canceled) {
      setImageUrl(result.assets[0].uri);
    }
  };
  
  const recordAudio = () => {
    // This would be implemented with expo-av in a real app
    alert('Audio recording is not available in this demo');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]} edges={['bottom']}>
      <Stack.Screen options={{ title: 'Edit Word' }} />
      
      <ScrollView contentContainerStyle={styles.content}>
        {validationError ? (
          <View style={[styles.errorContainer, { backgroundColor: themeColors.error + '20' }]}>
            <Text style={[styles.errorText, { color: themeColors.error }]}>{validationError}</Text>
          </View>
        ) : null}
        
        <Input
          label="Term"
          placeholder="Enter the word or phrase"
          value={term}
          onChangeText={setTerm}
        />
        
        <Input
          label="Definition"
          placeholder="Enter the meaning"
          value={definition}
          onChangeText={setDefinition}
          multiline
          numberOfLines={2}
          textAlignVertical="top"
        />
        
        <Input
          label="Example (Optional)"
          placeholder="Enter an example sentence"
          value={example}
          onChangeText={setExample}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          style={styles.exampleInput}
        />
        
        <View style={styles.mediaSection}>
          <Text style={[styles.mediaTitle, { color: themeColors.text }]}>Media (Optional)</Text>
          
          <View style={styles.mediaButtons}>
            <TouchableOpacity 
              style={[styles.mediaButton, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}
              onPress={pickImage}
            >
              <ImageIcon size={24} color={themeColors.primary} />
              <Text style={[styles.mediaButtonText, { color: themeColors.text }]}>
                {imageUrl ? 'Change Image' : 'Add Image'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.mediaButton, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}
              onPress={recordAudio}
            >
              <Mic size={24} color={themeColors.primary} />
              <Text style={[styles.mediaButtonText, { color: themeColors.text }]}>
                {word.audioUrl ? 'Change Audio' : 'Record Audio'}
              </Text>
            </TouchableOpacity>
          </View>
          
          {imageUrl ? (
            <View style={styles.previewContainer}>
              <Text style={[styles.previewTitle, { color: themeColors.text }]}>Image Preview</Text>
              <Image source={{ uri: imageUrl }} style={styles.imagePreview} />
              <TouchableOpacity 
                style={[styles.removeButton, { backgroundColor: themeColors.error }]}
                onPress={() => setImageUrl('')}
              >
                <Text style={styles.removeButtonText}>Remove Image</Text>
              </TouchableOpacity>
            </View>
          ) : null}
          
          {word.audioUrl ? (
            <View style={styles.audioPreview}>
              <Text style={[styles.previewTitle, { color: themeColors.text }]}>Audio Preview</Text>
              <TouchableOpacity 
                style={[styles.playButton, { backgroundColor: themeColors.primary }]}
                onPress={() => {
                  // This would play the audio in a real app
                  alert('Audio playback is not available in this demo');
                }}
              >
                <Volume2 size={20} color="#FFFFFF" />
                <Text style={styles.playButtonText}>Play Audio</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
        
        <Button
          title="Save Changes"
          onPress={handleUpdateWord}
          isLoading={isLoading}
          style={styles.saveButton}
        />
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
  errorContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
  },
  exampleInput: {
    height: 100,
    paddingTop: 12,
  },
  mediaSection: {
    marginTop: 16,
    marginBottom: 24,
  },
  mediaTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  mediaButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  mediaButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  mediaButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  previewContainer: {
    marginTop: 16,
  },
  previewTitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  removeButton: {
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  audioPreview: {
    marginTop: 16,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  playButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  saveButton: {
    marginTop: 16,
  },
});