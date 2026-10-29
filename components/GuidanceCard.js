import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../styles/theme';
import { CONFIG } from '../constants/signalPoints';

const GuidanceCard = React.memo(({ name, distanceMeters, compassDirection }) => {
  const isArrived = distanceMeters <= CONFIG.ARRIVED_THRESHOLD_M;

  return (
    <View style={[styles.card, isArrived && styles.arrivedCard]}>
      <Text style={styles.label}>NEAREST OFFLINE ZONE</Text>
      <Text style={styles.targetName}>{name}</Text>
      
      {isArrived ? (
        <View style={styles.arrivedContainer}>
          <Text style={styles.arrivedText}>🟢 ARRIVED IN COVERAGE ZONE</Text>
        </View>
      ) : (
        <View style={styles.metrics}>
          <Text style={styles.distance}>
            {distanceMeters > 1000 
              ? `${(distanceMeters / 1000).toFixed(2)} km` 
              : `${Math.round(distanceMeters)} m`}
          </Text>
          <Text style={styles.direction}>Head {compassDirection}</Text>
        </View>
      )}
    </View>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.name === nextProps.name &&
    Math.round(prevProps.distanceMeters) === Math.round(nextProps.distanceMeters) &&
    prevProps.compassDirection === nextProps.compassDirection
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: spacing(5),
    width: '100%',
  },
  arrivedCard: { borderColor: colors.accent, borderWidth: 1.5 },
  label: { ...typography.body, color: colors.textSecondary, fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  targetName: { ...typography.title, color: colors.textPrimary, fontSize: 22, marginTop: spacing(1), marginBottom: spacing(3) },
  metrics: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  distance: { ...typography.title, color: colors.accent, fontSize: 32 },
  direction: { ...typography.subtitle, color: colors.textPrimary },
  arrivedContainer: { paddingVertical: spacing(2), alignItems: 'center' },
  arrivedText: { ...typography.subtitle, color: colors.accent, fontWeight: '800' },
});

export default GuidanceCard;
