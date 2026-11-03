export type LatLng = { lat: number; lng: number };

const EARTH_RADIUS_KM = 6371;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** Distancia en kilómetros entre dos puntos (fórmula de haversine). */
export function haversineKm(a: LatLng, b: LatLng): number {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

export type WithLocation = LatLng & { id: string; isOpen: boolean };

/**
 * Devuelve el vendedor abierto más cercano.
 * Empate: el de menor `id` (determinístico).
 */
export function nearestOpenVendor<T extends WithLocation>(
  user: LatLng,
  vendors: readonly T[],
): T | null {
  const open = vendors.filter((v) => v.isOpen);
  if (open.length === 0) return null;

  let best: T | null = null;
  let bestDist = Number.POSITIVE_INFINITY;

  for (const v of open) {
    const d = haversineKm(user, v);
    if (
      d < bestDist - 1e-9 ||
      (Math.abs(d - bestDist) <= 1e-9 && (!best || v.id < best.id))
    ) {
      best = v;
      bestDist = d;
    }
  }
  return best;
}
