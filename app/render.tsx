import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import LoginScreen from './userlogin';
import Home from './home';

export default function RenderComponent() {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const checkSecureStore = async () => {
      try {
        // Retrieve user data from SecureStore
        const storedUserData = await SecureStore.getItemAsync('userData');
        if (storedUserData) {
          // Parse and set the user data if present
          setUserData(JSON.parse(storedUserData));
        }
      } catch (error) {
        console.error('Error reading SecureStore:', error);
      } finally {
        // Stop loading whether data is found or not
        setIsLoading(false);
      }
    };

    checkSecureStore();
  }, []);

  if (isLoading) {
    // Show a loading spinner while checking SecureStore
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // If user data is found, render Home, else render LoginScreen
  return (
    <View style={{ flex: 1 }}>
      {userData ? <Home /> : <LoginScreen />}
    </View>
  );
}
