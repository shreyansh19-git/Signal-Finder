import { Platform } from 'react-native';

export const colors = {
  background: '#121214',
  surface: '#1A1A1E',
  border: '#2C2C35',
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0AA',
  accent: '#22C55E', // Vibrant signal green
  error: '#EF4444',
  warning: '#F59E0B',
};

export const spacing = (multiplier) => multiplier * 4;

export const typography = {
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  body: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  monospace: {
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
};
