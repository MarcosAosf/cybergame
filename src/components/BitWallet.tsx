import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSecStore } from '../store/useSecStore';

export const BitWallet = () => {
  const bits = useSecStore(state => state.stats.bits);
  const bytes = useSecStore(state => state.user.totalXP);
  
  return (
    <View style={styles.container}>
      <View style={styles.statBox}>
        <Text style={[styles.statText, { color: '#00d4ff' }]}>⚡ {bytes}B</Text>
      </View>
      <View style={styles.statBox}>
        <Text style={styles.statText}>฿ {bits}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    color: '#00ff9f',
    fontFamily: 'RobotoMono_700Bold',
    fontSize: 12,
    letterSpacing: 0.5,
  },
});
