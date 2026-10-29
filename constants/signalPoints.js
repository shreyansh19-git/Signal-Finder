export const CONFIG = {
  MIN_UPDATE_INTERVAL_MS: 3000, // 3-second throttle window
  MIN_DISTANCE_DELTA_M: 3,       // Must move at least 3 meters
  GPS_ACQUIRE_TIMEOUT_MS: 15000, // 15-second signal acquisition timeout
  ARRIVED_THRESHOLD_M: 25,       // UI "arrived" phase threshold
  WATCH_OPTIONS: {
    accuracy: 3, // Expo Location.Accuracy.Balanced equivalent
    timeInterval: 2000,
    distanceInterval: 2,
  },
};

// Local test waypoints around Greater Noida
export const MOCK_SIGNAL_POINTS = [
  { id: '1', name: 'Knowledge Park Metro Station', latitude: 28.4619, longitude: 77.4912 },
  { id: '2', name: 'Sharda University Main Gate', latitude: 28.4731, longitude: 77.4826 },
  { id: '3', name: 'IILM College Campus Hub', latitude: 28.4682, longitude: 77.5021 },
];
