import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Easing,
  Dimensions,
  StatusBar
} from "react-native";
import { Feather } from '@expo/vector-icons';
import { Link, usePathname } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export default function Index() {
  const [isAdminActive, setIsAdminActive] = useState(false);
  const pathname = usePathname();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const gradientAnim = useRef(new Animated.Value(0)).current;

  const bubbleAnims = [...Array(15)].map(() => ({
    position: useRef(new Animated.Value(0)).current,
    scale: useRef(new Animated.Value(0)).current,
    opacity: useRef(new Animated.Value(0)).current,
  }));

  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
  
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 10000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(gradientAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(gradientAnim, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    ).start();

    bubbleAnims.forEach((anim, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(anim.position, {
              toValue: 1,
              duration: 4000 + (index * 500),
              easing: Easing.linear,
              useNativeDriver: true,
            }),
            Animated.timing(anim.scale, {
              toValue: 1,
              duration: 2000 + (index * 500),
              useNativeDriver: true,
            }),
            Animated.timing(anim.opacity, {
              toValue: 0.7,
              duration: 2000 + (index * 500),
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(anim.position, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
            Animated.timing(anim.scale, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
            Animated.timing(anim.opacity, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    });
  }, []);

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const interpolatedRotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <AnimatedLinearGradient
        colors={['#4834D4', '#6C5CE7', '#4834D4']}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        locations={[0, 0.5, 1]}
      />

      <View style={styles.content}>
        {bubbleAnims.map((anim, i) => (
          <Animated.View
            key={i}
            style={[
              styles.bubble,
              {
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: Math.random() * 40 + 10,
                height: Math.random() * 40 + 10,
                transform: [
                  {
                    translateY: anim.position.interpolate({
                      inputRange: [0, 1],
                      outputRange: [height, -100]
                    })
                  },
                  { scale: anim.scale }
                ],
                opacity: anim.opacity
              }
            ]}
          />
        ))}

        <Animated.View
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim }
              ]
            }
          ]}
        >
          <Text style={styles.name}>Welcome to Gurudatt</Text>
          <Text style={styles.subTitle}>Washing Center..!!</Text>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>It's </Text>
            <Text style={styles.titlehead}>Clean</Text>
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>It's </Text>
            <Text style={styles.titlehead}>Shiny</Text>
          </View>
          <Text style={styles.description}>Book from the best On-demand</Text>
          <Text style={styles.description}>Car Washing Service</Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.illustration,
            {
              opacity: fadeAnim,
              transform: [
                { scale: scaleAnim },
                { rotate: interpolatedRotate }
              ]
            }
          ]}
        >
          <Feather name="truck" size={120} color="#FFD700" />
        </Animated.View>

        <Animated.View
          style={[
            styles.button,
            {
              transform: [{ scale: buttonScale }]
            }
          ]}
        >
          <Link
            href='/userlogin'
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={styles.buttonContent}
          >
            <Text style={styles.buttonText}>Get Started</Text>
            <Feather name="arrow-right" size={24} color="white" style={styles.buttonIcon} />
          </Link>
        </Animated.View>
      </View>


      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.bottomBarItem]}
        >
          <Feather name="home" size={24} color={pathname === '/' ? "#FFA500" : "white"} />
          <Text style={[styles.bottomBarText, pathname === '/' && styles.activeBottomBarText]}>Home</Text>
        </TouchableOpacity>
        <Link href='/adminlogin' style={styles.set}>
          <View
            style={[styles.bottomBarItem, isAdminActive && styles.activeBottomBarItem, ]}
          >
            <Feather name="settings" size={24} color={isAdminActive ? "#FFA500" : "white"} />

            <Text style={[styles.bottomBarText, isAdminActive && styles.activeBottomBarText]}>Admin</Text>

          </View>
        </Link>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  set: {
    marginTop: -10 
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  bubble: {
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  contentContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    color: "#FFD700",
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  subTitle: {
    fontSize: 24,
    color: "#FFD700",
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  title: {
    fontSize: 40,
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  titlehead: {
    fontWeight: "bold",
    fontSize: 50,
    color: "#FFD700",
    marginLeft: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  description: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    marginTop: 5,
  },
  illustration: {
    width: 220,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 110,
    marginVertical: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.51,
    shadowRadius: 13.16,
    elevation: 20,
  },
  button: {
    backgroundColor: '#FFA500',
    paddingVertical: 18,
    paddingHorizontal: 36,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    marginTop: -10
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 10,
  },
  buttonIcon: {
    marginLeft: 5,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(108, 92, 231, 0.9)',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
    height: 70
  },
  bottomBarItem: {
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  bottomBarText: {
    color: 'white',
    marginTop: 5,
    fontWeight: "bold",
  },
  activeBottomBarItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  activeBottomBarText: {
    color: "#FFA500",
  },
});