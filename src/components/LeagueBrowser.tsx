import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';

interface LeagueBrowserProps {
  visible: boolean;
  onClose: () => void;
}

const NONA_HIERARCHY = [
  { rank: 1, title: '[PROTO_HUNTER]', xp: '0 - 500', asset: require('../../assets/badges/laranja1.png'), color: '#555' },
  { rank: 2, title: '[BIT_RAIDER]', xp: '501 - 1000', asset: require('../../assets/badges/laranja2.png'), color: '#00ff9f' },
  { rank: 3, title: '[CORE_CRACKER]', xp: '1001 - 1500', asset: require('../../assets/badges/esmeralda3.png'), color: '#00ff9f' },
  { rank: 4, title: '[SYSTEM_REAPER]', xp: '1501 - 2000', asset: require('../../assets/badges/esmeralda4.png'), color: '#00d4ff' },
  { rank: 5, title: '[VOID_ARCHITECT]', xp: '2001 - 2500', asset: require('../../assets/badges/vermelho6.png'), color: '#00d4ff' },
  { rank: 6, title: '[NET_STALKER]', xp: '2501 - 3000', asset: require('../../assets/badges/vermelho7.png'), color: '#ffaa00' },
  { rank: 7, title: '[WARLORD_DRONE]', xp: '3001 - 3500', asset: require('../../assets/badges/roxo8.png'), color: '#ffaa00' },
  { rank: 8, title: '[SPECTER_OPERATOR]', xp: '3501 - 4000', asset: require('../../assets/badges/roxo9.png'), color: '#bf00ff' },
  { rank: 9, title: '[GHOST_COMMANDER]', xp: '4001+', asset: require('../../assets/badges/roxo10.png'), color: '#bf00ff' },
];

export const LeagueBrowser: React.FC<LeagueBrowserProps> = ({ visible, onClose }) => {
  return (
    <Modal 
      visible={Boolean(visible)} 
      animationType="slide" 
      transparent={true}
    >
      <View style={styles.modalBg}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>// BROWSER: TRUE_POWER_PROGRESSION_V3.4</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>X</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.introText}>
              TRUE_POWER_SINCRO. A escala numérica dita o poder. Inicie seu protocolo com credenciais laranja e penetre as camadas de segurança até o God-Tier roxo (Nível 9).
            </Text>

            {NONA_HIERARCHY.map((level) => (
              <View key={level.rank} style={[styles.tierCard, { borderColor: level.color + '30' }]}>
                <View style={styles.badgeWrapper}>
                   <Image source={level.asset} style={styles.badgeImg} resizeMode="contain" />
                </View>
                <View style={styles.tierInfo}>
                  <Text style={[styles.tierTitle, { color: level.color }]}>{level.title}</Text>
                  <View style={styles.metaRow}>
                    <Text style={styles.rankBadge}>TIER {level.rank}</Text>
                    <Text style={styles.xpReq}>REQUISITO: {level.xp} bits</Text>
                  </View>
                </View>
                {level.rank >= 7 && <View style={[styles.eliteGlow, { backgroundColor: level.color }]} />}
              </View>
            ))}

            <Text style={styles.footerText}>
              HIERARQUIA_ALPHA: ATIVA. O GHOST_COMMANDER (ROXO10) É O ÁPICE ABSOLUTO DO GRID.
            </Text>
          </ScrollView>

          <TouchableOpacity style={styles.exitBtn} onPress={onClose}>
             <Text style={styles.exitText}>RETORNAR_AO_ANALISE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.98)',
    justifyContent: 'center',
    paddingTop: 45,
  },
  container: {
    flex: 1,
    backgroundColor: '#050505',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: '#111',
  },
  header: {
    padding: 20,
    backgroundColor: '#0a0a0a',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerTitle: {
    color: '#00ff9f',
    fontFamily: 'RobotoMono_700Bold',
    fontSize: 9,
    letterSpacing: 2,
  },
  closeBtn: {
    padding: 5,
  },
  closeText: {
    color: '#333',
    fontFamily: 'RobotoMono_700Bold',
  },
  content: {
    padding: 20,
  },
  introText: {
    color: '#444',
    fontFamily: 'RobotoMono_400Regular',
    fontSize: 9,
    lineHeight: 14,
    marginBottom: 25,
    textAlign: 'center',
  },
  tierCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#070707',
    borderRadius: 8,
    borderWidth: 1,
    padding: 10,
    marginBottom: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  badgeWrapper: {
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeImg: {
    width: 32,
    height: 32,
  },
  tierInfo: {
    flex: 1,
    marginLeft: 12,
  },
  tierTitle: {
    fontSize: 11,
    fontFamily: 'RobotoMono_700Bold',
    letterSpacing: 0.5,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 12,
  },
  rankBadge: {
    fontSize: 7,
    fontFamily: 'RobotoMono_700Bold',
    color: '#444',
  },
  xpReq: {
    fontSize: 7,
    fontFamily: 'RobotoMono_700Bold',
    color: '#00d4ff',
  },
  eliteGlow: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 2,
    opacity: 0.3,
  },
  footerText: {
    color: '#1a1a1a',
    fontSize: 7,
    fontFamily: 'RobotoMono_400Regular',
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 12,
    marginBottom: 40,
  },
  exitBtn: {
    padding: 25,
    backgroundColor: '#0a0a0a',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#222',
  },
  exitText: {
    color: '#00ff9f',
    fontFamily: 'RobotoMono_700Bold',
    fontSize: 12,
  },
});
