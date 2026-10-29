import * as Location from 'expo-location';
import { distance, point } from '@turf/distance';

export function bearingTo(start, end) {
  if (!start || !end) return 0;
  const lat1 = (start.latitude * Math.PI) / 180;
  const lon1 = (start.longitude * Math.PI) / 180;
  const lat2 = (end.latitude * Math.PI) / 180;
  const lon2 = (end.longitude * Math.PI) / 180;

  const dLon = lon2 - lon1;
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  
  let brng = Math.atan2(y, x);
  return (((brng * 180) / Math.PI + 360) % 360);
}

export function bearingToCompass(bearing) {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(bearing / 45) % 8;
  return directions[index];
}

export function findNearestSignal(currentCoords, points) {
  if (!currentCoords || !points || points.length === 0) return null;

  try {
    const fromPoint = point([currentCoords.longitude, currentCoords.latitude]);
    let nearestSpot = null;
    let minDistance = Infinity;

    for (const spot of points) {
      const toPoint = point([spot.longitude, spot.latitude]);
      const distMeters = distance(fromPoint, toPoint) * 1000;

      if (distMeters < minDistance) {
        minDistance = distMeters;
        nearestSpot = spot;
      }
    }

    return nearestSpot ? { spot: nearestSpot, distanceMeters: minDistance } : null;
  } catch (e) {
    return fallbackHaversine(currentCoords, points);
  }
}

function fallbackHaversine(current, points) {
  const R = 6371e3; // Earth's radius in meters
  let nearestSpot = null;
  let minDistance = Infinity;

  for (const spot of points) {
    const phi1 = (current.latitude * Math.PI) / 180;
    const phi2 = (spot.latitude * Math.PI) / 180;
    const deltaPhi = ((spot.latitude - current.latitude) * Math.PI) / 180;
    const deltaLambda = ((spot.longitude - current.longitude) * Math.PI) / 180;

    const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
              Math.cos(phi1) * Math.cos(phi2) *
              Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distMeters = R * c;

    if (distMeters < minDistance) {
      minDistance = distMeters;
      nearestSpot = spot;
    }
  }
  return nearestSpot ? { spot: nearestSpot, distanceMeters: minDistance } : null;
}

export async function startWatchingPosition({ options, onUpdate, onError }) {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      onError({ code: 'PERMISSION_DENIED', message: 'Location lookup permission denied. Please enable it in system settings.' });
      return null;
    }

    const enabled = await Location.hasServicesEnabledAsync();
    if (!enabled) {
      onError({ code: 'SERVICES_DISABLED', message: 'Device location services are disabled. Turn on GPS services.' });
      return null;
    }

    return await Location.watchPositionAsync(options, onUpdate);
  } catch (error) {
    onError({ code: 'SUBSCRIPTION_ERROR', message: error?.message || 'Failed to initialize active tracking system.' });
    return null;
  }
}
