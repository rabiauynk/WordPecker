import { Word } from '../types/wordList';

// This would typically be an API call to an AI service
// For demo purposes, we'll simulate AI responses
export const generateAIVocabulary = async (
  locationType: string,
  coordinates: { latitude: number; longitude: number },
  language: string = 'en'
): Promise<Word[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // In a real implementation, we would send the coordinates and location type
  // to an AI service that would return relevant vocabulary

  // For now, we'll return predefined vocabulary based on location type
  const aiSuggestions: Record<string, Word[]> = {
    restaurant: [
      {
        id: 'ai-r1',
        term: 'reservation',
        definition: 'an arrangement to have a table kept for someone in a restaurant',
        example: "I'd like to make a reservation for two people at 8 PM.",
        masteryLevel: 0,
        createdAt: new Date().toISOString()
      },
      {
        id: 'ai-r2',
        term: 'appetizer',
        definition: 'a small dish served before the main course',
        example: 'We ordered calamari as an appetizer.',
        masteryLevel: 0,
        createdAt: new Date().toISOString()
      },
    ],
    cafe: [
      {
        id: 'ai-c1',
        term: 'latte',
        definition: 'a type of coffee made with espresso and steamed milk',
        example: "I'll have a vanilla latte, please.",
        masteryLevel: 0,
        createdAt: new Date().toISOString()
      },
      {
        id: 'ai-c2',
        term: 'pastry',
        definition: 'sweet baked goods made with dough',
        example: 'The cafe has a wide selection of pastries.',
        masteryLevel: 0,
        createdAt: new Date().toISOString()
      },
    ],
    store: [
      {
        id: 'ai-s1',
        term: 'receipt',
        definition: 'a printed record of a purchase',
        example: 'Please keep your receipt in case you need to return the item.',
        masteryLevel: 0,
        createdAt: new Date().toISOString()
      },
      {
        id: 'ai-s2',
        term: 'sale',
        definition: 'a period when items are sold at reduced prices',
        example: 'These shoes are on sale this week.',
        masteryLevel: 0,
        createdAt: new Date().toISOString()
      },
    ],
    station: [
      {
        id: 'ai-t1',
        term: 'departure',
        definition: 'the act of leaving a place',
        example: 'The departure time for the train is 9:15 AM.',
        masteryLevel: 0,
        createdAt: new Date().toISOString()
      },
      {
        id: 'ai-t2',
        term: 'delay',
        definition: 'a period of time by which something is late',
        example: "There's a 20-minute delay on all trains due to bad weather.",
        masteryLevel: 0,
        createdAt: new Date().toISOString()
      },
    ],
    hotel: [
      {
        id: 'ai-h1',
        term: 'reservation',
        definition: 'an arrangement to have a room kept for someone',
        example: 'I have a reservation for a double room for three nights.',
        masteryLevel: 0,
        createdAt: new Date().toISOString()
      },
      {
        id: 'ai-h2',
        term: 'amenities',
        definition: 'desirable or useful features of a building or place',
        example: 'The hotel offers many amenities, including a pool and gym.',
        masteryLevel: 0,
        createdAt: new Date().toISOString()
      },
    ],
  };

  // Return AI suggestions for the given location type, or an empty array if none exist
  return aiSuggestions[locationType] || [];
};

// Function to determine location type based on coordinates
// In a real app, this would use reverse geocoding or a places API
export const determineLocationType = async (
  coordinates: { latitude: number; longitude: number }
): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // For demo purposes, we'll use the coordinates to deterministically select a location type
  // In a real app, you would use Google Places API or similar to get the actual location type
  const sum = coordinates.latitude + coordinates.longitude;
  const locationTypes = ['restaurant', 'cafe', 'store', 'station', 'hotel'];

  // Use the sum of coordinates to select a location type (this is just for demo)
  const index = Math.abs(Math.floor(sum * 10)) % locationTypes.length;
  return locationTypes[index];
};

// Function to translate vocabulary using AI
export const translateVocabulary = async (
  words: Word[],
  targetLanguage: string
): Promise<Word[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // In a real app, this would call a translation API
  // For demo purposes, we'll just return the original words
  return words;
};
