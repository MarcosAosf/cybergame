import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Image, Animated } from 'react-native';
import { useAudio } from '../hooks/useAudio';

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
  const { playEffect } = useAudio();

  // Primary Pulse Animation (Shield)
  const pulseAnim = useRef(new Animated.Value(1)).current;
  // Secondary Halo Animation (Master Glow)
  const haloAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Reset any ongoing animations
    pulseAnim.stopAnimation();
    pulseAnim.setValue(1);
    haloAnim.stopAnimation();
    haloAnim.setValue(0);

    // Pulse if completed OR if it's an unlocked challenge (next goal)
    const shouldPulse = isCompleted || (variant === 'challenge' && isUnlocked);

    if (shouldPulse) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.08, duration: 1000, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true })
        ])
      ).start();

      if (isCompleted) {
        Animated.loop(
          Animated.sequence([
            Animated.timing(haloAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
            Animated.timing(haloAnim, { toValue: 0, duration: 2000, useNativeDriver: true })
          ])
        ).start();
      }
    }
  }, [isCompleted, isUnlocked, variant]);

  const haloScale = haloAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.4],
  });

  const haloOpacity = haloAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.1, 0.4],
  });

  const handlePress = () => {
    onPress();
  };

  const isEven = index % 2 === 0;
  const containerStyle = [
    styles.nodeContainer,
    isEven ? styles.alignLeft : styles.alignRight
  ];

  const titleStyle = [
    styles.title,
    !isUnlocked ? styles.lockedText : null
  ];

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

        {/* BLUE/SILVER CHALLENGE HALO - Steady Glow */}
        {variant === 'challenge' && (
          <View style={[styles.challengeHalo, { opacity: 0.4 }]} />
        )}

        <Animated.View 
          style={{ 
            transform: [{ scale: (isCompleted || (variant === 'challenge' && isUnlocked)) ? pulseAnim : 1 }],
            opacity: isCompleted || (variant === 'challenge' && isUnlocked) ? 1 : 0.8
          }}
        >
          <Image
            source={variant === 'challenge' ? require('../../assets/badges/certificacao1.png') : require('../../assets/branding/escudo.png')}
            style={[
              variant === 'challenge' ? styles.challengeImage : styles.image,
              !isUnlocked ? (variant === 'challenge' ? styles.challengeImageLocked : styles.imageLocked) : null,
              isCompleted ? styles.imageCompleted : null
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
            <Text style={styles.challengeIconText}>★</Text>
          </View>
        )}
      </TouchableOpacity>
      <View style={[styles.textContainer, isEven ? { marginLeft: 20 } : { marginRight: 20 }]}>
        <Text style={variant === 'challenge' ? [titleStyle, { color: '#00ffff', textTransform: 'uppercase' }] : titleStyle}>{title}</Text>
        {isCompleted && <Text style={styles.completedTag}>// SINCRONIZADO</Text>}
        {variant === 'challenge' && <Text style={[styles.challengeTag, { color: '#a0a0a0' }]}>// PHYSICAL_MASTER_TEST</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  nodeContainer: {
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    minWidth: 200,
  },
  alignLeft: {
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
  },
  alignRight: {
    alignSelf: 'flex-end',
    justifyContent: 'flex-start',
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
    borderWidth: 1,
    borderColor: '#00d4ff',
  },
  challengeNode: {
    borderColor: '#FFD700',
    borderWidth: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
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
    backgroundColor: '#FFD700',
    zIndex: -1,
  },
  image: {
    width: 65,
    height: 65,
    zIndex: 2,
  },
  challengeImage: {
    width: 112,
    height: 112,
    zIndex: 10,
  },
  imageLocked: {
    opacity: 0.2,
    tintColor: '#444',
  },
  challengeImageLocked: {
    opacity: 1,
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
    backgroundColor: '#c0c0c0',
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
    maxWidth: 180,
    zIndex: 5,
  },
  title: {
    color: '#00ff00',
    fontSize: 14,
    fontFamily: 'RobotoMono_700Bold',
    letterSpacing: 0.5,
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
    color: '#c0c0c0',
    fontSize: 8,
    fontFamily: 'RobotoMono_400Regular',
    marginTop: 4,
    letterSpacing: 0.5,
  },
});
