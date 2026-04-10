import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image, Modal, ActivityIndicator } from 'react-native';
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
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [shopFeedback, setShopFeedback] = useState<string | null>(null);
  const [showCredential, setShowCredential] = useState(false);
  const [blackMarketVisible, setBlackMarketVisible] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const viewShotRef = useRef(null);

  useEffect(() => {
    // [LOCAL_MODE]: Profile loads immediately from secondary archive
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          animating={Boolean(loading)}
          hidesWhenStopped={Boolean(true)}
          color="#00d4ff"
          size="large"
        />
      </View>
    );
  }

  const userDisplayName = user.name || 'Operator';
  const userRank = user.rank || 'Recruta';
  const userXP = user.totalXP || 0;
  const userBits = stats.bits || 100;
  const userCompletedIds = completedLessonIds || [];

  const getTierFromXP = (xp: number) => {
    if (xp >= 4001) return 9;
    if (xp >= 3501) return 8;
    if (xp >= 3001) return 7;
    if (xp >= 2501) return 6;
    if (xp >= 2001) return 5;
    if (xp >= 1501) return 4;
    if (xp >= 1001) return 3;
    if (xp >= 501) return 2;
    return 1;
  };

  const milestones = [0, 501, 1001, 1501, 2001, 2501, 3001, 3501, 4001, 4501];
  const playerTier = getTierFromXP(userXP);
  const nextMilestone = milestones[playerTier] || 4501;
  const progressionPercent = Math.min(100, (userBits / (nextMilestone || 1)) * 100); // UI uses bits for logic usually but logic uses XP. Fix to XP.
  const progressionPercentXP = Math.min(100, (userXP / (nextMilestone || 1)) * 100);

  const getRoleColor = (tier: number) => {
    if (tier >= 7) return '#8000ff'; // Purple
    if (tier >= 4) return '#50c878'; // Emerald
    if (tier >= 2) return '#ff8c00'; // Orange
    return '#444';
  };
  const playerRoleColor = getRoleColor(playerTier);

  const handleEasterEgg = () => {
    const newCount = tapCount + 1;
    setTapCount(newCount);
    if (newCount === 7) {
      Alert.alert("TERMINAL_ACCESS", "// HELLO_DELTHA_SYSTEMS_ONLINE");
      setTapCount(0);
    }
  };

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
      const uri = await captureRef(viewShotRef, { format: 'png', quality: 1.0 });
      await Sharing.shareAsync(uri);
    } catch (e) {
      Alert.alert("FALHA_NA_EXPORTAÇÃO", "Não foi possível processar a imagem.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <BitsToast />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <TouchableOpacity activeOpacity={1} onPress={handleEasterEgg}>
          <View style={styles.header}>
            <Image
              source={require('../../assets/branding/escudo.png')}
              style={[styles.avatarImage, userCompletedIds.length === 0 ? styles.avatarImageLocked : null]}
              resizeMode="contain"
            />
            <Text style={styles.username}>{userDisplayName.toUpperCase()}</Text>
            <View style={[styles.rankContainer, { backgroundColor: playerRoleColor + '20', borderColor: playerRoleColor }]}>
              <Text style={[styles.rankText, { color: playerRoleColor }]}>{userRank.toUpperCase()}</Text>
            </View>

            <View style={styles.progressionWrapper}>
              <View style={styles.progressionHeader}>
                <Text style={styles.progressionLabel}>SINC_PROGRESS</Text>
                <Text style={styles.progressionValue}>{Math.round(progressionPercentXP)}%</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${progressionPercentXP}%`, backgroundColor: playerRoleColor }]} />
              </View>
              <Text style={styles.bytesToNext}>{userXP} / {nextMilestone} BYTES</Text>
            </View>
          </View>
        </TouchableOpacity>

        {!!isGraduated && (
          <TouchableOpacity style={styles.gradButton} onPress={() => setShowCredential(true)}>
            <Text style={styles.gradButtonText}>✦ VER_CREDENCIAL_CYBER_GHOST ✦</Text>
          </TouchableOpacity>
        )}

        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>// RESUMO_PROFISSIONAL</Text>
          <Text style={styles.summaryText}>
            Operador de nível {userRank} em sincronia com a rede.
            Histórico: {userCompletedIds.length} lições validadas.
            Total Acumulado: {userXP} BYTES.
          </Text>
        </View>

        <EliteRadar completedLessonIds={userCompletedIds} />

        <View style={styles.shopContainer}>
          <TouchableOpacity style={styles.blackMarketBtn} onPress={() => setBlackMarketVisible(true)}>
            <Text style={styles.blackMarketLabel}>// BLACK_MARKET_TERMINAL</Text>
            <BitWallet />
          </TouchableOpacity>

          <TouchableOpacity style={styles.shopItem} onPress={() => handlePurchase('heart')}>
            <View style={styles.shopItemInfo}>
              <Text style={styles.shopItemTitle}>REPARAR_NUCLEO</Text>
              <Text style={styles.shopItemDesc}>Adicionar +1 Coração (❤️)</Text>
            </View>
            <View style={styles.priceTag}><Text style={styles.priceText}>200 ₿</Text></View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.shopItem} onPress={() => handlePurchase('credits')}>
            <View style={styles.shopItemInfo}>
              <Text style={styles.shopItemTitle}>RECARGA_DE_SHELL</Text>
              <Text style={styles.shopItemDesc}>Adicionar +5 Créditos (⚡)</Text>
            </View>
            <View style={styles.priceTag}><Text style={styles.priceText}>100 ₿</Text></View>
          </TouchableOpacity>

          {shopFeedback && (
            <View style={styles.feedbackContainer}><Text style={styles.feedbackText}>{shopFeedback}</Text></View>
          )}
        </View>

        <View style={styles.statsGrid}>
          <StatItem label="BYTES" value={userXP} color={playerRoleColor} />
          <StatItem label="BITS" value={userBits} color="#facc15" />
        </View>

        <View style={styles.logContainer}>
          <Text style={styles.logTitle}>// RECENT_BREACH_LOGS</Text>
          {breachLogs.map((log, i) => (
            <View key={i} style={styles.logEntry}>
              <Text style={styles.logText}>[{log.timestamp}] L{log.layer}: {log.title}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <BlackMarket
        visible={Boolean(blackMarketVisible)}
        onClose={() => setBlackMarketVisible(false)}
      />

      <Modal
        visible={Boolean(showCredential)}
        animationType="fade"
        transparent={Boolean(true)}
      >
        <View style={styles.modalBg}>
          <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1.0 }}>
            <View style={styles.credCard}>
              <Text style={styles.credLabel}>// CYBER_GHOST_CREDENTIAL</Text>
              <View style={styles.credLine} />
              <Image source={require('../../assets/branding/escudo.png')} style={styles.credShield} resizeMode="contain" />
              <Text style={styles.credName}>{userDisplayName.toUpperCase()}</Text>
              <Text style={styles.credStatus}>OPERADOR_CERTIFICADO</Text>
              <Text style={styles.credDate}>LOG: {graduationDate}</Text>
            </View>
          </ViewShot>
          <View style={styles.credActions}>
            <TouchableOpacity style={styles.shareBtn} onPress={shareCredential}>
              <Text style={styles.shareBtnText}>EXPORTAR_IDENTIDADE</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.exportButton} onPress={() => setShowCredential(false)}>
              <Text style={styles.exportText}>FECHAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.terminalOverlay}>
        <Text style={styles.terminalText}>ID: {userDisplayName.toUpperCase()} // BYTES: {userXP} // BITS: {userBits}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  scrollContent: { padding: 20, paddingBottom: 100 },
  loadingContainer: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  header: { alignItems: 'center', marginBottom: 30 },
  avatarImage: { width: 80, height: 80 },
  avatarImageLocked: { opacity: 0.3, tintColor: '#333' },
  username: { color: '#fff', fontSize: 24, fontFamily: 'RobotoMono_700Bold', marginTop: 15 },
  rankContainer: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, borderWidth: 1, marginTop: 8 },
  rankText: { fontSize: 10, fontFamily: 'RobotoMono_700Bold', letterSpacing: 2 },
  progressionWrapper: { width: '100%', marginTop: 25 },
  progressionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressionLabel: { color: '#444', fontSize: 10, fontFamily: 'RobotoMono_700Bold' },
  progressionValue: { color: '#fff', fontSize: 10, fontFamily: 'RobotoMono_700Bold' },
  progressBarBg: { height: 6, backgroundColor: '#111', borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 3 },
  bytesToNext: { color: '#222', fontSize: 8, textAlign: 'right', marginTop: 4, fontFamily: 'RobotoMono_400Regular' },
  summaryContainer: { backgroundColor: '#0a0a0a', padding: 15, borderRadius: 10, borderLeftWidth: 3, borderLeftColor: '#333', marginBottom: 25 },
  summaryTitle: { color: '#444', fontSize: 10, fontFamily: 'RobotoMono_700Bold', marginBottom: 8 },
  summaryText: { color: '#888', fontSize: 12, lineHeight: 18, fontFamily: 'RobotoMono_400Regular' },
  shopContainer: { marginBottom: 30 },
  blackMarketBtn: { backgroundColor: '#111', padding: 20, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, borderWidth: 1, borderColor: '#222' },
  blackMarketLabel: { color: '#bf00ff', fontFamily: 'RobotoMono_700Bold', fontSize: 12 },
  shopItem: { backgroundColor: '#050505', padding: 15, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, borderWidth: 1, borderColor: '#111' },
  shopItemInfo: { flex: 1 },
  shopItemTitle: { color: '#00d4ff', fontSize: 12, fontFamily: 'RobotoMono_700Bold' },
  shopItemDesc: { color: '#444', fontSize: 10, marginTop: 2 },
  priceTag: { backgroundColor: '#00d4ff20', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  priceText: { color: '#00d4ff', fontSize: 10, fontFamily: 'RobotoMono_700Bold' },
  feedbackContainer: { padding: 10, alignItems: 'center' },
  feedbackText: { color: '#00ff9f', fontSize: 10, fontFamily: 'RobotoMono_700Bold' },
  statsGrid: { flexDirection: 'row', gap: 15, marginBottom: 30 },
  logContainer: { backgroundColor: '#000', borderWidth: 1, borderColor: '#111', padding: 15, borderRadius: 10, marginBottom: 30 },
  logTitle: { color: '#333', fontSize: 10, fontFamily: 'RobotoMono_700Bold', marginBottom: 10 },
  logEntry: { marginBottom: 5 },
  logText: { color: '#00ff9f', fontSize: 9, fontFamily: 'RobotoMono_400Regular', opacity: 0.7 },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  credCard: { width: '100%', backgroundColor: '#050505', borderWidth: 1, borderColor: '#333', padding: 30, borderRadius: 20, alignItems: 'center' },
  credLabel: { color: '#00d4ff', fontSize: 10, fontFamily: 'RobotoMono_700Bold', marginBottom: 20 },
  credLine: { width: '100%', height: 1, backgroundColor: '#222', marginBottom: 20 },
  credShield: { width: 100, height: 100, marginBottom: 20 },
  credName: { color: '#fff', fontSize: 28, fontFamily: 'RobotoMono_700Bold', marginBottom: 10 },
  credStatus: { color: '#bf00ff', fontSize: 12, fontFamily: 'RobotoMono_700Bold', letterSpacing: 4 },
  credDate: { color: '#444', fontSize: 10, marginTop: 10 },
  credActions: { marginTop: 30, width: '100%', gap: 15 },
  shareBtn: { backgroundColor: '#00ff9f', padding: 18, borderRadius: 12, alignItems: 'center' },
  shareBtnText: { color: '#000', fontFamily: 'RobotoMono_700Bold', fontSize: 16 },
  exportButton: { padding: 15, alignItems: 'center' },
  exportText: { color: '#444', fontSize: 12, fontFamily: 'RobotoMono_700Bold' },
  terminalOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#000', padding: 15, borderTopWidth: 1, borderTopColor: '#111', flexDirection: 'row', justifyContent: 'center' },
  terminalText: { color: '#1a1a1a', fontSize: 8, fontFamily: 'RobotoMono_400Regular', letterSpacing: 1 },
  gradButton: {
    backgroundColor: '#50c878',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0f0',
  },
  gradButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontFamily: 'Courier', // Or your terminal font
  }
});
