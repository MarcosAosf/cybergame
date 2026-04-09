import React, { useState, useMemo, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSecStore } from '../store/useSecStore';
import { CyberBadge } from '../components/CyberBadge';
import { UserDossierModal } from '../components/UserDossierModal';
import { LeagueBrowser } from '../components/LeagueBrowser';
import { BitWallet } from '../components/BitWallet';
import { BitsToast } from '../components/BitsToast';

// Final 9-Tier Mock Data (Calibrated to True Power Progression Phase 34)
const generateMockData = () => {
  const names = [
    'root_user', 'cyber_ghost', 'glitch_master', 'net_stalker', 'proxy_admin', 
    'zero_day', 'shodan_crawler', 'pcap_analyst', 'sniff_bot'
  ];
  
  return names.map((name, i) => {
    // Ensuring mock users stay within their tiered XP zones
    const xp = 4500 - (i * 500); 
    return {
      id: (i + 1).toString(),
      name,
      xp,
      mockLessons: i < 3 ? ['l1', 'l2', 'l5', 'l7', 'l8'] : ['l1', 'l5'],
    };
  });
};

const MOCK_LEADERBOARD = generateMockData();

// Centralized True Power Scale (Phase 34)
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

const getIDColor = (index: number) => {
  if (index === 0) return '#ffd700'; // Gold
  if (index === 1) return '#c0c0c0'; // Silver
  if (index === 2) return '#cd7f32'; // Bronze
  return '#1a1a1a';
};

const RankItem = React.memo(({ item, index, onOpenDossier }: any) => {
  const tier = getTierFromXP(item.xp);
  const role = getRole(tier);
  const roleColor = getRoleColor(tier);
  const idColor = getIDColor(index);
  const displayId = `ID_${(index + 1).toString().padStart(3, '0')}`;
  
  // Progress to next XP milestone
  const milestones = [0, 501, 1001, 1501, 2001, 2501, 3001, 3501, 4001, 4501];
  const nextMilestone = milestones[Math.min(milestones.length - 1, tier)];
  const threatLevel = Math.min(0.95, item.xp / (nextMilestone || 4501));

  return (
    <TouchableOpacity 
      style={item.id === 'player' ? [styles.rankItem, styles.playerItem] : styles.rankItem}
      activeOpacity={0.7}
      onPress={() => onOpenDossier(item, role, tier)}
    >
      <Text style={[styles.rankIndex, { color: idColor }]}>{displayId}</Text>
      
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

      <View style={styles.xpContainer}>
        <Text style={styles.rankXP}>{item.xp}</Text>
        <Text style={styles.xpBox}>BITS</Text>
      </View>
    </TouchableOpacity>
  );
});

export const RankingScreen = () => {
  const { user, completedLessonIds, isOnFire, emergencyTasksCompleted } = useSecStore();
  
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [dossierVisible, setDossierVisible] = useState(false);
  const [leagueBrowserVisible, setLeagueBrowserVisible] = useState(false);

  const pulseAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.4, duration: 1500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const memoizedLeaderboard = useMemo(() => {
    const playerObj = { 
      id: 'player', 
      name: user.name, 
      xp: user.totalXP, 
      mockLessons: completedLessonIds,
      isPlayer: true 
    };
    return [...MOCK_LEADERBOARD, playerObj].sort((a, b) => b.xp - a.xp);
  }, [user.totalXP, user.name, completedLessonIds]);

  const playerTier = useMemo(() => getTierFromXP(user.totalXP), [user.totalXP]);
  const playerPosition = useMemo(() => {
    const p = memoizedLeaderboard.findIndex(item => item.id === 'player') + 1;
    return p > 0 ? p : 9;
  }, [memoizedLeaderboard]);

  const playerRole = getRole(playerTier);
  const playerRoleColor = getRoleColor(playerTier);

  const handleOpenDossier = (item: any, role: string, tier: number) => {
    // If this is the player's own dossier, pass their emergency count for Medal of Valor
    const isPlayer = item.id === 'player';
    setSelectedUser({
      ...item,
      role,
      rank: tier,
      emergencyTasksCompleted: isPlayer ? emergencyTasksCompleted : 0,
    });
    setDossierVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <BitsToast />
      <View style={styles.header}>
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
                <Text style={styles.statLabel}>ACCESS_BITS: <Text style={styles.statVal}>{user.totalXP}</Text></Text>
                <Text style={styles.statLabel}>GRID_POS: <Text style={styles.statVal}>{playerPosition}</Text></Text>
             </View>
           </View>
        </View>
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.listHeader}>// RANKING_TRUE_POWER_V3.4</Text>
        <FlatList
          data={memoizedLeaderboard}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <RankItem 
              item={item} 
              index={index} 
              onOpenDossier={handleOpenDossier}
            />
          )}
        />
      </View>

      {selectedUser && (
        <UserDossierModal 
          visible={dossierVisible}
          onClose={() => setDossierVisible(false)}
          operator={selectedUser}
        />
      )}

      <LeagueBrowser 
        visible={leagueBrowserVisible}
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
  header: {
    padding: 20,
    backgroundColor: '#050505',
    borderBottomWidth: 1,
    borderBottomColor: '#111',
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
    padding: 15,
    backgroundColor: '#050505',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#0a0a0a',
  },
  playerItem: {
    borderColor: '#bf00ff30',
    backgroundColor: '#050005',
  },
  rankIndex: {
    width: 55,
    fontFamily: 'RobotoMono_700Bold',
    fontSize: 10,
  },
  rankInfo: {
    flex: 1,
    paddingLeft: 10,
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
    width: 70,
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
});
