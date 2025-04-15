import { Button } from '@/components/Button';
import { WordCard } from '@/components/WordCard';
import { colors } from '@/constants/colors';
import { useSettingsStore } from '@/store/settingsStore';
import * as Location from 'expo-location';
import { Stack, useRouter } from 'expo-router';
import { Coffee, Hotel, MapPin, Plus, ShoppingBag, Sparkles, Train, Utensils } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { determineLocationType, generateAIVocabulary } from '../services/aiService';
import { getCurrentLocation, isLocationSupported } from '../services/locationService';

// Mock location-based vocabulary
const locationVocab = {
  restaurant: [
    { id: 'r1', term: 'menu', definition: 'a list of dishes available in a restaurant', example: 'Could I see the menu, please?', masteryLevel: 0, createdAt: new Date().toISOString() },
    { id: 'r2', term: 'waiter', definition: 'a person who serves food and drinks in a restaurant', example: 'The waiter brought our drinks quickly.', masteryLevel: 0, createdAt: new Date().toISOString() },
    { id: 'r3', term: 'bill', definition: 'a document showing how much you have to pay', example: 'Could we have the bill, please?', masteryLevel: 0, createdAt: new Date().toISOString() },
  ],
  cafe: [
    { id: 'c1', term: 'espresso', definition: 'a strong coffee made by forcing steam through ground coffee beans', example: 'I ordered a double espresso.', masteryLevel: 0, createdAt: new Date().toISOString() },
    { id: 'c2', term: 'barista', definition: 'a person who makes and serves coffee', example: 'The barista made beautiful latte art.', masteryLevel: 0, createdAt: new Date().toISOString() },
  ],
  store: [
    { id: 's1', term: 'discount', definition: 'a reduction in price', example: 'This shirt is on discount this week.', masteryLevel: 0, createdAt: new Date().toISOString() },
    { id: 's2', term: 'cashier', definition: 'a person who handles payments in a store', example: 'Please pay at the cashier.', masteryLevel: 0, createdAt: new Date().toISOString() },
  ],
  station: [
    { id: 't1', term: 'platform', definition: 'a raised area beside railway tracks where passengers get on and off trains', example: 'The train arrives at platform 3.', masteryLevel: 0, createdAt: new Date().toISOString() },
    { id: 't2', term: 'ticket', definition: 'a piece of paper that gives you permission to travel', example: 'I need to buy a ticket to London.', masteryLevel: 0, createdAt: new Date().toISOString() },
  ],
  hotel: [
    { id: 'h1', term: 'check-in', definition: 'the process of registering at a hotel', example: 'Check-in time is at 3 PM.', masteryLevel: 0, createdAt: new Date().toISOString() },
    { id: 'h2', term: 'concierge', definition: 'a hotel employee who assists guests', example: 'The concierge can help you book tours.', masteryLevel: 0, createdAt: new Date().toISOString() },
  ],
};

type LocationType = 'restaurant' | 'cafe' | 'store' | 'station' | 'hotel';

export default function GeoVocabScreen() {
  const router = useRouter();
  const { theme } = useSettingsStore();
  const themeColors = colors[theme === 'dark' ? 'dark' : 'light'];

  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [locationType, setLocationType] = useState<LocationType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [aiVocabulary, setAiVocabulary] = useState<any[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Check if platform supports location services
  if (!isLocationSupported()) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]} edges={['bottom']}>
        <Stack.Screen options={{ title: 'GeoVocab' }} />

        <View style={[styles.errorContainer, { backgroundColor: themeColors.error + '20' }]}>
          <Text style={[styles.errorText, { color: themeColors.error }]}>
            GeoVocab is not available on web browsers. Please use our mobile app to access this feature.
          </Text>
          <Button
            title="Go Back"
            onPress={() => router.back()}
            variant="outline"
            style={styles.tryAgainButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  // Function to load AI vocabulary suggestions
  const loadAiSuggestions = async () => {
    if (!location || !locationType) return;

    try {
      setIsAiLoading(true);
      const aiWords = await generateAIVocabulary(
        locationType,
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        },
        'en' // Default language
      );
      setAiVocabulary(aiWords);
    } catch (error) {
      console.error('Error loading AI suggestions:', error);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Function to detect location and determine location type
  const detectLocation = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      // Get current location
      const currentLocation = await getCurrentLocation();

      if (!currentLocation) {
        setErrorMsg('Could not get your location. Please check your device settings.');
        return;
      }

      setLocation(currentLocation);

      // Determine location type based on coordinates
      const type = await determineLocationType({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude
      });

      setLocationType(type as LocationType);

      // Load AI vocabulary suggestions
      loadAiSuggestions();

    } catch (error) {
      console.error('Error detecting location:', error);
      setErrorMsg('An error occurred while detecting your location');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    detectLocation();
  }, []);

  const getLocationIcon = () => {
    switch (locationType) {
      case 'restaurant':
        return <Utensils size={24} color={themeColors.primary} />;
      case 'cafe':
        return <Coffee size={24} color={themeColors.primary} />;
      case 'store':
        return <ShoppingBag size={24} color={themeColors.primary} />;
      case 'station':
        return <Train size={24} color={themeColors.primary} />;
      case 'hotel':
        return <Hotel size={24} color={themeColors.primary} />;
      default:
        return <MapPin size={24} color={themeColors.primary} />;
    }
  };

  const getLocationName = () => {
    switch (locationType) {
      case 'restaurant':
        return 'Restaurant';
      case 'cafe':
        return 'Café';
      case 'store':
        return 'Store';
      case 'station':
        return 'Train Station';
      case 'hotel':
        return 'Hotel';
      default:
        return 'Unknown Location';
    }
  };

  const getVocabulary = () => {
    if (!locationType) return [];
    return locationVocab[locationType] || [];
  };

  const handleAddToList = () => {
    // In a real app, this would open a modal to select a list to add these words to
    alert('This would allow you to add these words to one of your lists');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]} edges={['bottom']}>
      <Stack.Screen options={{ title: 'GeoVocab' }} />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: themeColors.text }]}>Location-Based Vocabulary</Text>
          <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
            Learn words relevant to your current location
          </Text>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={themeColors.primary} />
            <Text style={[styles.loadingText, { color: themeColors.text }]}>
              Detecting your location...
            </Text>
          </View>
        ) : errorMsg ? (
          <View style={[styles.errorContainer, { backgroundColor: themeColors.error + '20' }]}>
            <Text style={[styles.errorText, { color: themeColors.error }]}>{errorMsg}</Text>
            <Button
              title="Try Again"
              onPress={() => router.replace('/geo-vocab')}
              variant="outline"
              style={styles.tryAgainButton}
            />
          </View>
        ) : (
          <>
            <View style={[styles.locationCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
              <View style={styles.locationHeader}>
                {getLocationIcon()}
                <Text style={[styles.locationName, { color: themeColors.text }]}>
                  {getLocationName()}
                </Text>
              </View>

              <Text style={[styles.locationDescription, { color: themeColors.textSecondary }]}>
                We've detected you're at a {getLocationName().toLowerCase()}. Here are some useful words for this location:
              </Text>

              <View style={styles.locationDetails}>
                <Text style={[styles.locationCoordinates, { color: themeColors.textSecondary }]}>
                  Lat: {location?.coords.latitude.toFixed(6)}, Long: {location?.coords.longitude.toFixed(6)}
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: themeColors.primary }]}
                onPress={handleAddToList}
              >
                <Plus size={16} color="#FFFFFF" />
                <Text style={styles.addButtonText}>Add to My Lists</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.vocabularySection}>
              <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Basic Vocabulary</Text>

              {getVocabulary().map(word => (
                <WordCard
                  key={word.id}
                  word={word}
                  showActions={false}
                />
              ))}
            </View>

            <View style={styles.vocabularySection}>
              <View style={styles.aiHeader}>
                <Sparkles size={20} color={themeColors.primary} />
                <Text style={[styles.sectionTitle, { color: themeColors.text }]}>AI Suggestions</Text>
              </View>

              {isAiLoading ? (
                <View style={styles.aiLoadingContainer}>
                  <ActivityIndicator size="small" color={themeColors.primary} />
                  <Text style={[styles.aiLoadingText, { color: themeColors.textSecondary }]}>
                    Generating AI vocabulary suggestions...
                  </Text>
                </View>
              ) : aiVocabulary.length > 0 ? (
                aiVocabulary.map(word => (
                  <WordCard
                    key={word.id}
                    word={word}
                    showActions={false}
                  />
                ))
              ) : (
                <View style={[styles.emptyState, { borderColor: themeColors.border }]}>
                  <Text style={[styles.emptyStateText, { color: themeColors.textSecondary }]}>
                    No AI suggestions available. Try refreshing.
                  </Text>
                  <Button
                    title="Refresh"
                    onPress={loadAiSuggestions}
                    variant="outline"
                    style={styles.refreshButton}
                  />
                </View>
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
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
  },
  errorContainer: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  tryAgainButton: {
    minWidth: 120,
  },
  locationCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  locationName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  locationDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  locationDetails: {
    marginBottom: 16,
  },
  locationCoordinates: {
    fontSize: 12,
    fontFamily: 'monospace',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 8,
    gap: 4,
  },
  addButtonText: {
    color: '#FFFFFF',
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
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  aiLoadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  aiLoadingText: {
    fontSize: 14,
    marginTop: 8,
  },
  emptyState: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
  refreshButton: {
    minWidth: 100,
  },
});


