import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, G, Defs, Filter, FeGaussianBlur, FeMerge, FeMergeNode } from 'react-native-svg';
import { 
  Layer1Physical, 
  Layer2Datalink, 
  Layer3Network, 
  Layer4Transport, 
  Layer5Session, 
  Layer6Presentation, 
  Layer7Application 
} from './layers/LayerGlyphs';

interface ShieldIconProps {
  size?: number;
  completedLayers?: number[];
}

export const ShieldIcon: React.FC<ShieldIconProps> = ({ size = 200, completedLayers = [] }) => {
  const isL1 = completedLayers.includes(1);
  const isL2 = completedLayers.includes(2);
  const isL3 = completedLayers.includes(3);
  const isL4 = completedLayers.includes(4);
  const isL5 = completedLayers.includes(5);
  const isL6 = completedLayers.includes(6);
  const isL7 = completedLayers.includes(7);

  const colors = {
    active: '#00d4ff',
    inactive: '#222222',
  };

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Defs>
          <Filter id="shieldGlow" x="-20%" y="-20%" width="140%" height="140%">
            <FeGaussianBlur stdDeviation="1.5" result="blur" />
            <FeMerge>
              <FeMergeNode in="blur" />
              <FeMergeNode in="SourceGraphic" />
            </FeMerge>
          </Filter>
        </Defs>

        {/* Outer Shield Shell */}
        <G filter="url(#shieldGlow)">
          <Path 
            d="M50 5 
               C30 5, 15 15, 15 45 
               C15 65, 40 85, 50 95 
               C60 85, 85 65, 85 45 
               C85 15, 70 5, 50 5Z" 
            fill="none" 
            stroke={completedLayers.length > 0 ? "#00d4ff" : "#1a1a1a"} 
            strokeWidth="1.5"
          />
        </G>

        {/* Central Slots for Glyphs */}
        {/* Layer 7 (Top) */}
        <G transform="translate(40, 15)">
          <Layer7Application color={isL7 ? colors.active : colors.inactive} />
        </G>

        {/* Layer 6 & 5 (Middle Top) */}
        <G transform="translate(25, 30)">
          <Layer6Presentation color={isL6 ? colors.active : colors.inactive} />
        </G>
        <G transform="translate(55, 30)">
          <Layer5Session color={isL5 ? colors.active : colors.inactive} />
        </G>

        {/* Layer 4 (Center) */}
        <G transform="translate(40, 45)">
          <Layer4Transport color={isL4 ? colors.active : colors.inactive} />
        </G>

        {/* Layer 3 & 2 (Middle Bottom) */}
        <G transform="translate(25, 60)">
          <Layer3Network color={isL3 ? colors.active : colors.inactive} />
        </G>
        <G transform="translate(55, 60)">
          <Layer2Datalink color={isL2 ? colors.active : colors.inactive} />
        </G>

        {/* Layer 1 (Bottom) */}
        <G transform="translate(40, 75)">
          <Layer1Physical color={isL1 ? colors.active : colors.inactive} />
        </G>
      </Svg>
    </View>
  );
};
