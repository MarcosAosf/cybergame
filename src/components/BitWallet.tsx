import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSecStore } from '../store/useSecStore';

export const BitWallet = () => {
  const bits = useSecStore(state => state.stats.bits);
  return (
    <View style={styles.wallet}>
      <Text style={styles.walletText}>[ ₿ {bits.toLocaleString()} BITS ]</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wallet: {
    backgroundColor: 'rgba(0, 255, 159, 0.05)',
    borderWidth: 1,
    borderColor: '#00ff9f22',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  walletText: {
    color: '#00ff9f',
    fontFamily: 'RobotoMono_700Bold',
    fontSize: 11,
    letterSpacing: 1,
  },
});
