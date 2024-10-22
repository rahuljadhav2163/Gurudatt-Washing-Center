import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Animated,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { BlurView } from 'expo-blur';

const CategoryButton = ({ label, icon, isActive, onPress }) => (
    <TouchableOpacity
        style={[
            styles.categoryButton,
            isActive && styles.categoryButtonActive
        ]}
        onPress={onPress}
    >
        <View>
            <Ionicons
                name={icon}
                size={16}
                color={isActive ? '#6B5AE0' : '#FFFFFF'}
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
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#6B5AE0" barStyle="light-content" />

            
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
        </View>
    );
}

const styles = StyleSheet.create({
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
    }
});