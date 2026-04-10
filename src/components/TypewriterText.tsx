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

        // Mechanical Throttling: Trigger sound every 2 characters to avoid driver saturations
        if (currentIndex % 2 === 0) {
          console.log('--- [SOUND_TRIGGERED]: terminal (Throttled) ---');
          playEffect('terminal');
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
