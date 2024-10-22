import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Platform,
  Animated,
  Dimensions,
  Image,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const ProfileModal = ({ visible, onClose, profileData, isLoading, error }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(profileData);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setEditedData(profileData);
  }, [profileData]);

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Validate required fields
      if (!editedData.name || !editedData.email || !editedData.phone) {
        Alert.alert('Error', 'Name, email, and phone are required fields');
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editedData.email)) {
        Alert.alert('Error', 'Please enter a valid email address');
        return;
      }

      // Validate phone format (simple validation)
      const phoneRegex = /^\+?[\d\s-]{10,}$/;
      if (!phoneRegex.test(editedData.phone)) {
        Alert.alert('Error', 'Please enter a valid phone number');
        return;
      }

      await SecureStore.setItemAsync('userProfile', JSON.stringify(editedData));
      Alert.alert('Success', 'Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile changes');
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5742D7" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="#FF4444" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => fetchProfileData()}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <ScrollView style={styles.profileInfo}>
        <View style={styles.avatarContainer}>
          <LinearGradient
            colors={['#6B5AE0', '#5742D7']}
            style={styles.avatarGradient}
          >
            <Text style={styles.avatarText}>
              {editedData?.name ? editedData.name[0].toUpperCase() : '?'}
            </Text>
          </LinearGradient>
        </View>

        <View style={styles.infoContainer}>
          <ProfileField
            icon="person"
            label="Name"
            value={editedData?.name}
            isEditing={isEditing}
            onChangeText={(text) => setEditedData({ ...editedData, name: text })}
            placeholder="Enter your name"
          />
          <ProfileField
            icon="mail"
            label="Email"
            value={editedData?.email}
            isEditing={isEditing}
            onChangeText={(text) => setEditedData({ ...editedData, email: text })}
            placeholder="Enter your email"
            keyboardType="email-address"
          />
          <ProfileField
            icon="call"
            label="Phone"
            value={editedData?.phone}
            isEditing={isEditing}
            onChangeText={(text) => setEditedData({ ...editedData, phone: text })}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
          />
          <ProfileField
            icon="location"
            label="Address"
            value={editedData?.address}
            isEditing={isEditing}
            onChangeText={(text) => setEditedData({ ...editedData, address: text })}
            placeholder="Enter your address"
            multiline
          />
        </View>

        {isEditing ? (
          <View style={styles.editButtons}>
            <TouchableOpacity
              style={[styles.editButton, styles.cancelButton]}
              onPress={() => {
                setEditedData(profileData);
                setIsEditing(false);
              }}
            >
              <Text style={styles.editButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.editButton, styles.saveButton]}
              onPress={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.editButtonText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.editButton, styles.editModeButton]}
            onPress={() => setIsEditing(true)}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          <LinearGradient
            colors={['#6B5AE0', '#5742D7']}
            style={styles.modalHeader}
          >
            <Text style={styles.modalTitle}>Profile</Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              disabled={isSaving}
            >
              <Ionicons name="close" size={24} color="#FFB800" />
            </TouchableOpacity>
          </LinearGradient>

          {renderContent()}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// Profile Field Component
const ProfileField = ({
  icon,
  label,
  value,
  isEditing,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  multiline = false,
}) => (
  <View style={styles.infoItem}>
    <View style={styles.infoLabel}>
      <Ionicons name={icon} size={20} color="#5742D7" />
      <Text style={styles.infoLabelText}>{label}</Text>
    </View>
    {isEditing ? (
      <TextInput
        style={[
          styles.input,
          multiline && styles.multilineInput,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999"
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
      />
    ) : (
      <Text style={styles.infoValue}>{value || 'Not set'}</Text>
    )}
  </View>
);

const PackageCard = ({ title, price, features, onPress }) => (
  <TouchableOpacity style={styles.packageCard} onPress={onPress}>
    <LinearGradient
      colors={['#6B5AE0', '#5742D7']}
      style={styles.packageGradient}
    >
      <Text style={styles.packageTitle}>{title}</Text>
      <Text style={styles.packagePrice}>₹{price}</Text>
      <View style={styles.featuresContainer}>
        {features.map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={16} color="#FFB800" />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.selectButton}>
        <Text style={styles.selectButtonText}>Select Package</Text>
      </TouchableOpacity>
    </LinearGradient>
  </TouchableOpacity>
);

const carPackages = [
  {
    id: '1',
    title: 'Basic Wash',
    price: '299',
    features: [
      'Exterior Washing',
      'Interior Vacuum',
      'Tire Cleaning',
      'Window Cleaning'
    ]
  },
  {
    id: '2',
    title: 'Premium Wash',
    price: '599',
    features: [
      'Basic Wash Features',
      'Interior Detailing',
      'Wax Protection',
      'Dashboard Polish'
    ]
  },
  {
    id: '3',
    title: 'Ultimate Detail',
    price: '999',
    features: [
      'Premium Wash Features',
      'Paint Protection',
      'Leather Treatment',
      'Engine Bay Cleaning'
    ]
  }
];
const otherPackages = [
  {
    id: '1',
    title: 'Bus Wash',
    price: '1499',
    features: [
      'Exterior Washing',
      'Interior Cleaning',
      'Window Cleaning',
      'Floor Mopping'
    ]
  },
  {
    id: '2',
    title: 'Truck Wash',
    price: '1999',
    features: [
      'Exterior Washing',
      'Chassis Cleaning',
      'Tire Cleaning',
      'Cargo Area Wash'
    ]
  },
  {
    id: '3',
    title: 'Heavy Vehicle',
    price: '2499',
    features: [
      'Complete Exterior Wash',
      'Underbody Cleaning',
      'Engine Degreasing',
      'Interior Detailing'
    ]
  }
];

const bikePackages = [
  {
    id: '1',
    title: 'Quick Wash',
    price: '149',
    features: [
      'Exterior Washing',
      'Chain Lubrication',
      'Basic Polish'
    ]
  },
  {
    id: '2',
    title: 'Deep Clean',
    price: '299',
    features: [
      'Quick Wash Features',
      'Detailed Polish',
      'Engine Degreasing',
      'Rust Protection'
    ]
  }
];



export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('1');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLogoutVisible, setIsLogoutVisible] = useState(false);
  const slideAnimation = new Animated.Value(0);

  const renderPackages = () => {
    const packages = selectedCategory === '1' ? carPackages :
      selectedCategory === '2' ? bikePackages :
        selectedCategory === '3' ? otherPackages :
          [];

    if (packages.length === 0) return null;

    return (
      <View style={styles.packagesSection}>
        <Text style={styles.sectionTitle}>Available Packages</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.packagesScrollView}
        >
          {packages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              title={pkg.title}
              price={pkg.price}
              features={pkg.features}
              onPress={() => Alert.alert('Package Selected', `You selected the ${pkg.title} package.`)}
            />
          ))}
        </ScrollView>
      </View>
    );
  };


  const handleLogout = async () => {
    Alert.alert(
      'Logout Confirmation',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              await SecureStore.deleteItemAsync('userData');
              setIsLogoutVisible(false);
              // Navigate to login screen or handle logout as needed
              router.replace('/userlogin'); // Assuming you have a Login screen
            } catch (error) {
              console.error('Error logging out:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };
  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const profileString = await SecureStore.getItemAsync('userProfile');
      if (profileString) {
        setProfileData(JSON.parse(profileString));
      } else {
        setProfileData({
          name: '',
          email: '',
          phone: '',
          address: '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle profile button press
  const handleProfilePress = () => {
    fetchProfileData();
    setIsProfileVisible(true);
  };

  // Update the profile button in the header
  const profileButton = (
    <TouchableOpacity style={styles.profileButton} onPress={handleProfilePress}>
      <LinearGradient
        colors={['#6B5AE0', '#5742D7']}
        style={styles.profileGradient}
      >
        <Ionicons name="person" size={20} color="#FFB800" />
      </LinearGradient>
    </TouchableOpacity>
  );

  const slides = [
    {
      id: '1',
      title: '30% Off',
      subtitle: 'Car Wash',
      description: 'Special Offers',
      image: 'http://shop.gardenstatehonda.com/wp-content/uploads/sites/21/2020/05/car-wash-2.jpg', // Replace with actual image URL
    },
    {
      id: '2',
      title: '20% Off',
      subtitle: 'Bike Wash',
      description: 'Weekend Special',
      image: 'https://www.vdxdetailing.com/wp-content/uploads/2021/04/woman-washing-her-urban-bike-in-carwash.jpg', // Replace with actual image URL
    },
    {
      id: '3',
      title: '15% Off',
      subtitle: 'Others Vehicle',
      description: 'New Customers',
      image: 'https://thumbs.dreamstime.com/b/elderly-man-washing-bus-amoy-city-china-40936605.jpg', // Replace with actual image URL
    },
  ];

  const categories = [
    { id: '1', name: 'Car Wash', icon: 'car-outline' },
    { id: '2', name: 'Bike Wash', icon: 'extension-puzzle' },
    { id: '3', name: 'Others', icon: 'water-outline' },
    { id: '4', name: 'Services', icon: 'settings-outline' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prevIndex) =>
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    Animated.timing(slideAnimation, {
      toValue: -currentSlideIndex * width,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [currentSlideIndex]);

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <StatusBar backgroundColor="#6B5AE0" />
        <View style={styles.header}>
          <View style={styles.locationContainer}>
            <View style={styles.locationIconContainer}>
              <LinearGradient
                colors={['#5742D7', '#5742D7']}
                style={styles.locationIconGradient}
              >
                <Ionicons name="location" size={20} color="#FFB800" />
              </LinearGradient>
            </View>
            <View style={styles.locationTextContainer}>
              <Text style={styles.locationTitle}>Gurudatt Washing Center</Text>
              <Text style={styles.locationSubtitle}>18, Narhegaon, Pune</Text>
            </View>
            {profileButton}
            <TouchableOpacity
              style={styles.dropdownIcon}
              onPress={() => setIsLogoutVisible(true)}
            >
              <Text onPress={handleLogout}>
                <Ionicons name="arrow-forward-circle" size={35} color="#ff4d4d" />
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sliderContainer}>
          <Animated.View
            style={[
              styles.slidesWrapper,
              {
                transform: [{ translateX: slideAnimation }],
              },
            ]}
          >
            {slides.map((slide, index) => (
              <View key={slide.id} style={styles.slide}>
                <View

                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.slideGradient}
                >
                  <View style={styles.slideContent}>
                    <View>
                      <Text style={styles.slideTitle}>{slide.title}</Text>
                      <Text style={styles.slideSubtitle}>{slide.subtitle}</Text>
                      <Text style={styles.slideDescription}>{slide.description}</Text>
                    </View>
                    <TouchableOpacity style={styles.bookNowButton}>
                      <Text style={styles.bookNowText}>Book Now</Text>
                    </TouchableOpacity>
                  </View>
                  <Image
                    source={{ uri: slide.image }}
                    style={styles.slideImage}
                    resizeMode="cover"
                  />
                </View>
              </View>
            ))}
          </Animated.View>
          <View style={styles.paginationDots}>
            {slides.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  currentSlideIndex === index && styles.activeDot,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Categories */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>All Categories</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryItem,
                  selectedCategory === category.id && styles.categoryItemActive
                ]}
                onPress={() => {
                  if (category.id === '4') {
                    router.replace('/services');
                  } else {
                    setSelectedCategory(category.id);
                  }
                }}
              >
                <LinearGradient
                  colors={selectedCategory === category.id ?
                    ['#6B5AE0', '#5742D7'] :
                    ['#7B6BE0', '#6B5AE0']}
                  style={styles.categoryIconContainer}
                >
                  <Ionicons
                    name={category.icon}
                    size={22}
                    color={selectedCategory === category.id ? '#FFB800' : '#FFFFFF'}
                  />
                </LinearGradient>
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.categoryTextActive
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {renderPackages()}
        <ProfileModal
          visible={isProfileVisible}
          onClose={() => setIsProfileVisible(false)}
          profileData={profileData}
          isLoading={isLoading}
          error={error}
        />

      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  packagesSection: {
    paddingTop: 10,
    paddingBottom: 2,
  },
  packagesScrollView: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  packageCard: {
    width: 280,
    marginRight: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  packageGradient: {
    padding: 16,
    height: 280,
  },
  packageTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFB800',
    marginBottom: 8,
  },
  packagePrice: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  featuresContainer: {
    flex: 1,
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  selectButton: {
    backgroundColor: '#FFB800',
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 16,
  },
  selectButtonText: {
    color: '#5742D7',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  modalTitle: {
    color: '#FFB800',
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    padding: 4,
  },
  profileInfo: {
    padding: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFB800',
    fontSize: 32,
    fontWeight: '700',
  },
  infoContainer: {
    gap: 16,
  },
  infoItem: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 12,
  },
  infoLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  infoLabelText: {
    color: '#5742D7',
    fontSize: 14,
    fontWeight: '600',
  },
  infoValue: {
    color: '#333',
    fontSize: 16,
    marginLeft: 28,
  },
  input: {
    marginLeft: 28,
    fontSize: 16,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#5742D7',
    padding: 4,
  },
  multilineInput: {
    height: 60,
    textAlignVertical: 'top',
  },
  editButton: {
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  editModeButton: {
    backgroundColor: '#5742D7',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    flex: 1,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: '#FF4444',
    flex: 1,
    marginRight: 8,
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#5742D7',
    fontSize: 16,
  },
  errorContainer: {
    padding: 40,
    alignItems: 'center',
  },
  errorText: {
    marginTop: 12,
    color: '#FF4444',
    fontSize: 16,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#5742D7',
    padding: 12,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  dropdownIcon: {
    color: "white"
  },
  container: {
    flex: 1,
    backgroundColor: '#5742D7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 56,
    paddingBottom: 10,
    backgroundColor: '#6B5AE0',

  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationIconContainer: {
    marginRight: 8,
  },
  locationIconGradient: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationTextContainer: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFB800',
  },
  locationSubtitle: {
    fontSize: 13,
    color: '#FFFFFF',
    marginTop: 2,
  },
  profileButton: {
    marginRight: 10,
  },
  profileGradient: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderContainer: {
    height: 210,
    overflow: 'hidden',
    marginTop: 10
  },
  slidesWrapper: {
    flexDirection: 'row',
    height: 180,
  },
  slide: {
    width: width,
    paddingHorizontal: 16,

  },
  slideGradient: {
    flex: 1,
    borderRadius: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    padding: 16,
    backgroundColor: "#ff8c1a"

  },
  slideContent: {
    flex: 1,
    justifyContent: 'space-between',

  },
  slideImage: {
    width: 190,
    height: '100%',
    borderRadius: 8,
  },
  slideTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: 'yellow',
    marginBottom: 4,
  },
  slideSubtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  slideDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  bookNowButton: {
    backgroundColor: 'yellow',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    alignSelf: 'flex-start',
    marginTop: 16,
  },
  bookNowText: {
    color: '#5742D7',
    fontSize: 14,
    fontWeight: '600',
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: '#FFB800',
    width: 18,
  },
  categoriesSection: {
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 16,
    marginBottom: 16,
    color: '#FFB800',
  },
  categoriesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
  },
  categoryItem: {
    alignItems: 'center',
  },
  categoryIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#FFB800',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  categoryText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#FFB800',
    fontWeight: '600',
  },
});