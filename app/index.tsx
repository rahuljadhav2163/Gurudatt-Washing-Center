import React, { useState, useEffect, useRef } from 'react';
import { 
  Text, 
  View, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView,
  Animated,
  Easing,
  Dimensions
} from "react-native";
import carbg from "./rbgcar.png";
import { Feather } from '@expo/vector-icons';
import { Link, usePathname } from 'expo-router';

export default function Index() {
  const [isAdminActive, setIsAdminActive] = useState(false);
  const pathname = usePathname();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const bubbleAnims = [...Array(10)].map(() => ({
    position: useRef(new Animated.Value(0)).current,
    scale: useRef(new Animated.Value(0)).current
  }));

  // Button animation
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entrance animations
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

    // Bubble animations
    bubbleAnims.forEach((anim, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(anim.position, {
              toValue: 1,
              duration: 3000 + (index * 500),
              easing: Easing.linear,
              useNativeDriver: true,
            }),
            Animated.timing(anim.scale, {
              toValue: 1,
              duration: 1500 + (index * 500),
              useNativeDriver: true,
            })
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
            })
          ])
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {bubbleAnims.map((anim, i) => (
            <Animated.View 
              key={i} 
              style={[
                styles.bubble,
                {
                  top: `${Math.random() * 70}%`,
                  left: `${Math.random() * 80}%`,
                  width: Math.random() * 30 + 10,
                  height: Math.random() * 30 + 10,
                  transform: [
                    {
                      translateY: anim.position.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -100]
                      })
                    },
                    {
                      scale: anim.scale
                    }
                  ],
                  opacity: anim.scale
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
            <Text style={styles.name}>Welcome to Gurudatt Washing Center..!!</Text>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Its </Text>
              <Text style={styles.titlehead}>Clean</Text>
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.titles}>Its </Text>
              <Text style={styles.titleheads}>Shiny</Text>
            </View>
            <Text style={styles.description}>Book from the best On-demand</Text>
            <Text style={styles.description}>Car Washing Service</Text>
          </Animated.View>
          
          <Animated.Image 
            source={carbg} 
            style={[
              styles.illustration,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }]
              }
            ]} 
          />
          
          <Animated.View
            style={[
              styles.button,
              {
                transform: [{ scale: buttonScale }]
              }
            ]}
          >
            <TouchableOpacity 
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              style={styles.buttonContent}
            >
              <Text style={styles.buttonText}>Get Started</Text>
              <Feather name="arrow-right" size={24} color="white" style={styles.buttonIcon} />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
      
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={[styles.bottomBarItem, pathname === '/' && styles.activeBottomBarItem]}
        >
          <Feather name="home" size={24} color={pathname === '/' ? "#FFA500" : "white"} />
          <Text style={[styles.bottomBarText, pathname === '/' && styles.activeBottomBarText]}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.bottomBarItem, isAdminActive && styles.activeBottomBarItem]}
          onPress={() => setIsAdminActive(!isAdminActive)}
        >
          <Link href='/adminlogin'>
            <Feather name="settings" size={24} color={isAdminActive ? "#FFA500" : "white"} />
          </Link>
          <Text style={[styles.bottomBarText, isAdminActive && styles.activeBottomBarText]}>Admin</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4A90E2',
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
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  contentContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: '#4A90E2',
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
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  contentContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  title: {
    fontSize: 35,
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  },
  titles: {
    fontSize: 35,
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  },
  titlehead: {
    fontWeight: "bold",
    fontSize: 45,
    color: "#ffff99",
    marginLeft: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  },
  titleheads: {
    fontWeight: "bold",
    fontSize: 45,
    color: "#ffff99",
    marginLeft: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  },
  description: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginTop: 0,
  },
  button: {
    backgroundColor: '#FFA500',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  buttonIcon: {
    marginLeft: 5,
  },
  illustration: {
    width: 300,
    height: 250,
    resizeMode: 'contain',
    marginVertical: 20,
    marginTop:-20
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#80b3ff',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
  },
  bottomBarItem: {
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  bottomBarText: {
    color: 'white',
    marginTop: 5,
    fontWeight: "bold",
  },
  activeBottomBarText: {
    color: "#FFA500",
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: "#ffff00",
    marginBottom: 10,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
    marginTop:50
  },
  infoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 10,
    marginVertical: 20,
    alignSelf: 'stretch',
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 16,
    color: 'white',
    marginBottom: 5,
  },
});