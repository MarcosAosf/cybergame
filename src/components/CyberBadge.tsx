import React, { useState } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';

interface CyberBadgeProps {
  rank: number;
  size?: number;
}

export const CyberBadge: React.FC<CyberBadgeProps> = ({ rank, size = 28 }) => {
  const [loadError, setLoadError] = useState(false);

  // High-Fidelity 9-Tier Mapping (Phase 34 - True Power Progression Calibration)
  // Logic: Lower numbers (Laranja) are entry, Higher numbers (Roxo10) are elite God-Tier.
  const getBadgeSource = (rank: number) => {
    try {
      switch (rank) {
        case 1: return require('../../assets/badges/laranja1.png');   // PROTO_HUNTER
        case 2: return require('../../assets/badges/laranja2.png');   // BIT_RAIDER
        case 3: return require('../../assets/badges/esmeralda3.png'); // CORE_CRACKER
        case 4: return require('../../assets/badges/esmeralda4.png'); // SYSTEM_REAPER
        case 5: return require('../../assets/badges/vermelho6.png');  // VOID_ARCHITECT
        case 6: return require('../../assets/badges/vermelho7.png');  // NET_STALKER
        case 7: return require('../../assets/badges/roxo8.png');      // WARLORD_DRONE
        case 8: return require('../../assets/badges/roxo9.png');      // SPECTER_OPERATOR
        case 9: return require('../../assets/badges/roxo10.png');     // GHOST_COMMANDER
        default: return require('../../assets/badges/laranja1.png'); 
      }
    } catch (e) {
      return null;
    }
  };

  const getFallbackIcon = () => {
    if (rank === 9) return '🥇'; // Now Tier 9 is the God-Tier reward.
    if (rank === 8) return '🥈';
    if (rank === 7) return '🥉';
    return '⚡';
  };

  const getFallbackColor = () => {
    if (rank >= 7) return '#bf00ff';
    if (rank >= 4) return '#00d4ff'; 
    return '#555';
  };

  const source = getBadgeSource(rank);

  if (loadError || !source) {
    return (
      <View style={[styles.fallbackContainer, { width: size, height: size, borderColor: getFallbackColor() }]}>
        <Text style={[styles.fallbackText, { color: getFallbackColor() }]}>{getFallbackIcon()}</Text>
      </View>
    );
  }

  return (
    <View style={styles.shadowWrapper}>
      <Image 
        source={source}
        style={{ width: size, height: size }}
        resizeMode="contain"
        onError={() => setLoadError(true)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  shadowWrapper: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 3,
    marginHorizontal: 4,
  },
  fallbackContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 6,
    backgroundColor: '#0a0a0a',
    marginHorizontal: 4,
  },
  fallbackText: {
    fontSize: 12,
    fontFamily: 'RobotoMono_700Bold',
  },
});
