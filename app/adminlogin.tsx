import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export default function LoginScreen() {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    checkUserData();
  }, []);

  const checkUserData = async () => {
    try {
      const storedUserData = await SecureStore.getItemAsync('userData');
      if (storedUserData) {
        setUserData(JSON.parse(storedUserData));
      }
    } catch (error) {
      console.error('Error retrieving user data:', error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://192.168.1.9:5000/api/login", {
        mobile: mobile,
        password: password
      });
      if (response.data.success === true) {
      } else {
        Alert.alert('Login Failed', response.data.message || 'Please check your credentials and try again.');
        await SecureStore.setItemAsync('userData', JSON.stringify(response.data.data));
        setUserData(response.data.data);
        router.replace('/entry');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'An error occurred during login. Please try again.');
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: async () => {
            try {
              await SecureStore.deleteItemAsync('userData');
              setUserData(null);
            } catch (error) {
              console.error('Error logging out:', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderProfile = () => {

    const getInitials = (name) => {
      if (!name) return '';
      const nameParts = name.split(' ');
      const firstInitial = nameParts[0]?.[0] || '';
      const lastInitial = nameParts.length > 1 ? nameParts[nameParts.length - 1][0] : '';
      return `${firstInitial}${lastInitial}`.toUpperCase();
    };
  
    return (
      <View style={styles.profileContainer}>
        <View style={styles.userIcon}>
          <Text style={styles.userIconText}>{getInitials(userData.name)}</Text>
        </View>
        <Text style={styles.profileText}>Welcome, {userData.name}</Text>
        <Text style={styles.profileText}>Mobile: {userData.mobile}</Text>
       
        <TouchableOpacity style={styles.logoutButtons} >
        <Link href='/entry'>
          <Text style={styles.logoutButtonTexts}>Dashboard</Text>
          </Link>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderLoginFields = () => (
    <>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Mob No :</Text>
        <TextInput
          style={styles.input}
          placeholder="Register mob no"
          placeholderTextColor="#999"
          value={mobile}
          onChangeText={setMobile}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            secureTextEntry
            placeholder="Enter your password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot?</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Log In</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>Or continue with</Text>

      <View style={styles.socialButtonsContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <Text style={styles.socialButtonText}>G Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Text style={styles.socialButtonText}>f Facebook</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/signup')}>
          <Text style={styles.signupLink}>Create now</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <MaterialIcons name="local-car-wash" size={24} color="#000" />
          <Text style={styles.logoText}>Gurudatt Washing Center </Text> 
          <MaterialIcons name="local-car-wash" size={24} color="#000" />
        </View>
        <Text style={styles.subtitle}>Your trustble washing center</Text>

        <Text style={styles.loginText}>{userData ? 'Profile' : 'Login'}</Text>

        {userData ? renderProfile() : renderLoginFields()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#cce6ff',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  loginText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
  },
  passwordInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
  forgotPassword: {
    padding: 10,
  },
  forgotPasswordText: {
    color: '#3498db',
  },
  loginButton: {
    backgroundColor: '#000',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  orText: {
    textAlign: 'center',
    marginVertical: 20,
    color: '#666',
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  socialButton: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  socialButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signupText: {
    color: '#666',
  },
  signupLink: {
    color: '#3498db',
    fontWeight: 'bold',
  },
  profileContainer: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 20,
   
  },
  profileText: {
    fontSize: 18,
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: '#000',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButtons:{
    backgroundColor: '#cce6ff',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButtonTexts:{
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userIcon: {
    width: 70,
    height: 70,
    borderRadius: 40,
    backgroundColor: '#cce6ff', 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  
  },
  userIconText: {
    color: '#000',
    fontSize: 30,
    fontWeight: 'bold',
  },
});


