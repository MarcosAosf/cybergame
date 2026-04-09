import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';
import { useSecStore } from '../store/useSecStore';

export const BitsToast = () => {
  const lastBitsEarned = useSecStore(state => state.lastBitsEarned);
  const clearBitsToast = useSecStore(state => state.clearBitsToast);
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (lastBitsEarned === null) return;
    opacity.setValue(1);
    const timer = Animated.sequence([
      Animated.delay(2000),
      Animated.timing(opacity, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]);
    timer.start(() => clearBitsToast());
    return () => timer.stop();
  }, [lastBitsEarned]);

  if (lastBitsEarned === null) return null;

  return (
    <Animated.View style={[styles.toast, { opacity }]}>
      <Text style={styles.toastText}>// DATA_EXTRACTED: +{lastBitsEarned} BITS</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    top: 70,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 255, 159, 0.08)',
    borderWidth: 1,
    borderColor: '#00ff9f',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
    zIndex: 9999,
  },
  toastText: {
    color: '#00ff9f',
    fontFamily: 'RobotoMono_700Bold',
    fontSize: 11,
    letterSpacing: 1,
  },
});
