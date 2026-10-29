import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../styles/theme';

const LocationCard = React.memo(({ latitude, longitude, accuracy }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.header}>📡 CURRENT FIX</Text>
      <View style={styles.row}>
        <Text style={styles.label}>LAT:</Text>
        <Text style={styles.value}>{latitude.toFixed(6)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>LON:</Text>
        <Text style={styles.value}>{longitude.toFixed(6)}</Text>
      </View>
      <Text style={styles.footer}>Accuracy: ±{Math.round(accuracy)} meters</Text>
    </View>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.latitude.toFixed(4) === nextProps.latitude.toFixed(4) &&
    prevProps.longitude.toFixed(4) === nextProps.longitude.toFixed(4) &&
    Math.round(prevProps.accuracy) === Math.round(nextProps.accuracy)
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: spacing(4),
    width: '100%',
    marginBottom: spacing(4),
  },
  header: { ...typography.subtitle, color: colors.textSecondary, marginBottom: spacing(2) },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing(1) },
  label: { ...typography.body, color: colors.textSecondary, fontWeight: '700' },
  value: { ...typography.monospace, color: colors.textPrimary },
  footer: { ...typography.body, color: colors.textSecondary, fontSize: 12, marginTop: spacing(1), textAlign: 'right' },
});

export default LocationCard;
