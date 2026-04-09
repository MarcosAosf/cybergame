import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, ScrollView, Text, Animated, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSecStore } from '../store/useSecStore';
import { MODULES, Lesson } from '../data/lessons';
import { RoadNode } from '../components/RoadNode';
import { LessonModal } from '../components/LessonModal';
import { useAudio } from '../components/AudioProvider';
import { BitWallet } from '../components/BitWallet';
import { BitsToast } from '../components/BitsToast';
import { EmergencyNode, EmergencyAlert, EmergencyModal } from '../components/EmergencyProtocol';

export const RoadScreen = () => {
  const { completedLessonIds, stats, isGraduated, loseHeart, completeEmergencyTask, isOnFire } = useSecStore();
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [tapCount, setTapCount] = useState(0);
  const { playEffect } = useAudio();

  // Emergency Protocol State — single skull node, 30% random spawn
  const [emergencyModalVisible, setEmergencyModalVisible] = useState(false);
  const [showEmergencyNode] = useState(() => Math.random() < 0.30);

  // Terminal Breach Pulse Animation
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (completedLessonIds.length > 0) {
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 300, useNativeDriver: false }),
        Animated.timing(pulseAnim, { toValue: 0, duration: 700, useNativeDriver: false })
      ]).start();
    }
  }, [completedLessonIds.length]);

  const handleEasterEgg = () => {
    setTapCount(prev => {
      const newCount = prev + 1;
      if (newCount === 7) {
        Alert.alert("TERMINAL_ACCESS", "// HELLO_DELTHA_SYSTEMS_ONLINE");
        return 0;
      }
      return newCount;
    });
  };

  const backgroundColor = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#000000', '#003311']
  });

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={{ ...styles.pulseBackground, backgroundColor }} />
      
      <BitsToast />
      <TouchableOpacity activeOpacity={1} onPress={handleEasterEgg}>
        <View style={styles.header}>
          <Text style={{ color: "#00d4ff", fontSize: 20 }}>◈</Text>
          <Text style={styles.headerTitle}>SECROAD_MAP</Text>
          <View style={styles.heartContainer}>
            {/* Show emergency alert badge when an active emergency is available */}
            {showEmergencyNode && !emergencyModalVisible && (
              <EmergencyAlert onTap={() => setEmergencyModalVisible(true)} />
            )}
            <Text style={styles.hearts}>❤️ {stats.hearts}</Text>
            <Text style={styles.credits}>⚡ {stats.credits}</Text>
            <BitWallet />
          </View>
        </View>
      </TouchableOpacity>
      
      {isGraduated && (
        <View style={styles.gradBanner}>
          <Text style={styles.gradBannerText}>// ALL_SYSTEMS_BREACHED - OPERADOR_NÍVEL_GHOST</Text>
        </View>
      )}

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {MODULES.map((module, mIndex) => (
          <View key={module.id}>
            <View style={styles.moduleHeader}>
              <Text style={styles.moduleTitle}>{module.title}</Text>
              <View style={styles.moduleLine} />
            </View>
            {module.lessons.map((lesson, lIndex) => {
              const prevLessonId = mIndex > 0 || lIndex > 0 
                ? (lIndex > 0 ? module.lessons[lIndex-1].id : MODULES[mIndex-1].lessons[MODULES[mIndex-1].lessons.length-1].id)
                : null;
              
              const isUnlocked = !prevLessonId || completedLessonIds.includes(prevLessonId);
              const isCompleted = completedLessonIds.includes(lesson.id);

              return (
                <RoadNode
                  key={lesson.id}
                  id={lesson.id}
                  title={lesson.title}
                  index={lIndex}
                  isUnlocked={isUnlocked}
                  isCompleted={isCompleted}
                  onPress={() => setSelectedLesson(lesson)}
                />
              );
            })}
          </View>
        ))}

        {/* SYSTEM_BREACH NODE — single skull, exclusive emergency trigger */}
        {showEmergencyNode && (
          <EmergencyNode onActivate={() => { playEffect('sync'); setEmergencyModalVisible(true); }} />
        )}
      </ScrollView>

      {/* EMERGENCY PROTOCOL MODAL */}
      <EmergencyModal
        visible={emergencyModalVisible}
        onSuccess={() => {
          setEmergencyModalVisible(false);
          completeEmergencyTask();
          Alert.alert('SISTEMA_CONTIDO', '// BRECHA_SELADA: +450 BITS · STATUS: ON_FIRE ATIVADO');
        }}
        onFail={() => {
          setEmergencyModalVisible(false);
          loseHeart();
          Alert.alert('FALHA_CRÍTICA', '// BRECHA_NÃO_CONTIDA: -1 CORAÇÃO');
        }}
        onClose={() => setEmergencyModalVisible(false)}
      />


      {selectedLesson && (
        <LessonModal 
          lesson={selectedLesson} 
          onClose={() => setSelectedLesson(null)} 
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  pulseBackground: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    backgroundColor: '#000000',
  },
  gradBanner: {
    backgroundColor: 'rgba(0, 255, 159, 0.1)',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#00ff9f',
    alignItems: 'center',
  },
  gradBannerText: {
    color: '#00ff9f',
    fontSize: 9,
    fontFamily: 'RobotoMono_700Bold',
    letterSpacing: 1,
  },
  headerTitle: {
    color: '#00d4ff',
    fontSize: 18,
    fontFamily: 'RobotoMono_700Bold',
    marginLeft: 10,
    flex: 1,
  },
  heartContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  hearts: {
    color: '#ff4b4b',
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingBottom: 150,
  },
  moduleHeader: {
    marginTop: 40,
    marginBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  moduleTitle: {
    color: '#a0a0a0',
    fontSize: 12,
    fontFamily: 'RobotoMono_400Regular',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginRight: 10,
  },
  moduleLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#333333',
  },
});