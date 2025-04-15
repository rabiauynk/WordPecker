import { Animated, Easing, Platform } from 'react-native';

// iOS için daha yumuşak animasyonlar
const iosTimingConfig = {
  duration: 300,
  easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  useNativeDriver: true,
};

// Android için daha hızlı animasyonlar
const androidTimingConfig = {
  duration: 200,
  easing: Easing.out(Easing.ease),
  useNativeDriver: true,
};

// Platform'a göre animasyon konfigürasyonu
const defaultTimingConfig = Platform.OS === 'ios' ? iosTimingConfig : androidTimingConfig;

/**
 * Fade-in animasyonu
 */
export const fadeIn = (
  value: Animated.Value,
  config = {}
): Animated.CompositeAnimation => {
  return Animated.timing(value, {
    toValue: 1,
    ...defaultTimingConfig,
    ...config,
  });
};

/**
 * Fade-out animasyonu
 */
export const fadeOut = (
  value: Animated.Value,
  config = {}
): Animated.CompositeAnimation => {
  return Animated.timing(value, {
    toValue: 0,
    ...defaultTimingConfig,
    ...config,
  });
};

/**
 * Slide-in animasyonu (aşağıdan yukarıya)
 */
export const slideInUp = (
  value: Animated.Value,
  distance = 100,
  config = {}
): Animated.CompositeAnimation => {
  return Animated.timing(value, {
    toValue: 0,
    ...defaultTimingConfig,
    ...config,
  });
};

/**
 * Slide-out animasyonu (yukarıdan aşağıya)
 */
export const slideOutDown = (
  value: Animated.Value,
  distance = 100,
  config = {}
): Animated.CompositeAnimation => {
  return Animated.timing(value, {
    toValue: distance,
    ...defaultTimingConfig,
    ...config,
  });
};

/**
 * Scale animasyonu
 */
export const scale = (
  value: Animated.Value,
  toValue: number,
  config = {}
): Animated.CompositeAnimation => {
  return Animated.timing(value, {
    toValue,
    ...defaultTimingConfig,
    ...config,
  });
};

/**
 * Bounce animasyonu
 */
export const bounce = (
  value: Animated.Value,
  config = {}
): Animated.CompositeAnimation => {
  return Animated.spring(value, {
    toValue: 1,
    friction: Platform.OS === 'ios' ? 7 : 5,
    tension: Platform.OS === 'ios' ? 40 : 30,
    useNativeDriver: true,
    ...config,
  });
};

/**
 * Pulse animasyonu
 */
export const pulse = (
  value: Animated.Value
): Animated.CompositeAnimation => {
  return Animated.sequence([
    Animated.timing(value, {
      toValue: 1.1,
      duration: 100,
      easing: Easing.linear,
      useNativeDriver: true,
    }),
    Animated.timing(value, {
      toValue: 1,
      duration: 100,
      easing: Easing.linear,
      useNativeDriver: true,
    }),
  ]);
};
