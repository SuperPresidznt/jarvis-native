/**
 * Sparkline Component
 * Mini line chart for showing trend data at a glance
 * Uses react-native-svg for lightweight, performant rendering
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { normalizeData, generateSmoothSparklinePath } from '../../utils/chartUtils';
import { colors } from '../../theme';

export type SparklineTrend = 'positive' | 'negative' | 'neutral';

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  trend?: SparklineTrend;
  strokeWidth?: number;
  smooth?: boolean;
  showGradient?: boolean;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  width = 100,
  height = 50,
  color,
  trend = 'neutral',
  strokeWidth = 2,
  smooth = true,
  showGradient = false,
}) => {
  // If no data, show flat line at center
  if (!data || data.length === 0) {
    return (
      <View style={[styles.container, { width, height }]}>
        <Svg width={width} height={height}>
          <Path
            d={`M 0 ${height / 2} L ${width} ${height / 2}`}
            stroke={getTrendColor(trend)}
            strokeWidth={strokeWidth}
            strokeOpacity={0.3}
            fill="none"
          />
        </Svg>
      </View>
    );
  }

  // Normalize data to 0-1 range
  const normalizedData = normalizeData(data);

  // Generate SVG path
  const pathData = smooth
    ? generateSmoothSparklinePath(normalizedData, width, height, 4)
    : generateSmoothSparklinePath(normalizedData, width, height, 4);

  const lineColor = color || getTrendColor(trend);

  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height}>
        {showGradient && (
          <Defs>
            <LinearGradient id="sparklineGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={lineColor} stopOpacity="0.3" />
              <Stop offset="1" stopColor={lineColor} stopOpacity="0" />
            </LinearGradient>
          </Defs>
        )}
        <Path
          d={pathData}
          stroke={lineColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </Svg>
    </View>
  );
};

/**
 * Get color based on trend direction
 */
function getTrendColor(trend: SparklineTrend): string {
  switch (trend) {
    case 'positive':
      return colors.success;
    case 'negative':
      return colors.error;
    case 'neutral':
      return colors.info;
    default:
      return colors.text.tertiary;
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Sparkline;
