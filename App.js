import React, { useEffect, useRef, useState, useCallback } from 'react';
import { StyleSheet, Text, ScrollView, StatusBar } from 'react-native';
import { MOCK_SIGNAL_POINTS, CONFIG } from './constants/signalPoints';
import {
  findNearestSignal,
  bearingTo,
  bearingToCompass,
  startWatchingPosition,
} from './utils/geo';
import { colors, spacing, typography } from './styles/theme';
import LocationCard from './components/LocationCard';
import GuidanceCard from './components/GuidanceCard';
import StatusScreen from './components/StatusScreen';

export default function App() {
  const [phase, setPhase] = useState('loading'); // 'loading' | 'ready' | 'error'
  const [errorInfo, setErrorInfo] = useState(null);
  const [display, setDisplay] = useState(null);

  const lastAcceptedRef = useRef({ coords: null, timestamp: 0 });
  const subscriptionRef = useRef(null);
  const gpsTimeoutRef = useRef(null);
  const mountedRef = useRef(true);

  const handleLocationUpdate = useCallback((loc) => {
    const coords = loc?.coords;
    if (!coords) return;

    const now = Date.now();
    const { coords: lastCoords, timestamp: lastTimestamp } = lastAcceptedRef.current;

    if (lastCoords) {
      const elapsed = now - lastTimestamp;
      const moved =
        Math.abs(coords.latitude - lastCoords.latitude) * 111000 > CONFIG.MIN_DISTANCE_DELTA_M ||
        Math.abs(coords.longitude - lastCoords.longitude) * 111000 > CONFIG.MIN_DISTANCE_DELTA_M;

      if (elapsed < CONFIG.MIN_UPDATE_INTERVAL_MS && !moved) {
        return;
      }
    }

    const nearest = findNearestSignal(coords, MOCK_SIGNAL_POINTS);
    if (!nearest) return;

    lastAcceptedRef.current = { coords, timestamp: now };

    if (!mountedRef.current) return;

    if (gpsTimeoutRef.current) {
      clearTimeout(gpsTimeoutRef.current);
      gpsTimeoutRef.current = null;
    }

    const bearingDeg = bearingTo(coords, nearest.spot);
    setDisplay({
      latitude: coords.latitude,
      longitude: coords.longitude,
      accuracy: coords.accuracy,
      spotName: nearest.spot.name,
      distanceMeters: nearest.distanceMeters,
      compassDirection: bearingToCompass(bearingDeg),
    });
    setPhase('ready');
  }, []);

  const handleLocationError = useCallback((err) => {
    if (!mountedRef.current) return;
    setErrorInfo(err);
    setPhase('error');
  }, []);

  const startTracking = useCallback(async () => {
    setPhase('loading');
    setErrorInfo(null);

    if (gpsTimeoutRef.current) {
      clearTimeout(gpsTimeoutRef.current);
    }

    gpsTimeoutRef.current = setTimeout(() => {
      if (mountedRef.current && !lastAcceptedRef.current.coords) {
        handleLocationError({
          code: 'GPS_TIMEOUT',
          message: 'Still searching for a GPS signal. Move outdoors or near a window and try again.',
        });
      }
    }, CONFIG.GPS_ACQUIRE_TIMEOUT_MS);

    if (subscriptionRef.current) {
      subscriptionRef.current.remove();
    }

    const subscription = await startWatchingPosition({
      options: CONFIG.WATCH_OPTIONS,
      onUpdate: handleLocationUpdate,
      onError: handleLocationError,
    });
    subscriptionRef.current = subscription;
  }, [handleLocationUpdate, handleLocationError]);

  useEffect(() => {
    mountedRef.current = true;
    startTracking();

    return () => {
      mountedRef.current = false;
      if (subscriptionRef.current) {
        subscriptionRef.current.remove();
        subscriptionRef.current = null;
      }
      if (gpsTimeoutRef.current) {
        clearTimeout(gpsTimeoutRef.current);
      }
    };
  }, [startTracking]);

  const handleRetry = useCallback(() => {
    lastAcceptedRef.current = { coords: null, timestamp: 0 };
    setDisplay(null);
    startTracking();
  }, [startTracking]);

  if (phase === 'error') {
    return (
      <>
        <StatusBar barStyle="light-content" backgroundColor={colors.background} />
        <StatusScreen variant="error" message={errorInfo?.message} onRetry={handleRetry} />
      </>
    );
  }

  if (phase === 'loading' || !display) {
    return (
      <>
        <StatusBar barStyle="light-content" backgroundColor={colors.background} />
        <StatusScreen variant="loading" message="This can take a few seconds outdoors." />
      </>
    );
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>📡 Signal Finder</Text>
        <Text style={styles.subtitle}>
          Fully offline · {MOCK_SIGNAL_POINTS.length} known zones nearby
        </Text>
        <LocationCard
          latitude={display.latitude}
          longitude={display.longitude}
          accuracy={display.accuracy}
        />
        <GuidanceCard
          name={display.spotName}
          distanceMeters={display.distanceMeters}
          compassDirection={display.compassDirection}
        />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    padding: spacing(6),
    paddingTop: spacing(16),
  },
  title: { ...typography.title, color: colors.textPrimary, marginBottom: spacing(1) },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing(6),
    fontSize: 13,
  },
});
