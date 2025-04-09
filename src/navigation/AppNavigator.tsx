import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

// Auth Screens
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Main Screens
import AddWordScreen from '../screens/features/AddWordScreen';
import CreateListScreen from '../screens/features/CreateListScreen';
import LearnScreen from '../screens/features/LearnScreen';
import ListDetailScreen from '../screens/features/ListDetailScreen';
import ListsScreen from '../screens/features/ListsScreen';
import ProgressScreen from '../screens/features/ProgressScreen';
import QuizScreen from '../screens/features/QuizScreen';
import SearchScreen from '../screens/features/SearchScreen';
import SettingsScreen from '../screens/features/SettingsScreen';

// Innovative Features
import CameraScreen from '../screens/features/CameraScreen';
import SocialScreen from '../screens/features/SocialScreen';

// Placeholder
import FeaturePlaceholder from '../screens/placeholders/FeaturePlaceholder';

// Auth Navigator
const AuthStack = createStackNavigator();
export const AuthNavigator = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1E293B',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          color: '#FFFFFF',
        },
        cardStyle: { backgroundColor: '#0F172A' }
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} options={{ title: 'Giriş Yap' }} />
      <AuthStack.Screen name="Register" component={RegisterScreen} options={{ title: 'Kayıt Ol' }} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ title: 'Şifremi Unuttum' }} />
    </AuthStack.Navigator>
  );
};

// Main Tab Navigator
const Tab = createBottomTabNavigator();
export const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#1E293B',
          borderTopColor: '#334155',
        },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#94A3B8',
        headerStyle: {
          backgroundColor: '#1E293B',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          color: '#FFFFFF',
        },
      }}
    >
      <Tab.Screen
        name="Lists"
        component={ListsNavigator}
        options={{
          title: 'Listelerim',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="format-list-bulleted" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Learn"
        component={LearnNavigator}
        options={{
          title: 'Öğren',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="book-open-variant" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{
          title: 'İlerleme',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chart-line" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Social"
        component={SocialScreen}
        options={{
          title: 'Sosyal',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-group" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Ayarlar',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Lists Navigator
const ListsStack = createStackNavigator();
export const ListsNavigator = () => {
  return (
    <ListsStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1E293B',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          color: '#FFFFFF',
        },
        cardStyle: { backgroundColor: '#0F172A' }
      }}
    >
      <ListsStack.Screen name="MyLists" component={ListsScreen} options={{ title: 'Kelime Listelerim' }} />
      <ListsStack.Screen name="CreateList" component={CreateListScreen} options={{ title: 'Liste Oluştur' }} />
      <ListsStack.Screen name="ListDetail" component={ListDetailScreen} options={({ route }) => ({ title: route.params?.listName || 'Liste Detayı' })} />
      <ListsStack.Screen name="AddWord" component={AddWordScreen} options={{ title: 'Kelime Ekle' }} />
      <ListsStack.Screen name="Camera" component={CameraScreen} options={{ title: 'Kamera ile Kelime Yakala' }} />
      <ListsStack.Screen name="Search" component={SearchScreen} options={{ title: 'Ara' }} />
    </ListsStack.Navigator>
  );
};

// Learn Navigator
const LearnStack = createStackNavigator();
export const LearnNavigator = () => {
  return (
    <LearnStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1E293B',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          color: '#FFFFFF',
        },
        cardStyle: { backgroundColor: '#0F172A' }
      }}
    >
      <LearnStack.Screen name="LearnHome" component={LearnScreen} options={{ title: 'Öğrenme Modu' }} />
      <LearnStack.Screen name="Quiz" component={QuizScreen} options={{ title: 'Quiz Modu' }} />
    </LearnStack.Navigator>
  );
};

// Root Navigator
const RootStack = createStackNavigator();
export const RootNavigator = () => {
  // Geliştirme aşamasında doğrudan ana ekranları göster
  // Gerçek uygulamada kimlik doğrulama kontrolü yapılır
  // const { authState } = useAuth();
  // const isAuthenticated = authState.isAuthenticated;

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {/* Geliştirme aşamasında doğrudan ana ekranları göster */}
      <RootStack.Screen name="Main" component={MainTabNavigator} />
      <RootStack.Screen name="Auth" component={AuthNavigator} />
      {/* Placeholder ekranı geliştirme sırasında erişilebilir olmalı */}
      <RootStack.Screen
        name="FeaturePlaceholder"
        component={FeaturePlaceholder}
        options={{
          headerShown: true,
          title: 'Özellik Detayı',
          headerStyle: {
            backgroundColor: '#1E293B',
          },
          headerTintColor: '#FFFFFF',
        }}
      />
    </RootStack.Navigator>
  );
};
