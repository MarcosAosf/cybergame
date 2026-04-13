import React, { useState, useMemo, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSecStore } from '../store/useSecStore';
import { CyberBadge } from '../components/CyberBadge';
import { UserDossierModal } from '../components/UserDossierModal';
import { LeagueBrowser } from '../components/LeagueBrowser';
import { BitWallet } from '../components/BitWallet';
import { BitsToast } from '../components/BitsToast';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../config/firebase';

// Cloud Scale (Phase 40: Integrated)
const getTierFromXP = (xp: number) => {
  if (xp >= 4001) return 9; // Ghost Commander (Roxo10) - God Tier
  if (xp >= 3501) return 8; // Specter Operator (Roxo9)
  if (xp >= 3001) return 7; // Warlord Drone (Roxo8)
  if (xp >= 2501) return 6; // Net Stalker (Vermelho7)
  if (xp >= 2001) return 5; // Void Architect (Vermelho6)
  if (xp >= 1501) return 4; // System Reaper (Esmeralda4)
  if (xp >= 1001) return 3; // Core Cracker (Esmeralda3)
  if (xp >= 501) return 2;  // Bit Raider (Laranja2)
  return 1;                 // Proto Hunter (Laranja1) - Base
};

const getRole = (tier: number) => {
  switch (tier) {
    case 9: return '[GHOST_COMMANDER]';
    case 8: return '[SPECTER_OPERATOR]';
    case 7: return '[WARLORD_DRONE]';
    case 6: return '[NET_STALKER]';
    case 5: return '[VOID_ARCHITECT]';
    case 4: return '[SYSTEM_REAPER]';
    case 3: return '[CORE_CRACKER]';
    case 2: return '[BIT_RAIDER]';
    case 1: return '[PROTO_HUNTER]';
    default: return '[PROTO_HUNTER]';
  }
};

const getRoleColor = (tier: number) => {
  if (tier >= 7) return '#bf00ff';
  if (tier >= 4) return '#00d4ff';
  if (tier >= 2) return '#00ff9f';
  return '#555';
};

const getGlowColor = (tier: number) => {
  if (tier >= 7) return '#8000ff'; // Purple (Roxo)
  if (tier >= 5) return '#ff4b4b'; // Red (Vermelho)
  if (tier >= 3) return '#50c878'; // Emerald (Esmeralda)
  return '#ff8c00'; // Orange (Laranja)
};

const getIDColor = (index: number) => {
  if (index === 0) return '#ffd700'; // Gold
  if (index === 1) return '#c0c0c0'; // Silver
  if (index === 2) return '#cd7f32'; // Bronze
  return '#1a1a1a';
};

const ALL_RANKS_JOURNEY = [9, 8, 7, 6, 5, 4, 3, 2, 1];
const MILESTONES = [0, 501, 1001, 1501, 2001, 2501, 3001, 3501, 4001, 4501];
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const ProgressionItem = React.memo(({ tier, playerTier, pulseAnim }: any) => {
  const role = getRole(tier);
  const roleColor = getRoleColor(tier);
  const glowColor = getGlowColor(tier);
  const isCurrent = tier === playerTier;
  const isLocked = tier > playerTier;

  return (
    <Animated.View style={[
      styles.rankItem,
      {
        borderColor: isLocked ? '#222' : glowColor,
        borderWidth: isCurrent ? 2 : 1,
        opacity: isLocked ? 0.5 : 1,
      },
      isCurrent ? {
        backgroundColor: '#1a0033'
      } : null
    ]}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={isLocked ? { opacity: 0.5 } : {}}>
          <CyberBadge rank={tier} size={40} />
        </View>
        <View style={{ marginLeft: 15 }}>
          <Text style={[styles.rankName, { color: isLocked ? '#555' : roleColor }]}>{role}</Text>
          {isCurrent && <Text style={{ color: '#fff', fontSize: 10, marginTop: 4, fontFamily: 'RobotoMono_700Bold' }}>// PATENTE ATUAL</Text>}
          {isLocked && (
            <Text style={{ color: '#444', fontSize: 9, marginTop: 4, fontFamily: 'RobotoMono_400Regular' }}>
               // REQUER: {MILESTONES[tier - 1]} BYTES
            </Text>
          )}
          {!isCurrent && !isLocked && <Text style={{ color: '#00ff9f', fontSize: 10, marginTop: 4, fontFamily: 'RobotoMono_400Regular' }}>// SINCRONIZADO</Text>}
        </View>
      </View>
    </Animated.View>
  );
});

const RankItem = React.memo(({ item, index, onOpenDossier, pulseAnim }: any) => {
  const xp = item.totalXP || 0;
  const tier = getTierFromXP(xp);
  const role = getRole(tier);
  const roleColor = getRoleColor(tier);
  const glowColor = getGlowColor(tier);
  const idColor = getIDColor(index);

  const nextMilestone = MILESTONES[Math.min(MILESTONES.length - 1, tier)];
  const threatLevel = Math.min(0.95, xp / (nextMilestone || 4501));

  return (
    <AnimatedTouchable
      style={[
        styles.rankItem,
        item.id === auth.currentUser?.uid ? styles.playerItem : null,
        {
          borderColor: glowColor,
          borderWidth: 1.5,
        }
      ]}
      activeOpacity={0.7}
      onPress={() => onOpenDossier(item, role, tier)}
    >
      <View style={styles.leftGroup}>
        <Text style={[styles.positionText, { color: idColor }]}>#{index + 1}</Text>
        <View style={styles.rankInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.rankName}>{item.name}</Text>
            <View style={styles.badgeContainer}>
              <CyberBadge rank={tier} size={24} />
            </View>
          </View>

          <Text style={[styles.roleText, { color: roleColor }]}>{role}</Text>

          <View style={styles.threatContainer}>
            <View style={[styles.threatFill, { width: `${threatLevel * 100}%`, backgroundColor: roleColor }]} />
          </View>
        </View>
      </View>

      <View style={styles.xpContainer}>
        <Text style={styles.rankXP}>{xp}</Text>
        <Text style={styles.xpBox}>BYTES</Text>
        {item.bits !== undefined && (
          <Text style={styles.bitsSecondary}>₿ {item.bits}</Text>
        )}
      </View>
    </AnimatedTouchable>
  );
});

export const RankingScreen = () => {
  const { user, stats, emergencyTasksCompleted } = useSecStore();
  const pulseAnim = useRef(new Animated.Value(0.4)).current;

  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [dossierVisible, setDossierVisible] = useState(false);
  const [leagueBrowserVisible, setLeagueBrowserVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'my_ranking' | 'top_10'>('my_ranking');

  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    // [GUARD]: Ensure listener only starts if session is hot
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'users'),
      orderBy('userXP', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const users: any[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        users.push({
          id: doc.id,
          name: data.userName || 'Unknown Agent',
          totalXP: data.userXP || 0,
          bits: data.userBits || 0,
          rank: data.userRank || 'Recruta',
          emergencyTasksCompleted: data.emergencyTasksCompleted || 0,
        });
      });
      setLeaderboard(users);
      setLoading(false);
      setAccessDenied(false);
    }, (error) => {
      console.warn('--- [RANKING_ERROR]: Sync Interrupted ---', error);
      setLoading(false);
      if (error.code === 'permission-denied') {
        setAccessDenied(true);
      }
    });

    return () => unsubscribe();
  }, [user.totalXP, stats.bits]);

  const playerPosition = useMemo(() => {
    const index = leaderboard.findIndex(u => u.id === auth.currentUser?.uid);
    return index !== -1 ? index + 1 : '??';
  }, [leaderboard]);

  const playerTier = useMemo(() => getTierFromXP(user.totalXP), [user.totalXP]);
  const playerRole = getRole(playerTier);
  const playerRoleColor = getRoleColor(playerTier);
  const playerGlowColor = getGlowColor(playerTier);

  const tabAnim = useRef(new Animated.Value(0)).current;

  const handleTabSwitch = (tab: 'my_ranking' | 'top_10') => {
    setActiveTab(tab);
    Animated.spring(tabAnim, {
      toValue: tab === 'my_ranking' ? 0 : 1,
      useNativeDriver: false,
      friction: 8,
      tension: 50,
    }).start();
  };

  const displayedList = leaderboard.slice(0, 10);

  const handleOpenDossier = (item: any, role: string, tier: number) => {
    const isPlayer = item.id === auth.currentUser?.uid;
    setSelectedUser({
      ...item,
      xp: item.totalXP,
      role,
      rank: tier,
      emergencyTasksCompleted: isPlayer ? emergencyTasksCompleted : (item.emergencyTasksCompleted || 0),
    });
    setDossierVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <BitsToast />
      <Animated.View style={[styles.headerCard, {
        borderColor: playerGlowColor,
      }]}>
        <View style={styles.dynamicHeader}>
          <View style={[styles.headerIconBox, { borderColor: playerTier >= 7 ? playerRoleColor : '#222' }]}>
            <CyberBadge rank={playerTier} size={70} />
            {playerTier >= 7 && <View style={[styles.halo, { borderColor: playerRoleColor }]} />}
          </View>

          <View style={styles.headerMeta}>
            <View style={styles.titleRow}>
              <Text style={[styles.patentTitle, { color: playerRoleColor }]}>{playerRole}</Text>
              <View style={styles.headerRight}>
                <BitWallet />
                <TouchableOpacity
                  onPress={() => setLeagueBrowserVisible(true)}
                  style={styles.hierarchyBtn}
                >
                  <Text style={styles.hierarchyText}>[HIERARCHY]</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Animated.View style={{ opacity: pulseAnim }}>
              <Text style={[styles.statusVerified, { color: playerRoleColor }]}>
                OPERATOR_CLEARANCE: LEVEL_{playerTier}
              </Text>
            </Animated.View>

            <View style={styles.headerStats}>
              <Text style={styles.statLabel}>TOTAL_BYTES: <Text style={styles.statVal}>{user.totalXP}</Text></Text>
              <Text style={styles.statLabel}>GRID_POS: <Text style={styles.statVal}>{playerPosition}</Text></Text>
            </View>
          </View>
        </View>
      </Animated.View>

      <View style={styles.tabsWrapper}>
        <Animated.View style={[
          styles.tabIndicator,
          {
            left: tabAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '50%']
            })
          }
        ]} />
        <TouchableOpacity
          style={styles.tab}
          onPress={() => handleTabSwitch('my_ranking')}
        >
          <Text style={[styles.tabLabel, activeTab === 'my_ranking' ? styles.activeTabLabel : null]}>MEU RANKING</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => handleTabSwitch('top_10')}
        >
          <Text style={[styles.tabLabel, activeTab === 'top_10' ? styles.activeTabLabel : null]}>TOP 10 GLOBAL</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        {activeTab === 'my_ranking' ? (
          <>
            <Text style={styles.listHeader}>// PROGRESSION_SCALE_V3.8</Text>
            <FlatList
              data={ALL_RANKS_JOURNEY}
              keyExtractor={(item) => item.toString()}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <ProgressionItem
                  tier={item}
                  playerTier={playerTier}
                  pulseAnim={pulseAnim}
                />
              )}
            />
          </>
        ) : (
          <>
            <Text style={styles.listHeader}>// RANKING_TRUE_POWER_GLOBAL</Text>
            {accessDenied ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorPulse}>[ACCESS_DENIED]</Text>
                <Text style={styles.errorSub}>PERMISSÕES_INSUFICIENTES_NA_GRID</Text>
                <Text style={styles.errorFix}>// REAUTENTICAÇÃO_REQUERIDA</Text>
              </View>
            ) : (
              <FlatList
                data={displayedList}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => (
                  <RankItem
                    item={item}
                    index={index}
                    onOpenDossier={handleOpenDossier}
                    pulseAnim={pulseAnim}
                  />
                )}
              />
            )}
          </>
        )}
      </View>

      {selectedUser && (
        <UserDossierModal
          visible={Boolean(dossierVisible)}
          onClose={() => setDossierVisible(false)}
          operator={selectedUser}
        />
      )}

      <LeagueBrowser
        visible={Boolean(leagueBrowserVisible)}
        onClose={() => setLeagueBrowserVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  headerCard: {
    padding: 20,
    backgroundColor: '#050505',
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 15,
    borderWidth: 1,
  },
  dynamicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  headerIconBox: {
    width: 90,
    height: 90,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    position: 'relative',
  },
  halo: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    opacity: 0.15,
  },
  headerMeta: {
    flex: 1,
    marginLeft: 20,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  patentTitle: {
    fontSize: 14,
    fontFamily: 'RobotoMono_700Bold',
    letterSpacing: 1,
  },
  statusVerified: {
    fontSize: 8,
    fontFamily: 'RobotoMono_700Bold',
    marginTop: 4,
  },
  headerStats: {
    marginTop: 15,
    gap: 12,
    flexDirection: 'row',
  },
  statLabel: {
    color: '#333',
    fontSize: 9,
    fontFamily: 'RobotoMono_400Regular',
  },
  statVal: {
    color: '#fff',
    fontFamily: 'RobotoMono_700Bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  hierarchyBtn: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: '#222',
    borderRadius: 4,
  },
  hierarchyText: {
    color: '#444',
    fontSize: 6,
    fontFamily: 'RobotoMono_700Bold',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  tabsWrapper: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 8,
    backgroundColor: '#0a0a0a',
    position: 'relative',
    height: 42,
  },
  tabIndicator: {
    position: 'absolute',
    width: '50%',
    height: '100%',
    backgroundColor: '#111',
    borderBottomWidth: 2,
    borderBottomColor: '#00d4ff',
    borderRadius: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  tabLabel: {
    fontFamily: 'RobotoMono_700Bold',
    fontSize: 10,
    color: '#555',
  },
  activeTabLabel: {
    color: '#00d4ff',
  },
  listHeader: {
    color: '#00ff9f',
    fontFamily: 'RobotoMono_400Regular',
    fontSize: 8,
    marginBottom: 20,
    opacity: 0.3,
  },
  rankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#050505',
    borderRadius: 12,
    marginBottom: 12,
  },
  playerItem: {
    backgroundColor: '#1a0033',
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  positionText: {
    fontFamily: 'RobotoMono_700Bold',
    fontSize: 14,
    marginRight: 10,
    width: 30,
  },
  rankInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rankName: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'RobotoMono_700Bold',
  },
  badgeContainer: {
    flexDirection: 'row',
  },
  roleText: {
    fontSize: 8,
    fontFamily: 'RobotoMono_400Regular',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  threatContainer: {
    height: 2,
    backgroundColor: '#111',
    marginTop: 8,
    borderRadius: 1,
    width: '80%',
    overflow: 'hidden',
  },
  threatFill: {
    height: '100%',
  },
  xpContainer: {
    alignItems: 'flex-end',
    width: 80,
    paddingRight: 20,
  },
  rankXP: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'RobotoMono_700Bold',
  },
  xpBox: {
    color: '#00d4ff',
    fontSize: 7,
    fontFamily: 'RobotoMono_400Regular',
  },
  bitsSecondary: {
    color: '#00ff9f',
    fontSize: 8,
    fontFamily: 'RobotoMono_400Regular',
    marginTop: 4,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
  },
  errorPulse: {
    color: '#ff4b4b',
    fontSize: 18,
    fontFamily: 'RobotoMono_700Bold',
    letterSpacing: 2,
  },
  errorSub: {
    color: '#ff4b4b',
    fontSize: 10,
    fontFamily: 'RobotoMono_400Regular',
    opacity: 0.7,
  },
  errorFix: {
    color: '#444',
    fontSize: 9,
    fontFamily: 'RobotoMono_400Regular',
    marginTop: 20,
  },
});
