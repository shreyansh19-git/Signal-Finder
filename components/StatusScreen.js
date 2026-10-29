import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { colors, spacing, typography } from '../styles/theme';

export default function StatusScreen({ variant, message, onRetry }) {
  const isError = variant === 'error';

  return (
    <View style={styles.container}>
      {isError ? (
        <View style={styles.card}>
          <Text style={styles.icon}>⚠️</Text>
          <Text style={styles.title}>System Interruption</Text>
          <Text style={styles.message}>{message || 'An unrecognized hardware error occurred.'}</Text>
          <TouchableOpacity style={styles.button} onPress={onRetry} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.card}>
          <ActivityIndicator size="large" color={colors.accent} style={{ marginBottom: spacing(4) }} />
          <Text style={styles.title}>Acquiring Fix...</Text>
          <Text style={styles.message}>{message}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: spacing(6) },
  card: { width: '100%', backgroundColor: colors.surface, borderRadius: 16, padding: spacing(6), alignItems: 'center', borderColor: colors.border, borderWidth: 1 },
  icon: { fontSize: 44, marginBottom: spacing(2) },
  title: { ...typography.subtitle, color: colors.textPrimary, fontSize: 20, marginBottom: spacing(2) },
  message: { ...typography.body, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing(5) },
  button: { backgroundColor: colors.accent, paddingVertical: spacing(3), paddingHorizontal: spacing(6), borderRadius: 8, alignSelf: 'stretch', alignItems: 'center' },
  buttonText: { ...typography.subtitle, color: colors.background, fontWeight: '700' },
});
