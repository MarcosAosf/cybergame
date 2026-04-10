import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';

interface StatItemProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
}

export const StatItem: React.FC<StatItemProps> = ({ label, value, icon, color = "#00d4ff" }) => {
  // --- SAFE_CAST: Terminal Fallback ---
  const displayValue = (value === null || value === undefined) ? '---' : value;

  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>{icon}</View>
      <View>
        <Text style={{ ...styles.value, color: color || "#00d4ff" }}>{displayValue}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginHorizontal: 4,
  },
  iconWrapper: {
    marginRight: 10,
  },
  label: {
    fontSize: 10,
    color: COLORS.textDim,
    textTransform: 'uppercase',
    fontFamily: 'RobotoMono_400Regular',
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Inter_700Bold',
  },
});
