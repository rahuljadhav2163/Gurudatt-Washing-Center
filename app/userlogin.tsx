import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import * as SecureStore from 'expo-secure-store';
import { Link, useRouter } from 'expo-router';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

const LoginScreen = () => {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false); 
  const router = useRouter();

  const handleLogin = async () => {
    if (!mobile || !password) {
        Alert.alert('Message', 'Please enter both mobile and password');
        return;
    }
    setIsLoggingIn(true); 
    try {
        const response = await axios.post("https://washcenter-backend.vercel.app/api/signin", {
            mobile: mobile,
            password: password,
        });
        if (response.data.success) {
            const userDataToStore = JSON.stringify(response.data.data);
            await SecureStore.setItemAsync('userprofile', userDataToStore);
            Alert.alert('Login Successful', 'You are now logged in.');
            router.replace('/render'); 
        } else {
            Alert.alert('Login Failed', response.data.message || 'Invalid credentials');
        }
    } catch (error) {
        let errorMessage = 'An error occurred during login. Please try again.';
       
        if (error.response) {
       
            errorMessage = error.response.data.message || 'Server error. Please try again.';
        } else if (error.request) {
            errorMessage = 'No response from server. Please check your network connection.';
        } else {
            errorMessage = error.message;
        }
        Alert.alert('Error', errorMessage);
    } finally {
        setIsLoggingIn(false); 
    }
};

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <Text style={styles.loginText}>Login</Text>

        <View style={styles.card}>
          <Text style={styles.helloText}>Welcome back..!!</Text>

          <View style={styles.inputContainer}>
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
          </View>

          <TouchableOpacity>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={isLoggingIn}>
          {isLoggingIn ? (
            <ActivityIndicator size="small" color="white" style={styles.loginButtonIcon} />
          ) : (
            <>
              <Text style={styles.loginButtonText}>Login</Text>
              <Icon name="arrow-right" size={20} color="white" style={styles.loginButtonIcon} />
            </>
          )}
        </TouchableOpacity>

        <View style={styles.signupContainer}>
          <Text style={styles.newUserText}>New User? </Text>
          
          <TouchableOpacity>
            <Link href="/usersignup">
              <Text style={styles.signupText}>Sign Up</Text>
            </Link>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <View style={styles.diagonalBg} />
    </SafeAreaView>
  );
};

const InputField = ({ icon, ...props }) => (
  <View style={styles.inputWrapper}>
    <Icon name={icon} size={20} color="#666" style={styles.inputIcon} />
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
  loginText: {
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
  helloText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
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
  forgotText: {
    color: '#666',
    fontSize: 14,
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  loginButton: {
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
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  loginButtonIcon: {
    marginLeft: 8,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  newUserText: {
    color: 'white',
    fontSize: 14,
  },
  signupText: {
    color: 'white',
    fontSize: 16,
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

export default LoginScreen;
