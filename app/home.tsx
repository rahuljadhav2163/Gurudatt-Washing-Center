import React from 'react';
import { View, Text, Button, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';

export default function Home() {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync('userData');
      Alert.alert('Logged Out', 'You have been logged out successfully.');
      router.replace('/userlogin');
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', 'There was an error logging out. Please try again.');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to the Home Page!</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}
