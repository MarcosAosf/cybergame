import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image, Animated } from 'react-native';

interface ErrorModalProps {
  visible: boolean;
  onRetry: () => void;
  onAbort: () => void;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({ visible, onRetry, onAbort }) => {
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 1200,
            useNativeDriver: false,
          })
        ])
      ).start();
    } else {
      glowAnim.setValue(0);
    }
  }, [visible, glowAnim]);

  const glowShadowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  const glowShadowRadius = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [10, 30],
  });

  return (
    <Modal 
      visible={Boolean(visible)} 
      transparent={Boolean(true)} 
      animationType="fade"
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          
          <Animated.View 
            style={[
              styles.imageContainer, 
              {
              }
            ]}
          >
            <Image 
              source={require('../../assets/badges/virus.jpeg')} 
              style={styles.image} 
              resizeMode="cover"
            />
          </Animated.View>

          <View style={styles.messageBox}>
            <Text style={styles.primaryText}>SYSTEM_CRITICAL: RESPOSTA INCORRETA</Text>
            <Text style={styles.secondaryText}>INFECÇÃO DETECTADA. TENTE NOVAMENTE OU ABORTE A MISSÃO.</Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.primaryButton} onPress={onRetry} activeOpacity={0.7}>
              <Text style={styles.primaryButtonText}>REINICIAR EXERCÍCIO</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={onAbort} activeOpacity={0.7}>
              <Text style={styles.secondaryButtonText}>ABORTAR MISSÃO (SAIR)</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    alignItems: 'center',
  },
  imageContainer: {
    borderRadius: 60,
    backgroundColor: '#000',
    marginBottom: 40,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#00ff9f',
  },
  messageBox: {
    alignItems: 'center',
    marginBottom: 50,
  },
  primaryText: {
    color: '#ff4b4b',
    fontFamily: 'RobotoMono_700Bold',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 1,
  },
  secondaryText: {
    color: '#00ff9f',
    fontFamily: 'RobotoMono_400Regular',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 20,
  },
  actions: {
    width: '100%',
    gap: 15,
  },
  primaryButton: {
    backgroundColor: '#00d4ff',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  primaryButtonText: {
    color: '#000000',
    fontFamily: 'RobotoMono_700Bold',
    fontSize: 16,
    letterSpacing: 2,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#331111', // Dark red outline style requested
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  secondaryButtonText: {
    color: '#a0a0a0',
    fontFamily: 'RobotoMono_700Bold',
    fontSize: 14,
    letterSpacing: 1,
  },
});
