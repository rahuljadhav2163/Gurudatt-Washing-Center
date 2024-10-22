import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Animated,
    Dimensions,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;
const HEADER_HEIGHT = Platform.OS === 'ios' ? 90 : 80;
const ServiceShowcase = ({ onPress }) => {
    const translateY = useRef(new Animated.Value(50)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(translateY, {
                toValue: 0,
                tension: 20,
                friction: 7,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <Animated.View
            style={[
                styles.showcaseContainer,
                {
                    opacity,
                    transform: [{ translateY }],
                },
            ]}
        >
            <LinearGradient
                colors={['rgba(107, 90, 224, 0.1)', 'rgba(107, 90, 224, 0.05)']}
                style={styles.showcaseGradient}
            >
                <View style={styles.showcaseContent}>
                    <View style={styles.showcaseHeader}>
                        <Ionicons name="star" size={24} color="#FFB800" />
                        <Text style={styles.showcaseTitle}>Featured Service</Text>
                    </View>
                    <Text style={styles.showcaseDescription}>
                        Premium Ceramic Coating Package
                    </Text>
                    <View style={styles.showcaseDetails}>
                        <Text style={styles.showcasePrice}>₹24,999</Text>
                        <TouchableOpacity
                            style={styles.showcaseButton}
                            onPress={onPress}
                        >
                            <Text style={styles.showcaseButtonText}>Learn More</Text>
                            <Ionicons name="arrow-forward" size={16} color="#6B5AE0" />
                        </TouchableOpacity>
                    </View>
                </View>
            </LinearGradient>
        </Animated.View>
    );
};

const CategoryButton = ({ label, icon, isActive, onPress }) => (
    <TouchableOpacity
        style={[
            styles.categoryButton,
            isActive && styles.categoryButtonActive
        ]}
        onPress={onPress}
    >
        <View style={styles.categoryContent}>
            <Ionicons
                name={icon}
                size={16}
                color={isActive ? '#6B5AE0' : '#FFFFFF'}
                style={styles.categoryIcon}
            />
            <Text style={[
                styles.categoryText,
                isActive && styles.categoryTextActive
            ]}>
                {label}
            </Text>
        </View>
    </TouchableOpacity>
);

const ServiceCard = ({ title, description, price, icon, index, duration, rating, onPress }) => {
    const scaleAnim = useRef(new Animated.Value(0.9)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const glowAnim = useRef(new Animated.Value(0)).current;
    const [isPressed, setIsPressed] = useState(false);

    useEffect(() => {
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 20,
                friction: 7,
                delay: index * 100,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 600,
                delay: index * 100,
                useNativeDriver: true,
            }),
            Animated.loop(
                Animated.sequence([
                    Animated.timing(rotateAnim, {
                        toValue: 1,
                        duration: 3000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(rotateAnim, {
                        toValue: 0,
                        duration: 3000,
                        useNativeDriver: true,
                    }),
                ])
            ),
            Animated.loop(
                Animated.sequence([
                    Animated.timing(glowAnim, {
                        toValue: 1,
                        duration: 2000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(glowAnim, {
                        toValue: 0,
                        duration: 2000,
                        useNativeDriver: true,
                    }),
                ])
            ),
        ]).start();
    }, []);

    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const glowOpacity = glowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
    });

    const cardScale = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        setIsPressed(true);
        Animated.spring(cardScale, {
            toValue: 0.95,
            tension: 40,
            friction: 3,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        setIsPressed(false);
        Animated.spring(cardScale, {
            toValue: 1,
            tension: 40,
            friction: 3,
            useNativeDriver: true,
        }).start();
    };

    return (
        <Animated.View
            style={[
                styles.serviceCard,
                {
                    opacity: opacityAnim,
                    transform: [
                        { scale: scaleAnim },
                        { scale: cardScale }
                    ],
                },
            ]}
        >
            <TouchableOpacity
                activeOpacity={0.95}
                style={styles.cardTouchable}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={onPress}
            >
                <LinearGradient
                    colors={['#6B5AE0', '#5742D7']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.serviceGradient}
                >
                    <Animated.View
                        style={[
                            styles.glowBall,
                            {
                                opacity: glowOpacity,
                                transform: [{ scale: glowAnim }]
                            }
                        ]}
                    />
                    <View style={styles.cardPattern} />

                    <View style={styles.cardHeader}>
                        <Animated.View
                            style={[
                                styles.serviceIcon,
                                { transform: [{ rotate: spin }] }
                            ]}
                        >
                            <LinearGradient
                                colors={['rgba(255, 184, 0, 0.2)', 'rgba(255, 184, 0, 0.1)']}
                                style={styles.iconGradient}
                            >
                                <Ionicons name={icon} size={28} color="#FFB800" />
                            </LinearGradient>
                        </Animated.View>
                        
                        <View style={styles.ratingContainer}>
                            <Ionicons name="star" size={16} color="#FFB800" />
                            <Text style={styles.ratingText}>{rating}</Text>
                        </View>
                    </View>

                    <Text style={styles.serviceTitle}>{title}</Text>
                    <Text style={styles.serviceDescription}>{description}</Text>

                    <View style={styles.serviceInfo}>
                        <View style={styles.durationContainer}>
                            <Ionicons name="time-outline" size={14} color="rgba(255, 255, 255, 0.8)" />
                            <Text style={styles.durationText}>{duration}</Text>
                        </View>
                    </View>

                    <View style={styles.priceContainer}>
                        <LinearGradient
                            colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)']}
                            style={styles.priceGradient}
                        >
                            <Text style={styles.priceLabel}>Premium Service</Text>
                            <Text style={styles.servicePrice}>₹{price}</Text>
                        </LinearGradient>
                    </View>

                    <TouchableOpacity style={styles.actionButton}>
                        <Text style={styles.actionButtonText}>Schedule Now</Text>
                        <Ionicons name="calendar" size={16} color="#FFB800" />
                    </TouchableOpacity>
                </LinearGradient>
            </TouchableOpacity>
        </Animated.View>
    );
};

// Floating action button component
const FloatingButton = ({ onPress }) => {
    const scaleAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 20,
            friction: 7,
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <Animated.View
            style={[
                styles.floatingButton,
                {
                    transform: [{ scale: scaleAnim }]
                }
            ]}
        >
            <TouchableOpacity onPress={onPress}>
                <LinearGradient
                    colors={['#FFB800', '#FF9500']}
                    style={styles.floatingButtonGradient}
                >
                    <Ionicons name="calendar" size={24} color="#FFFFFF" />
                    <Text style={styles.floatingButtonText}>Book Service</Text>
                </LinearGradient>
            </TouchableOpacity>
        </Animated.View>
    );
};

// Main Services component
export default function Services() {
    const scrollY = useRef(new Animated.Value(0)).current;
    const [selectedCategory, setSelectedCategory] = useState('all');

    const categories = [
        { id: 'all', label: 'All Services', icon: 'grid' },
        { id: 'interior', label: 'Interior', icon: 'car' },
        { id: 'exterior', label: 'Exterior', icon: 'color-wand' },
        { id: 'protection', label: 'Protection', icon: 'shield-checkmark' },
        { id: 'maintenance', label: 'Maintenance', icon: 'construct' },
        { id: 'premium', label: 'Premium', icon: 'diamond' },
    ];

    const services = [
        {
            id: '1',
            title: 'Premium Interior',
            description: 'Complete interior restoration with nano-coating protection',
            price: '2,999',
            icon: 'car-sport',
            category: 'interior',
            duration: '4-5 hours',
            rating: 4.9
        },
        {
            id: '2',
            title: 'Ceramic Shield',
            description: 'Professional ceramic coating with 5-year warranty',
            price: '24,999',
            icon: 'shield-checkmark',
            category: 'protection',
            duration: '2-3 days',
            rating: 4.8
        },
        // ... Add all other services from previous list ...
    ];

    const headerTranslateY = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [0, -50],
        extrapolate: 'clamp',
    });

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [1, 0.9],
        extrapolate: 'clamp',
    });

    const filteredServices = selectedCategory === 'all'
        ? services
        : services.filter(service => service.category === selectedCategory);

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#6B5AE0" barStyle="light-content" />

            {/* Animated Header */}
            <Animated.View style={[
                styles.header,
                {
                    transform: [{ translateY: headerTranslateY }],
                    opacity: headerOpacity
                }
            ]}>
                <BlurView intensity={100} style={styles.headerBlur}>
                    <LinearGradient
                        colors={['#6B5AE0', '#5742D7']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.headerGradient}
                    >
                        <View style={styles.headerContent}>
                            <TouchableOpacity
                                style={styles.backButton}
                                onPress={() => router.back()}
                            >
                                <Ionicons name="arrow-back" size={24} color="#FFB800" />
                            </TouchableOpacity>

                            <Text style={styles.headerTitle}>Our Services</Text>

                            <TouchableOpacity style={styles.searchButton}>
                                <Ionicons name="search" size={24} color="#FFB800" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.categoriesContainer}
                            contentContainerStyle={styles.categoriesContent}
                        >
                            {categories.map(category => (
                                <CategoryButton
                                    key={category.id}
                                    label={category.label}
                                    icon={category.icon}
                                    isActive={selectedCategory === category.id}
                                    onPress={() => setSelectedCategory(category.id)}
                                />
                            ))}
                        </ScrollView>
                    </LinearGradient>
                </BlurView>
            </Animated.View>

            {/* Main Content */}
            <Animated.ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}
                scrollEventThrottle={16}
            >
                {/* Featured Service Showcase */}
                <ServiceShowcase onPress={() => {
                    // Handle showcase press
                }} />

                <View style={styles.sectionDescriptionContainer}>
                    <LinearGradient
                        colors={['rgba(107, 90, 224, 0.1)', 'rgba(107, 90, 224, 0.05)']}
                        style={styles.descriptionGradient}
                    >
                        <Ionicons name="star" size={24} color="#FFB800" style={styles.descriptionIcon} />
                        <Text style={styles.sectionDescription}>
                            Premium auto care services for your vehicle
                        </Text>
                    </LinearGradient>
                </View>

                <View style={styles.servicesGrid}>
                    {filteredServices.map((service, index) => (
                        <ServiceCard
                            key={service.id}
                            {...service}
                            index={index}
                            onPress={() => {
                                // Handle service selection
                            }}
                        />
                    ))}
                </View>

                <View style={styles.bottomSpacing} />
            </Animated.ScrollView>

            <FloatingButton onPress={() => {
                // Handle booking
            }} />
        </View>
    );
}

const styles = StyleSheet.create({
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 12,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 184, 0, 0.15)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    ratingText: {
        color: '#FFB800',
        fontSize: 12,
        fontWeight: '600',
    },
    serviceInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 12,
    },
    durationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    durationText: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 12,
    },
    categoryIcon: {
        marginRight: 8,
    },
    categoryButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    serviceCard: {
        width: CARD_WIDTH,
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 8,
        shadowColor: '#6B5AE0',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    cardTouchable: {
        flex: 1,
    },
    serviceGradient: {
        padding: 16,
        height: 240,
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
    },
    glowBall: {
        position: 'absolute',
        top: -50,
        right: -50,
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#FFB800',
        opacity: 0.3,
    },
    cardPattern: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.05,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#FFFFFF',
        borderRadius: 20,
        margin: 8,
    },
    serviceIcon: {
        marginBottom: 12,
    },
    iconGradient: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 184, 0, 0.3)',
    },
    serviceTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 8,
        textAlign: 'center',
    },
    serviceDescription: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        marginBottom: 12,
        lineHeight: 18,
    },
    priceContainer: {
        width: '100%',
        marginBottom: 12,
    },
    priceGradient: {
        padding: 10,
        borderRadius: 12,
        alignItems: 'center',
    },
    priceLabel: {
        fontSize: 11,
        color: '#FFFFFF',
        opacity: 0.8,
        marginBottom: 2,
    },
    servicePrice: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFB800',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 184, 0, 0.15)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 8,
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFB800',
    },
    container: {
        flex: 1
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        elevation: 4,
    },
    headerBlur: {
        overflow: 'hidden',
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
    headerGradient: {
        paddingTop: Platform.OS === 'ios' ? 40 : 20,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    searchButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    categoriesContainer: {
        marginTop: 8,
        marginBottom: 16,
    },
    categoriesContent: {
        paddingHorizontal: 16,
        gap: 8,
    },
    categoryButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    categoryButtonActive: {
        backgroundColor: '#FFB800',
    },
    categoryText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    categoryTextActive: {
        color: '#6B5AE0',
    },
    content: {
        flex: 1,
        paddingTop: HEADER_HEIGHT + 80,
    },
    sectionDescriptionContainer: {
        margin: 16,
        marginBottom: 24,
    },
    descriptionGradient: {
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    descriptionIcon: {
        marginRight: 8,
    },
    sectionDescription: {
        flex: 1,
        fontSize: 16,
        color: '#6B5AE0',
        lineHeight: 24,
    },
    servicesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 16,
        gap: 16,
    },
    serviceCard: {
        width: CARD_WIDTH,
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#6B5AE0',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    cardTouchable: {
        flex: 1,
    },
    serviceGradient: {
        padding: 16,
        height: 200,
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
    },
    serviceIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    serviceTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 8,
        textAlign: 'center',
    },
    serviceDescription: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        marginBottom: 12,
        lineHeight: 18,
    },
    priceContainer: {
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 8,
        borderRadius: 12,
        width: '100%',
    },
    priceLabel: {
        fontSize: 11,
        color: '#FFFFFF',
        opacity: 0.8,
    },
    servicePrice: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFB800',
    },
    glowEffect: {
        position: 'absolute',
        top: -50,
        right: -50,
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255, 184, 0, 0.15)',
        opacity: 0.5,
    },
});