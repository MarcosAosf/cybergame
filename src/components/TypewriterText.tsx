import React, { useState, useEffect, useRef } from 'react';
import { Text, StyleSheet, Animated } from 'react-native';
import { useAudio } from '../hooks/useAudio';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  style?: any;
  onComplete?: () => void;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  speed = 30,
  style,
  onComplete
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const { playEffect, stopEffect } = useAudio();

  // Animation for the flickering cursor
  const cursorOpacity = useRef(new Animated.Value(0)).current;
  const lastPlayRef = useRef(0);

  useEffect(() => {
    // Start cursor animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(cursorOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(cursorOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
      ])
    ).start();

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        const char = text[currentIndex];
        setDisplayedText(prev => prev + char);

        // Audio Throttling & Resource Guard
        const now = Date.now();
        if (currentIndex % 2 === 0 && (now - lastPlayRef.current) >= 60) {
          lastPlayRef.current = now;
          Promise.resolve().then(async () => {
            try {
              // Volume normalized to 0.3 for terminal feedback
              await stopEffect('terminal');
              await playEffect('terminal');
            } catch (e) {
              // Silence audio errors to prevent UI lag
            }
          });
        }

        currentIndex++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        stopEffect('terminal');
        console.log('--- [TERMINAL_AUDIO_STOPPED]: Typing Complete ---');
        if (onComplete) onComplete();
      }
    }, speed);

    return () => {
      clearInterval(interval);
      stopEffect('terminal');
      console.log('--- [TERMINAL_AUDIO_STOPPED]: Cleanup/Unmount ---');
      cursorOpacity.stopAnimation();
    };
  }, [text, speed]);

  return (
    <Text style={[styles.text, style]}>
      {displayedText}
      {isTyping && (
        <Animated.Text style={[styles.cursor, { opacity: cursorOpacity }]}>
          _
        </Animated.Text>
      )}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    color: '#00ff9f',
    fontFamily: 'RobotoMono_400Regular',
    fontSize: 15,
    lineHeight: 22,
  },
  cursor: {
    color: '#00ff9f',
    fontFamily: 'RobotoMono_700Bold',
  },
});
