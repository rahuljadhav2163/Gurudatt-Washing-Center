import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function UserSignup() {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateInputs = () => {
    if (!name || !mobile || !password || !confirmPassword) {
      throw new Error('Please fill in all fields');
    }
    if (mobile.length !== 10 || !/^\d+$/.test(mobile)) {
      throw new Error('Please enter a valid 10-digit mobile number');
    }
    if (name.length < 3) {
      throw new Error('Name must be at least 3 characters long');
    }
    if (password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
  };

  const handleSignup = async () => {
   // Initialize router for navigation
    setIsLoading(true);
  
    try {
      validateInputs(); // Ensure inputs are valid before proceeding
  
      const response = await axios.post(
        "https://washcenter-backend.vercel.app/api/register",
        { mobile, password, name },
        { timeout: 10000 } // 10-second timeout
      );
  
      if (response.data.success) {
        // Combine the user data into one object
        const userData = { mobile, name };
  
        // Save user data in SecureStore as a JSON string under one key
        await SecureStore.setItemAsync('userData', JSON.stringify(userData));

        Alert.alert('Success', 'Account created successfully!');
        setConfirmPassword('');
        setMobile('');
        setName('');
        setPassword('');
        router.replace('/render');
        // Navigate to the /render page
         // Replace the current page with /render
      } else {
        throw new Error(response.data.message || 'Failed to create account');
      }
    } catch (error) {
      let errorMessage = 'An unexpected error occurred. Please try again.';
  
      // Check if the error is an Axios response error
      if (error.response) {
        // Server responded with an error status code (e.g., 400 or 500)
        errorMessage = error.response.data.message || 'Server error. Please try again.';
      } else if (error.request) {
        // Request was made but no response was received
        errorMessage = 'No response from server. Please check your network connection.';
      } else {
        // Other unknown errors or validation errors
        errorMessage = error.message;
      }
  
      // Display the error message to the user
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false); // Stop loading spinner
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.signupText}>Sign Up</Text>

          <View style={styles.card}>
            <Text style={styles.welcomeText}>Welcome to Gurudatt</Text>
            <Text style={styles.subTitle}>Washing Center..!!</Text>

            <View style={styles.inputContainer}>
              <InputField
                icon="person"
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
              />
              <InputField
                icon="phone"
                placeholder="Mobile Number"
                value={mobile}
                onChangeText={setMobile}
                keyboardType="phone-pad"
              />
              <InputField
                icon="lock"
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <InputField
                icon="lock"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.signupButton}
            onPress={handleSignup}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Text style={styles.signupButtonText}>Sign Up</Text>
                <MaterialIcons name="arrow-forward" size={20} color="white" style={styles.signupButtonIcon} />
              </>
            )}
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <Link href="/userlogin">
              <Text style={styles.loginLinkText}>Login</Text>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={styles.diagonalBg} />
    </SafeAreaView>
  );
}

const InputField = ({ icon, ...props }) => (
  <View style={styles.inputWrapper}>
    <MaterialIcons name={icon} size={24} color="#666" style={styles.inputIcon} />
    <TextInput
      {...props}
      placeholderTextColor="#999"
      style={styles.input}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4834D4',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  signupText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    gap: 16,
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 8,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 8,
  },
  signupButton: {
    backgroundColor: '#4834D4',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  signupButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  signupButtonIcon: {
    marginLeft: 8,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginText: {
    color: 'white',
    fontSize: 14,
  },
  loginLinkText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  diagonalBg: {
    position: 'absolute',
    width: width * 2,
    height: height * 1.5,
    backgroundColor: '#6C5CE7',
    transform: [{ rotate: '15deg' }],
    top: height * 0.35,
    left: -width * 0.5,
    zIndex: -1,
  },
});