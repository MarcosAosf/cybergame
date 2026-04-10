import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { EliteRadar } from './EliteRadar';
import { useSecStore } from '../store/useSecStore';

interface UserDossierProps {
  visible: boolean;
  onClose: () => void;
  operator: {
    name: string;
    xp: number;
    role: string;
    rank: number; // Tier (1-9)
    mockLessons?: string[];
    emergencyTasksCompleted?: number;
  };
}

export const UserDossierModal: React.FC<UserDossierProps> = ({ visible, onClose, operator }) => {
  const [imgError, setImgError] = useState(false);
  const emergencyCount = operator.emergencyTasksCompleted ?? 0;

  // Synchronized Badge Mapping - mirrors CyberBadge Phase 34 True Power Progression
  const getBadgeSource = (tier: number) => {
    try {
      switch (tier) {
        case 9: return require('../../assets/badges/roxo10.png');
        case 8: return require('../../assets/badges/roxo9.png');
        case 7: return require('../../assets/badges/roxo8.png');
        case 6: return require('../../assets/badges/vermelho7.png');
        case 5: return require('../../assets/badges/vermelho6.png');
        case 4: return require('../../assets/badges/esmeralda4.png');
        case 3: return require('../../assets/badges/esmeralda3.png');
        case 2: return require('../../assets/badges/laranja2.png');
        default: return require('../../assets/badges/laranja1.png');
      }
    } catch { return require('../../assets/badges/laranja1.png'); }
  };

  const badgeSource = getBadgeSource(operator.rank);

  return (
    <Modal 
      visible={Boolean(visible)} 
      animationType="fade" 
      transparent={Boolean(true)}
    >
      <View style={styles.modalBg}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>// DOSSIER_ANALYSIS: {operator.name}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>X</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.profileHeader}>
              <View style={styles.badgeWrapper}>
                {imgError ? (
                  <View style={styles.fallbackBadge}>
                    <Text style={{ fontSize: 40 }}>👤</Text>
                  </View>
                ) : (
                  <Image 
                    source={badgeSource}
                    style={styles.shield}
                    resizeMode="contain"
                    onError={() => setImgError(true)}
                  />
                )}
              </View>
              <View style={styles.meta}>
                <Text style={styles.operatorName}>{operator.name.toUpperCase()}</Text>
                <Text style={styles.roleTag}>{operator.role}</Text>
                <View style={styles.rankBadge}>
                   <Text style={styles.rankText}>LEVEL_CERTIFIED</Text>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>ANALISE_DE_COMPETÊNCIA</Text>
            <EliteRadar completedLessonIds={operator.mockLessons || []} />

            <View style={styles.statsGrid}>
               <View style={styles.statBox}>
                 <Text style={styles.statLabel}>XP_ACUMULADO</Text>
                 <Text style={styles.statValue}>{operator.xp} bits</Text>
               </View>
               <View style={styles.statBox}>
                 <Text style={styles.statLabel}>STATUS_GRID</Text>
                 <Text style={[styles.statValue, { color: '#00ff9f' }]}>ONLINE</Text>
               </View>
            </View>

            {/* MEDAL OF VALOR — unlocks when 5+ emergency tasks completed */}
            {emergencyCount >= 5 && (
              <View style={styles.medalSection}>
                <View style={styles.medalHeader}>
                  <Image
                    source={require('../../assets/badges/emergencia.png')}
                    style={styles.medalIcon}
                    resizeMode="contain"
                  />
                  <View>
                    <Text style={styles.medalTitle}>MEDAL_OF_VALOR</Text>
                    <Text style={styles.medalSub}>Conteve {emergencyCount} brechas críticas</Text>
                  </View>
                </View>
              </View>
            )}

            <Text style={styles.footerText}>
              ESTE ARQUIVO É PROPRIEDADE DA SECROAD SYSTEMS. ACESSO NÃO AUTORIZADO É UMA VIOLAÇÃO DO PROTOCOLO GHOST.
            </Text>
          </ScrollView>

          <TouchableOpacity style={styles.exitBtn} onPress={onClose}>
             <Text style={styles.exitText}>FECHAR_DOSSIER</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxHeight: '85%',
    backgroundColor: '#050505',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 15,
    overflow: 'hidden',
  },
  header: {
    padding: 15,
    backgroundColor: '#111',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  headerTitle: {
    color: '#00d4ff',
    fontFamily: 'RobotoMono_700Bold',
    fontSize: 10,
    letterSpacing: 1,
  },
  closeBtn: {
    padding: 5,
  },
  closeText: {
    color: '#a0a0a0',
    fontFamily: 'RobotoMono_700Bold',
  },
  content: {
    padding: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  badgeWrapper: {
  },
  shield: {
    width: 80,
    height: 80,
  },
  fallbackBadge: {
    width: 80,
    height: 80,
    backgroundColor: '#111',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  meta: {
    flex: 1,
  },
  operatorName: {
    color: '#fff',
    fontSize: 22,
    fontFamily: 'RobotoMono_700Bold',
  },
  roleTag: {
    color: '#bf00ff',
    fontSize: 11,
    fontFamily: 'RobotoMono_400Regular',
    marginTop: 2,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  rankBadge: {
    marginTop: 8,
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.3)',
  },
  rankText: {
    color: '#00d4ff',
    fontSize: 8,
    fontFamily: 'RobotoMono_700Bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#1a1a1a',
    marginVertical: 20,
  },
  sectionTitle: {
    color: '#00ff9f',
    fontSize: 10,
    fontFamily: 'RobotoMono_700Bold',
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#111',
  },
  statLabel: {
    color: '#444',
    fontSize: 8,
    fontFamily: 'RobotoMono_700Bold',
    marginBottom: 5,
  },
  statValue: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'RobotoMono_700Bold',
  },
  medalSection: {
    backgroundColor: 'rgba(255,34,34,0.05)',
    borderWidth: 1,
    borderColor: '#ff222230',
    borderRadius: 10,
    padding: 14,
    marginBottom: 20,
  },
  medalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  medalIcon: {
    width: 40,
    height: 40,
  },
  medalTitle: {
    color: '#ff2222',
    fontFamily: 'RobotoMono_700Bold',
    fontSize: 12,
    letterSpacing: 1,
  },
  medalSub: {
    color: '#555',
    fontFamily: 'RobotoMono_400Regular',
    fontSize: 9,
    marginTop: 3,
  },
  footerText: {
    color: '#222',
    fontSize: 8,
    fontFamily: 'RobotoMono_400Regular',
    textAlign: 'center',
    marginTop: 30,
    lineHeight: 14,
  },
  exitBtn: {
    backgroundColor: '#111',
    padding: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#222',
  },
  exitText: {
    color: '#a0a0a0',
    fontFamily: 'RobotoMono_700Bold',
    fontSize: 12,
  },
});
