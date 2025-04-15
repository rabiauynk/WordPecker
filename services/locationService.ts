import * as Location from 'expo-location';
import { Platform } from 'react-native';

// Check if location services are enabled
export const checkLocationServices = async (): Promise<boolean> => {
  try {
    const enabled = await Location.hasServicesEnabledAsync();
    return enabled;
  } catch (error) {
    console.error('Error checking location services:', error);
    return false;
  }
};

// Request location permissions
export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error requesting location permission:', error);
    return false;
  }
};

// Get current location
export const getCurrentLocation = async (): Promise<Location.LocationObject | null> => {
  try {
    // Check if location services are enabled
    const servicesEnabled = await checkLocationServices();
    if (!servicesEnabled) {
      throw new Error('Location services are not enabled');
    }
    
    // Request permission if needed
    const permissionGranted = await requestLocationPermission();
    if (!permissionGranted) {
      throw new Error('Location permission not granted');
    }
    
    // Get current position with high accuracy
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High
    });
    
    return location;
  } catch (error) {
    console.error('Error getting current location:', error);
    return null;
  }
};

// Get location name from coordinates (reverse geocoding)
export const getLocationName = async (
  latitude: number,
  longitude: number
): Promise<string | null> => {
  try {
    const result = await Location.reverseGeocodeAsync({
      latitude,
      longitude
    });
    
    if (result && result.length > 0) {
      const { name, street, city, region, country } = result[0];
      // Return the most specific location name available
      return name || street || city || region || country || null;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting location name:', error);
    return null;
  }
};

// Check if the platform supports location services
export const isLocationSupported = (): boolean => {
  // Currently not supported on web
  return Platform.OS !== 'web';
};
