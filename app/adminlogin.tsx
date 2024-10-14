import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Link } from 'expo-router';

export default function LoginScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Feather name="home" size={24} color="#000" />
          <Text style={styles.logoText}>Washing Center</Text>
        </View>
        <Text style={styles.subtitle}>Your trustble washing center</Text>
        
        <Text style={styles.loginText}>Login</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mob No :</Text>
          <TextInput 
            style={styles.input}
            placeholder="Register mob no"  
            placeholderTextColor="#999"
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
            />
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot?</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <TouchableOpacity style={styles.loginButton}>
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
     
            <Link href='/entry'>
            <Text style={styles.signupLink}>Create now</Text></Link>
        </View>
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
});