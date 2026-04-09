import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Image, Animated } from 'react-native';
import { useAudio } from './AudioProvider';

interface RoadNodeProps {
  id: string;
  title: string;
  isUnlocked: boolean;
  isCompleted: boolean;
  onPress: () => void;
  index: number;
  variant?: 'default' | 'challenge';
}

export const RoadNode: React.FC<RoadNodeProps> = ({ 
  title, 
  isUnlocked, 
  isCompleted, 
  onPress, 
  index,
  variant = 'default'
}) => {
  const isEven = index % 2 === 0;
  const { playEffect } = useAudio();
  
  // Primary Pulse Animation (Shield)
  const pulseAnim = useRef(new Animated.Value(1)).current;
  // Secondary Halo Animation (Master Glow)
  const haloAnim = useRef(new Animated.Value(0)).current;
  // Challenge Flicker Animation
  const flickerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (variant === 'challenge') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(flickerAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
          Animated.timing(flickerAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
        ])
      ).start();
    }

    if (isCompleted) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 0.8, duration: 1500, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: true })
        ])
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(haloAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
          Animated.timing(haloAnim, { toValue: 0, duration: 2000, useNativeDriver: true })
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
      haloAnim.setValue(0);
    }
  }, [isCompleted, variant]);

  const haloScale = haloAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.4],
  });

  const haloOpacity = haloAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.1, 0.4],
  });

  const handlePress = () => {
    // Audio trigger removed from map nodes to prevent early firing
    onPress();
  };

  const containerStyle = isEven 
    ? { ...styles.nodeContainer, ...styles.alignLeft } 
    : { ...styles.nodeContainer, ...styles.alignRight };

  const titleStyle = !isUnlocked 
    ? { ...styles.title, ...styles.lockedText } 
    : styles.title;

  return (
    <View style={containerStyle}>
      <TouchableOpacity
        style={[
          styles.node,
          isCompleted ? styles.nodeGlowing : null,
          variant === 'challenge' ? styles.challengeNode : null
        ]}
        onPress={isUnlocked ? handlePress : undefined}
        activeOpacity={0.7}
      >
        {/* PURPLE MASTER HALO (Behind Shield) */}
        {isCompleted && variant === 'default' && (
          <Animated.View 
            style={[
              styles.halo, 
              { 
                transform: [{ scale: haloScale }],
                opacity: haloOpacity
              }
            ]} 
          />
        )}

        {/* RED CHALLENGE HALO */}
        {variant === 'challenge' && (
          <Animated.View 
            style={[
              styles.challengeHalo,
              { opacity: flickerAnim.interpolate({ inputRange: [0, 1], outputRange: [0.2, 0.8] }) }
            ]}
          />
        )}

        <Animated.View style={{ opacity: isCompleted ? pulseAnim : 1 }}>
          <Image 
            source={require('../../assets/branding/escudo.png')}
            style={[
              styles.image,
              !isUnlocked ? styles.imageLocked : null,
              isCompleted ? styles.imageCompleted : null,
              variant === 'challenge' ? { tintColor: '#ff4b4b' } : null
            ]}
            resizeMode="contain"
          />
        </Animated.View>
        {!isUnlocked && variant !== 'challenge' && (
           <View style={styles.lockOverlay}>
             <Text style={styles.lockIcon}>🔒</Text>
           </View>
        )}

        {variant === 'challenge' && (
          <View style={styles.challengeIcon}>
             <Text style={styles.challengeIconText}>⚡</Text>
          </View>
        )}
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={titleStyle}>{title}</Text>
        {isCompleted && <Text style={styles.completedTag}>// SINCRONIZADO</Text>}
        {variant === 'challenge' && <Text style={styles.challengeTag}>// FIREWALL_CHALLENGE</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  nodeContainer: {
    paddingVertical: 35,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  alignLeft: {
    justifyContent: 'flex-start',
  },
  alignRight: {
    justifyContent: 'flex-end',
    flexDirection: 'row-reverse',
  },
  node: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderRadius: 40,
  },
  nodeGlowing: {
    shadowColor: '#00d4ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#00d4ff',
  },
  challengeNode: {
    borderColor: '#ff4b4b',
    borderWidth: 2,
    shadowColor: '#ff4b4b',
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 10,
  },
  halo: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#bf00ff',
    zIndex: -1,
  },
  challengeHalo: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#ff4b4b',
    zIndex: -1,
  },
  image: {
    width: 65,
    height: 65,
    zIndex: 2,
  },
  imageLocked: {
    opacity: 0.2,
    tintColor: '#444',
  },
  imageCompleted: {
    opacity: 1,
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
  },
  lockIcon: {
    fontSize: 14,
    color: '#888',
  },
  challengeIcon: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#ff4b4b',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
    zIndex: 10,
  },
  challengeIconText: {
    fontSize: 12,
    color: '#fff',
  },
  textContainer: {
    marginHorizontal: 20,
    maxWidth: 150,
    zIndex: 5,
  },
  title: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'RobotoMono_700Bold',
  },
  lockedText: {
    color: '#333',
  },
  completedTag: {
    color: '#00ff9f',
    fontSize: 8,
    fontFamily: 'RobotoMono_400Regular',
    marginTop: 4,
    letterSpacing: 1,
  },
  challengeTag: {
    color: '#ff4b4b',
    fontSize: 8,
    fontFamily: 'RobotoMono_400Regular',
    marginTop: 4,
    letterSpacing: 0.5,
  },
});
