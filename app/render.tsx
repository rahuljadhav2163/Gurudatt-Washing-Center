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
        const storedUserData = await SecureStore.getItemAsync('userprofile');
        if (storedUserData) {
          setUserData(JSON.parse(storedUserData));
        }
      } catch (error) {
        console.error('Error reading SecureStore:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkSecureStore();
  }, []);

  if (isLoading) {

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  return (
    <View style={{ flex: 1 }}>
      {userData ? <Home /> : <LoginScreen />}
    </View>
  );
}
