import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image, Modal } from 'react-native';
import ViewShot, { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSecStore } from '../store/useSecStore';
import { StatItem } from '../components/StatItem';
import { EliteRadar } from '../components/EliteRadar';
import { MODULES } from '../data/lessons';
import { BlackMarket } from '../components/BlackMarket';
import { BitWallet } from '../components/BitWallet';
import { BitsToast } from '../components/BitsToast';

export const ProfileScreen = () => {
  const { user, stats, completedLessonIds, breachLogs, isGraduated, graduationDate, buyHeart, buyCredits } = useSecStore();
  const [shopFeedback, setShopFeedback] = useState<string | null>(null);
  const [showCredential, setShowCredential] = useState(false);
  const [blackMarketVisible, setBlackMarketVisible] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const viewShotRef = React.useRef(null);

  const isScriptKiddie = completedLessonIds.length === 0;

  const handleEasterEgg = () => {
    const newCount = tapCount + 1;
    setTapCount(newCount);
    if (newCount === 7) {
      Alert.alert("TERMINAL_ACCESS", "// HELLO_DELTHA_SYSTEMS_ONLINE");
      setTapCount(0);
    }
  };

  // Conquistas derivadas do estado atual
  const achievements = [
    { 
      id: '1', 
      title: 'Primeira Invasão', 
      description: 'Concluiu sua primeira lição no SecRoad', 
      icon: '⚡', 
      unlocked: !isScriptKiddie 
    },
    { 
      id: '2', 
      title: 'Mestre da Rede', 
      description: 'Fisicamente seguro: Camada 1 ativa.', 
      icon: '🏆', 
      unlocked: MODULES.find(m => m.id === 'm1')?.lessons.some(l => completedLessonIds.includes(l.id)) 
    },
    { 
      id: '3', 
      title: 'Operador Elite', 
      description: 'Invasor de alto nível: +1000 XP', 
      icon: '🎯', 
      unlocked: user.totalXP >= 1000 
    },
  ];

  const handlePurchase = (type: 'heart' | 'credits') => {
    let success = false;
    if (type === 'heart') {
      success = buyHeart(200);
      if (success) setShopFeedback('SISTEMA_REPARADO: +1 ❤️');
    } else {
      success = buyCredits(5, 100);
      if (success) setShopFeedback('SHELL_RECARREGADA: +5 ⚡');
    }

    if (success) {
      setTimeout(() => setShopFeedback(null), 3000);
    } else {
      Alert.alert("ERRO_DE_TRANSACAO", "Bits insuficientes ou recurso no limite máximo.");
    }
  };

  const shareCredential = async () => {
    try {
      const uri = await captureRef(viewShotRef, {
        format: 'png',
        quality: 1.0,
      });
      await Sharing.shareAsync(uri);
    } catch (e) {
      Alert.alert("FALHA_NA_EXPORTAÇÃO", "Não foi possível processar a imagem da credencial.");
    }
  };

  const handleLogPress = (logId: string) => {
    let foundLesson = null;
    for (const module of MODULES) {
      const lesson = module.lessons.find(l => l.id === logId);
      if (lesson) {
        foundLesson = lesson;
        break;
      }
    }
    if (foundLesson) {
      Alert.alert(
        `RECOLHA_DE_DADOS: ${foundLesson.title.toUpperCase()}`,
        foundLesson.theory.substring(0, 300) + "...",
        [{ text: "ENTENDIDO", style: "default" }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <BitsToast />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity activeOpacity={1} onPress={handleEasterEgg}>
          <View style={styles.header}>
            <View style={[styles.avatarContainer, !isScriptKiddie ? styles.avatarGlowing : null]}>
               <Image 
                 source={require('../../assets/branding/escudo.png')}
                 style={[
                   styles.avatarImage,
                   isScriptKiddie ? styles.avatarImageLocked : null
                 ]}
                 resizeMode="contain"
               />
            </View>
            <Text style={styles.username}>{user.name}</Text>
            <View style={styles.rankContainer}>
              <Text style={styles.rankText}>{user.rank.toUpperCase()}</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* GRADUATION BUTTON */}
        {isGraduated && (
          <TouchableOpacity 
            style={styles.gradButton} 
            onPress={() => setShowCredential(true)}
          >
            <Text style={styles.gradButtonText}>✦ VER_CREDENCIAL_CYBER_GHOST ✦</Text>
          </TouchableOpacity>
        )}

        {/* RESUMO PROFISSIONAL */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>// RESUMO_PROFISSIONAL</Text>
          <Text style={styles.summaryText}>
            Operador de nível {user.rank} com especialização em fundamentos de rede. 
            Atualmente processando lições na trilha SecRoad. 
            Seu Escudo de Camadas reflete seu histórico técnico. 
            Histórico: {user.completedLessons} lições validadas.
          </Text>
        </View>

        {/* ELITE DOSSIER RADAR CHART (NEW Phase 19) */}
        <EliteRadar completedLessonIds={completedLessonIds} />

        {/* SHOP SECTION */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>LOJA_DO_TERMINAL</Text>
          <View style={styles.sectionLine} />
        </View>

        <View style={styles.shopContainer}>
          {/* Black Market entry point */}
          <TouchableOpacity
            style={styles.blackMarketBtn}
            onPress={() => setBlackMarketVisible(true)}
            activeOpacity={0.8}
          >
            <View style={styles.blackMarketLeft}>
              <Text style={styles.blackMarketLabel}>// BLACK_MARKET_TERMINAL</Text>
              <Text style={styles.blackMarketSub}>Títulos, FX de Perfil e Chaves de Acesso</Text>
            </View>
            <BitWallet />
          </TouchableOpacity>

          {/* Legacy quick-buy: hearts */}
          <TouchableOpacity
            style={styles.shopItem}
            onPress={() => handlePurchase('heart')}
            activeOpacity={0.7}
          >
            <View style={styles.shopItemInfo}>
              <Text style={styles.shopItemTitle}>REPARAR_NUCLEO</Text>
              <Text style={styles.shopItemDesc}>Adicionar +1 Coração (❤️)</Text>
            </View>
            <View style={styles.priceTag}>
               <Text style={styles.priceText}>200 ₿</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.shopItem}
            onPress={() => handlePurchase('credits')}
            activeOpacity={0.7}
          >
            <View style={styles.shopItemInfo}>
              <Text style={styles.shopItemTitle}>RECARGA_DE_SHELL</Text>
              <Text style={styles.shopItemDesc}>Adicionar +5 Créditos (⚡)</Text>
            </View>
            <View style={styles.priceTag}>
               <Text style={styles.priceText}>100 ₿</Text>
            </View>
          </TouchableOpacity>

          {shopFeedback && (
            <View style={styles.feedbackContainer}>
              <Text style={styles.feedbackText}>{shopFeedback}</Text>
            </View>
          )}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>ESTATISTICAS_LOCAIS</Text>
          <View style={styles.sectionLine} />
        </View>

        <View style={styles.statsGrid}>
          <StatItem 
            label="Total XP" 
            value={user.totalXP} 
            icon={<Text style={{ fontSize: 18, color: "#00d4ff" }}>⚡</Text>} 
          />
          <StatItem 
            label="Bits" 
            value={stats.bits} 
            icon={<Text style={{ fontSize: 18, color: "#facc15" }}>🪙</Text>} 
          />
        </View>
        
        {/* LOG SECTION */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>CONSO_LOG (HISTÓRICO_DE_BRECHAS)</Text>
          <View style={styles.sectionLine} />
        </View>

        <View style={styles.logContainer}>
          {breachLogs.length > 0 ? (
            breachLogs.map((log, index) => (
              <TouchableOpacity 
                key={`${log.id}-${index}`} 
                onPress={() => handleLogPress(log.id)}
                style={styles.logEntry}
              >
                <Text style={styles.logText}>
                  [{log.timestamp}] - LAYER_{log.layer}: {log.title}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyLogText}>AGUARDANDO_PRIMEIRA_BRECHA...</Text>
          )}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>CONQUISTAS_E_BADGES</Text>
          <View style={styles.sectionLine} />
        </View>

        <View style={styles.badgeList}>
          {achievements.map((badge) => (
            <View key={badge.id} style={!badge.unlocked ? { ...styles.badgeItem, ...styles.lockedBadge } : styles.badgeItem}>
              <View style={badge.unlocked ? { ...styles.badgeIcon, ...styles.unlockedIcon } : styles.badgeIcon}>
                <Text style={{ fontSize: 24, color: badge.unlocked ? "#00ff9f" : "#a0a0a0" }}>{badge.icon}</Text>
              </View>
              <View style={styles.badgeInfo}>
                <Text style={styles.badgeTitle}>{badge.title}</Text>
                <Text style={styles.badgeDesc}>{badge.description}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <BlackMarket
        visible={blackMarketVisible}
        onClose={() => setBlackMarketVisible(false)}
      />

      {/* CREDENTIAL MODAL */}
      <Modal visible={showCredential} animationType="fade" transparent={true}>
        <View style={styles.modalBg}>
          <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1.0 }}>
            <View style={styles.credCard}>
              <Text style={styles.credLabel}>// CYBER_GHOST_CREDENTIAL</Text>
              <View style={styles.credLine} />
              <Image 
                source={require('../../assets/branding/escudo.png')}
                style={styles.credShield}
                resizeMode="contain"
              />
              <Text style={styles.credName}>{user.name.toUpperCase()}</Text>
              <Text style={styles.credStatus}>ESTADO: OPERADOR_CERTIFICADO</Text>
              <Text style={styles.credDate}>SINCRONIA_ESTABELECIDA: {graduationDate}</Text>
              
              <Text style={styles.credFooter}>RANK: {user.rank.toUpperCase()}</Text>
            </View>
          </ViewShot>
          
          <View style={styles.credActions}>
            <TouchableOpacity 
              style={styles.shareBtn} 
              onPress={shareCredential}
            >
              <Text style={styles.shareBtnText}>COMPARTILHAR_STATUS</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.exportButton} 
              onPress={() => setShowCredential(false)}
            >
              <Text style={styles.exportText}>SAIR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.terminalOverlay}>
        <Text style={styles.terminalText}>ID_SISTEMA: SECROAD_OP_{user.name.toUpperCase()}</Text>
        <Text style={styles.terminalText}>BIT_STASH: {stats.bits} // ❤️ {stats.hearts} // ⚡ {stats.credits}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 150,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#050505',
    borderWidth: 1,
    borderColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarGlowing: {
    borderColor: '#00d4ff',
    shadowColor: '#00d4ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  avatarImage: {
    width: 80,
    height: 80,
  },
  avatarImageLocked: {
    opacity: 0.3,
    tintColor: '#444',
  },
  username: {
    color: '#ffffff',
    fontSize: 22,
    fontFamily: 'RobotoMono_700Bold',
  },
  rankContainer: {
    marginTop: 8,
    paddingHorizontal: 15,
    paddingVertical: 4,
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#00d4ff',
  },
  rankText: {
    color: '#00d4ff',
    fontSize: 9,
    letterSpacing: 1.5,
    fontFamily: 'RobotoMono_700Bold',
  },
  gradButton: {
    backgroundColor: 'rgba(0, 255, 159, 0.1)',
    borderColor: '#00ff9f',
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 25,
  },
  gradButtonText: {
    color: '#00ff9f',
    fontSize: 10,
    fontFamily: 'RobotoMono_700Bold',
    letterSpacing: 1,
  },
  summaryContainer: {
    backgroundColor: '#0a0a0a',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1a1a1a',
    marginBottom: 25,
  },
  summaryTitle: {
    color: '#00d4ff',
    fontSize: 11,
    fontFamily: 'RobotoMono_700Bold',
    marginBottom: 8,
  },
  summaryText: {
    color: '#a0a0a0',
    fontSize: 12,
    lineHeight: 18,
    fontFamily: 'RobotoMono_400Regular',
  },
  blackMarketBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(191, 0, 255, 0.05)',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#bf00ff44',
    marginBottom: 12,
  },
  blackMarketLeft: {
    flex: 1,
    marginRight: 12,
  },
  blackMarketLabel: {
    color: '#bf00ff',
    fontSize: 13,
    fontFamily: 'RobotoMono_700Bold',
    letterSpacing: 0.5,
  },
  blackMarketSub: {
    color: '#555',
    fontSize: 9,
    fontFamily: 'RobotoMono_400Regular',
    marginTop: 3,
  },
  shopContainer: {
    gap: 12,
    marginBottom: 25,
  },
  shopItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#222',
  },
  shopItemInfo: {
    flex: 1,
  },
  shopItemTitle: {
    color: '#00ff9f',
    fontSize: 14,
    fontFamily: 'RobotoMono_700Bold',
  },
  shopItemDesc: {
    color: '#888',
    fontSize: 11,
    marginTop: 2,
  },
  priceTag: {
    backgroundColor: '#000',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#333',
  },
  priceText: {
    color: '#facc15',
    fontSize: 12,
    fontFamily: 'RobotoMono_700Bold',
  },
  feedbackContainer: {
    marginTop: 10,
    backgroundColor: 'rgba(0, 255, 159, 0.1)',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#00ff9f',
    alignItems: 'center',
  },
  feedbackText: {
    color: '#00ff9f',
    fontSize: 11,
    fontFamily: 'RobotoMono_700Bold',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  logContainer: {
    backgroundColor: '#050505',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#111',
    maxHeight: 200,
    marginBottom: 25,
  },
  logEntry: {
    marginBottom: 8,
  },
  logText: {
    color: '#00ff9f',
    fontSize: 11,
    fontFamily: 'RobotoMono_400Regular',
  },
  emptyLogText: {
    color: '#333',
    fontSize: 11,
    fontFamily: 'RobotoMono_400Regular',
    textAlign: 'center',
    paddingVertical: 20,
  },
  sectionHeader: {
    marginTop: 30,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    color: '#00d4ff',
    fontSize: 11,
    fontFamily: 'RobotoMono_700Bold',
    marginRight: 10,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#1a1a1a',
  },
  badgeList: {
    marginBottom: 20,
  },
  badgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#222',
    marginBottom: 12,
  },
  lockedBadge: {
    opacity: 0.4,
  },
  badgeIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  unlockedIcon: {
    borderColor: '#00ff9f',
    borderWidth: 1,
  },
  badgeInfo: {
    flex: 1,
  },
  badgeTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'RobotoMono_700Bold',
  },
  badgeDesc: {
    color: '#888',
    fontSize: 11,
    marginTop: 2,
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  credCard: {
    width: '100%',
    backgroundColor: '#050505',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#00ff9f',
    padding: 25,
    alignItems: 'center',
    shadowColor: '#00ff9f',
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  credLabel: {
    color: '#00ff9f',
    fontSize: 10,
    fontFamily: 'RobotoMono_700Bold',
    marginBottom: 15,
  },
  credLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#00ff9f',
    opacity: 0.3,
    marginBottom: 20,
  },
  credShield: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  credName: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'RobotoMono_700Bold',
    marginBottom: 5,
  },
  credStatus: {
    color: '#00d4ff',
    fontSize: 12,
    fontFamily: 'RobotoMono_400Regular',
    marginBottom: 15,
  },
  credDate: {
    color: '#555',
    fontSize: 10,
    fontFamily: 'RobotoMono_400Regular',
    marginBottom: 30,
  },
  exportButton: {
    backgroundColor: '#00ff9f',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  exportText: {
    color: '#000',
    fontFamily: 'RobotoMono_700Bold',
    fontSize: 14,
  },
  credFooter: {
    color: '#333',
    fontSize: 8,
    fontFamily: 'RobotoMono_400Regular',
    marginTop: 20,
  },
  credActions: {
    marginTop: 30,
    width: '100%',
    gap: 15,
  },
  shareBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#00ff9f',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  shareBtnText: {
    color: '#00ff9f',
    fontFamily: 'RobotoMono_700Bold',
    fontSize: 14,
  },
  terminalOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#1a1a1a',
  },
  terminalText: {
    color: '#00d4ff',
    fontSize: 10,
    fontFamily: 'RobotoMono_400Regular',
    textAlign: 'center',
  },
});
