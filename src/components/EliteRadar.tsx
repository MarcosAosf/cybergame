import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Polygon, Line, Circle } from 'react-native-svg';

interface EliteRadarProps {
  completedLessonIds: string[];
}

export const EliteRadar: React.FC<EliteRadarProps> = ({ completedLessonIds }) => {
  const size = 180;
  const center = size / 2;
  const radius = (size / 2) - 20;

  // Layer mapping and counts (Calibration based on current lessons.ts)
  const stats = [
    { label: 'CAM_1', count: completedLessonIds.filter(id => id.startsWith('l1')).length, total: 2 },
    { label: 'CAM_2', count: completedLessonIds.filter(id => id.startsWith('l2')).length, total: 1 },
    { label: 'CAM_4', count: completedLessonIds.filter(id => id.startsWith('l5') || id.startsWith('l6')).length, total: 2 },
    { label: 'CAM_7', count: completedLessonIds.filter(id => id.startsWith('l7') || id.startsWith('l8')).length, total: 2 },
  ];

  // Radar logic: 4 axes (90 degrees apart)
  const getPoints = () => {
    return stats.map((stat, i) => {
      const angle = (i * Math.PI) / 2 - Math.PI / 2;
      const value = Math.max(0.1, stat.count / stat.total); // Minimum 0.1 for visual trace
      const x = center + radius * value * Math.cos(angle);
      const y = center + radius * value * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');
  };

  return (
    <View style={styles.container}>
      <Svg height={size} width={size}>
        {/* Grid Background */}
        {[0.25, 0.5, 0.75, 1].map((r) => (
          <Circle
            key={r}
            cx={center}
            cy={center}
            r={radius * r}
            stroke="#1a1a1a"
            strokeWidth="1"
            fill="none"
          />
        ))}

        {/* Axes Lines */}
        {stats.map((_, i) => {
          const angle = (i * Math.PI) / 2 - Math.PI / 2;
          const x2 = center + radius * Math.cos(angle);
          const y2 = center + radius * Math.sin(angle);
          return (
            <Line
              key={i}
              x1={center}
              y1={center}
              x2={x2}
              y2={y2}
              stroke="#1a1a1a"
              strokeWidth="1"
            />
          );
        })}

        {/* Data Polygon */}
        <Polygon
          points={getPoints()}
          fill="rgba(0, 212, 255, 0.3)"
          stroke="#00d4ff"
          strokeWidth="2"
        />

        {/* Vertices */}
        {getPoints().split(' ').map((point, i) => {
          const [x, y] = point.split(',');
          return <Circle key={i} cx={x} cy={y} r="3" fill="#00d4ff" />;
        })}
      </Svg>
      
      <View style={styles.labelsContainer}>
        {stats.map((stat, i) => (
          <Text key={i} style={[styles.labelText, styles[`label${i}`]]}>
            {stat.label}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    backgroundColor: '#050505',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#111',
  },
  labelsContainer: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
  },
  labelText: {
    position: 'absolute',
    color: '#555',
    fontSize: 9,
    fontFamily: 'RobotoMono_700Bold',
  },
  label0: { top: 10, alignSelf: 'center' }, // Top
  label1: { right: 10, top: '50%', marginTop: -5 }, // Right
  label2: { bottom: 10, alignSelf: 'center' }, // Bottom
  label3: { left: 10, top: '50%', marginTop: -5 }, // Left
});
