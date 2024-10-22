import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

const ServiceCard = ({ title, description, price, icon }) => (
  <TouchableOpacity style={styles.serviceCard}>
    <LinearGradient
      colors={['#6B5AE0', '#5742D7']}
      style={styles.serviceGradient}
    >
      <View style={styles.serviceIcon}>
        <Ionicons name={icon} size={24} color="#FFB800" />
      </View>
      <Text style={styles.serviceTitle}>{title}</Text>
      <Text style={styles.serviceDescription}>{description}</Text>
      <Text style={styles.servicePrice}>Starting from ₹{price}</Text>
    </LinearGradient>
  </TouchableOpacity>
);

export default function Services() {
  const services = [
    {
      id: '1',
      title: 'Interior Detailing',
      description: 'Deep cleaning of seats, dashboard, and all interior surfaces',
      price: '999',
      icon: 'car-sport'
    },
    {
      id: '2',
      title: 'Paint Protection',
      description: 'Ceramic coating and paint protection film application',
      price: '4999',
      icon: 'color-palette'
    },
    {
      id: '3',
      title: 'Engine Detailing',
      description: 'Thorough cleaning and degreasing of engine bay',
      price: '799',
      icon: 'construct'
    },
    {
      id: '4',
      title: 'Headlight Restoration',
      description: 'Restore cloudy and yellowed headlights',
      price: '599',
      icon: 'flashlight'
    },
    {
      id: '5',
      title: 'Wheel & Tire Service',
      description: 'Deep cleaning and protection for wheels and tires',
      price: '399',
      icon: 'disc'
    },
    {
      id: '6',
      title: 'Scratch Removal',
      description: 'Professional scratch and swirl mark removal',
      price: '1499',
      icon: 'brush'
    },
    {
      id: '7',
      title: 'AC Sanitization',
      description: 'Complete AC vent and system sanitization',
      price: '699',
      icon: 'snow'
    },
    {
      id: '8',
      title: 'Rust Protection',
      description: 'Anti-rust coating and treatment',
      price: '2999',
      icon: 'shield'
    }
  ];

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#6B5AE0" />
      <LinearGradient
        colors={['#6B5AE0', '#5742D7']}
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFB800" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Our Services</Text>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionDescription}>
          Explore our comprehensive range of professional cleaning and maintenance services
        </Text>
        
        <View style={styles.servicesGrid}>
          {services.map(service => (
            <ServiceCard
              key={service.id}
              title={service.title}
              description={service.description}
              price={service.price}
              icon={service.icon}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5742D7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 56,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFB800',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.8,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  serviceCard: {
    width: '48%',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  serviceGradient: {
    padding: 16,
    height: 180,
    alignItems: 'center',
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFB800',
    marginBottom: 8,
    textAlign: 'center',
  },
  serviceDescription: {
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: 8,
  },
  servicePrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});