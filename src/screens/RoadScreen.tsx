import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, ScrollView, Text, Animated, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSecStore } from '../store/useSecStore';
import { MODULES, Lesson } from '../data/lessons';
import { RoadNode } from '../components/RoadNode';
import { LessonModal } from '../components/LessonModal';
import { useAudio } from '../hooks/useAudio';
import { BitWallet } from '../components/BitWallet';
import { BitsToast } from '../components/BitsToast';
import { Ionicons } from '@expo/vector-icons';
import { EmergencyNode, EmergencyAlert, EmergencyModal } from '../components/EmergencyProtocol';

export const RoadScreen = () => {
  const { user, completedLessonIds, stats, isGraduated, loseHeart, completeEmergencyTask, isOnFire } = useSecStore();
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [tapCount, setTapCount] = useState(0);
  const { playEffect } = useAudio();

  // Emergency Protocol State — single skull node, 60% spawn rate
  const [emergencyModalVisible, setEmergencyModalVisible] = useState(false);
  const [showEmergencyNode] = useState(() => Math.random() < 0.60);

  // Terminal Breach Pulse Animation
  const pulseAnim = useRef(new Animated.Value(0)).current;

  const activeModuleTitle = MODULES.find(m => m.lessons.some(l => !completedLessonIds.includes(l.id)))?.title || MODULES[MODULES.length - 1].title;


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
          {/* Main header: Title section */}
          <View style={styles.titleSection}>
            <Text style={{ color: "#00d4ff", fontSize: 20 }}>◈</Text>
            <View style={{ flex: 1, marginLeft: 10, flexDirection: 'row', alignItems: 'baseline' }}>
              <Text style={styles.headerTitle}>SECROAD_MAP</Text>
              <Text style={styles.activeLayerText}> // DEFENDENDO: {activeModuleTitle.toUpperCase()}</Text>
            </View>
          </View>

          {/* Stats Bar sub-row */}
          <View style={styles.statsBar}>
            <View style={styles.statGroup}>
              <Ionicons name="heart" size={16} color="#ff4b4b" />
              <Text style={styles.statValueText}>{stats.hearts}</Text>
            </View>
            <View style={styles.statGroup}>
              <Ionicons name="flash" size={16} color="#00d4ff" />
              <Text style={styles.statValueText}>{stats.credits}</Text>
            </View>
            <View style={styles.statGroup}>
              <Text style={[styles.statValueText, { color: '#00d4ff' }]}>⚡ {user.totalXP}B</Text>
            </View>
            <View style={styles.statGroup}>
              <Text style={[styles.statValueText, { color: '#00ff9f' }]}>฿ {stats.bits}</Text>
            </View>
          </View>

          {/* Emergency alert sub-row — only visible when breach is active */}
          {!!showEmergencyNode && !emergencyModalVisible && (
            <View style={styles.headerAlertRow}>
              <EmergencyAlert onTap={() => setEmergencyModalVisible(true)} />
            </View>
          )}
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
                  lesson={lesson}
                  isUnlocked={isUnlocked}
                  isCompleted={isCompleted}
                  onPress={() => setSelectedLesson(lesson)}
                  isChallenge={lesson.isChallenge}
                  // Blue for Camada 1, Emerald Green for Camada 2
                  color={mIndex === 1 ? '#00ff9f' : '#00d4ff'}
                />
              );
            })}
          </View>
        ))}

        {/* SYSTEM_BREACH NODE — single skull, exclusive emergency trigger */}
        {!!showEmergencyNode && (
          <EmergencyNode onActivate={() => { setEmergencyModalVisible(true); }} />
        )}
      </ScrollView>

      {/* EMERGENCY PROTOCOL MODAL */}
      <EmergencyModal
        visible={Boolean(emergencyModalVisible)}
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
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    flexDirection: 'column',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    backgroundColor: '#000000',
  },
  headerMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAlertRow: {
    marginTop: 8,
    alignItems: 'flex-start',
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
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#111',
  },
  statGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statValueText: {
    color: '#fff',
    fontSize: 13,
    fontFamily: 'RobotoMono_700Bold',
  },
  headerTitle: {
    color: '#00d4ff',
    fontSize: 16,
    fontFamily: 'RobotoMono_700Bold',
  },
  activeLayerText: {
    color: '#00ff9f',
    fontSize: 8,
    fontFamily: 'RobotoMono_400Regular',
    marginLeft: 6,
    letterSpacing: 1,
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