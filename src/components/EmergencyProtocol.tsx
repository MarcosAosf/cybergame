import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated, Image, Modal, ScrollView,
} from 'react-native';
import { useSecStore } from '../store/useSecStore';

interface EmergencyTaskProps {
  onActivate: () => void; // fires when user taps the skull node
}

// The pulsing skull node shown on the Map
export const EmergencyNode: React.FC<EmergencyTaskProps> = ({ onActivate }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.2, duration: 600, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1.0, duration: 600, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(glowAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
          Animated.timing(glowAnim, { toValue: 0.3, duration: 600, useNativeDriver: true }),
        ]),
      ])
    ).start();
  }, []);

  return (
    <TouchableOpacity onPress={onActivate} activeOpacity={0.8} style={styles.nodeWrapper}>
      {/* Outer pulsing ring */}
      <Animated.View style={[styles.pulseRing, { opacity: glowAnim, transform: [{ scale: pulseAnim }] }]} />
      {/* Skull icon */}
      <View style={styles.skullBox}>
        <Image
          source={require('../../assets/badges/emergencia.png')}
          style={styles.skullIcon}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.nodeLabel}>!! SYSTEM_BREACH !!</Text>
      <Text style={styles.rewardLabel}>+450 BITS · 3x REWARD</Text>
    </TouchableOpacity>
  );
};

// Floating alert shown in the header when an emergency is active
export const EmergencyAlert: React.FC<{ onTap: () => void }> = ({ onTap }) => {
  const blinkAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
        Animated.timing(blinkAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <TouchableOpacity onPress={onTap} activeOpacity={0.8}>
      <Animated.View style={[styles.alertBadge, { opacity: blinkAnim }]}>
        <Image source={require('../../assets/badges/emergencia.png')} style={styles.alertIcon} resizeMode="contain" />
        <Text style={styles.alertText}>!! SYSTEM_BREACH_DETECTED !!</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

// Full-screen Emergency Task modal (the actual quiz/challenge)
interface EmergencyModalProps {
  visible: boolean;
  onSuccess: () => void;
  onFail: () => void;
  onClose: () => void;
}

const EMERGENCY_QUESTIONS = [
  {
    q: 'Um ataque de ransomware está cifrando os dados. Qual é a PRIMEIRA ação?',
    options: ['Desconectar da rede', 'Pagar o resgate', 'Reiniciar o servidor', 'Ignorar o alerta'],
    answer: 0,
  },
  {
    q: 'Você detecta tráfego incomum na porta 4444. Isso indica provável:',
    options: ['Backup em progresso', 'Shell reverso ativo', 'Update do SO', 'Scan de rotina'],
    answer: 1,
  },
  {
    q: 'Qual protocolo usa criptografia end-to-end por default?',
    options: ['HTTP', 'FTP', 'HTTPS', 'Telnet'],
    answer: 2,
  },
];

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ visible, onSuccess, onFail, onClose }) => {
  const [qIdx, setQIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) { setQIdx(0); setTimeLeft(30); setFeedback(null); return; }
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timer); onFail(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [visible]);

  const handleAnswer = (idx: number) => {
    const correct = EMERGENCY_QUESTIONS[qIdx].answer === idx;
    if (correct) {
      setFeedback('// ACCESS_GRANTED');
      setTimeout(() => {
        setFeedback(null);
        if (qIdx === EMERGENCY_QUESTIONS.length - 1) {
          onSuccess();
        } else {
          setQIdx(prev => prev + 1);
          setTimeLeft(30);
        }
      }, 600);
    } else {
      setFeedback('// ACCESS_DENIED');
      setTimeout(() => { setFeedback(null); onFail(); }, 800);
    }
  };

  const q = EMERGENCY_QUESTIONS[qIdx];

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.modalBg}>
        <View style={styles.modalHeader}>
          <Image source={require('../../assets/badges/emergencia.png')} style={styles.modalSkull} resizeMode="contain" />
          <View>
            <Text style={styles.modalTitle}>// EMERGENCY_PROTOCOL_ACTIVE</Text>
            <Text style={styles.modalSubtitle}>Responda corretamente para conter a brecha.</Text>
          </View>
        </View>

        {/* Timer bar */}
        <View style={styles.timerTrack}>
          <View style={[styles.timerFill, { width: `${(timeLeft / 30) * 100}%` }]} />
        </View>
        <Text style={styles.timerText}>TIME_LEFT: {timeLeft}s</Text>

        {/* Question */}
        <View style={styles.qBox}>
          <Text style={styles.qCount}>[{qIdx + 1}/{EMERGENCY_QUESTIONS.length}]</Text>
          <Text style={styles.qText}>{q.q}</Text>

          {q.options.map((opt, i) => (
            <TouchableOpacity
              key={i}
              style={styles.optBtn}
              onPress={() => handleAnswer(i)}
              activeOpacity={0.75}
            >
              <Text style={styles.optText}>{opt}</Text>
            </TouchableOpacity>
          ))}

          {feedback && (
            <Text style={[styles.feedback, { color: feedback.includes('GRANTED') ? '#00ff9f' : '#ff4040' }]}>
              {feedback}
            </Text>
          )}
        </View>

        <TouchableOpacity style={styles.abortBtn} onPress={onClose}>
          <Text style={styles.abortText}>// ABORT_PROTOCOL</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // Node
  nodeWrapper: {
    alignItems: 'center',
    marginVertical: 20,
    paddingVertical: 10,
  },
  pulseRing: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: '#ff2222',
  },
  skullBox: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#1a0000',
    borderWidth: 2,
    borderColor: '#ff2222',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  skullIcon: {
    width: 55,
    height: 55,
  },
  nodeLabel: {
    color: '#ff2222',
    fontFamily: 'RobotoMono_700Bold',
    fontSize: 11,
    marginTop: 10,
    letterSpacing: 1,
  },
  rewardLabel: {
    color: '#ff6644',
    fontFamily: 'RobotoMono_400Regular',
    fontSize: 9,
    marginTop: 3,
    opacity: 0.8,
  },
  // Alert banner
  alertBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,34,34,0.1)',
    borderWidth: 1,
    borderColor: '#ff2222',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 6,
  },
  alertIcon: {
    width: 16,
    height: 16,
  },
  alertText: {
    color: '#ff2222',
    fontFamily: 'RobotoMono_700Bold',
    fontSize: 9,
    letterSpacing: 0.5,
  },
  // Modal
  modalBg: {
    flex: 1,
    backgroundColor: '#050000',
    padding: 25,
    paddingTop: 60,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginBottom: 25,
  },
  modalSkull: {
    width: 60,
    height: 60,
  },
  modalTitle: {
    color: '#ff2222',
    fontFamily: 'RobotoMono_700Bold',
    fontSize: 13,
    letterSpacing: 1,
  },
  modalSubtitle: {
    color: '#555',
    fontFamily: 'RobotoMono_400Regular',
    fontSize: 9,
    marginTop: 3,
  },
  timerTrack: {
    height: 3,
    backgroundColor: '#1a0000',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 6,
  },
  timerFill: {
    height: '100%',
    backgroundColor: '#ff2222',
  },
  timerText: {
    color: '#ff2222',
    fontFamily: 'RobotoMono_700Bold',
    fontSize: 9,
    textAlign: 'right',
    marginBottom: 30,
  },
  qBox: {
    flex: 1,
  },
  qCount: {
    color: '#333',
    fontFamily: 'RobotoMono_700Bold',
    fontSize: 9,
    marginBottom: 10,
  },
  qText: {
    color: '#fff',
    fontFamily: 'RobotoMono_700Bold',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 30,
  },
  optBtn: {
    backgroundColor: '#0a0000',
    borderWidth: 1,
    borderColor: '#ff222230',
    borderRadius: 8,
    padding: 15,
    marginBottom: 12,
  },
  optText: {
    color: '#ff6644',
    fontFamily: 'RobotoMono_700Bold',
    fontSize: 13,
  },
  feedback: {
    fontFamily: 'RobotoMono_700Bold',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 15,
  },
  abortBtn: {
    padding: 20,
    alignItems: 'center',
  },
  abortText: {
    color: '#333',
    fontFamily: 'RobotoMono_700Bold',
    fontSize: 11,
  },
});
