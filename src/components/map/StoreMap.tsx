"use client";

import { useEffect } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import type { Vendor } from "@/data/types";
import type { LatLng } from "@/lib/haversine";
import "leaflet/dist/leaflet.css";

const userIcon = L.divIcon({
  className: "",
  html: `<div style="width:16px;height:16px;border-radius:9999px;background:#2563eb;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,.4)"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

function vendorIcon(highlighted: boolean) {
  const bg = highlighted ? "#dc2626" : "#0f766e";
  const size = highlighted ? 22 : 16;
  return L.divIcon({
    className: "",
    html: `<div style="width:${size}px;height:${size}px;border-radius:9999px;background:${bg};border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,.4)"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function MapClickHandler({ onPick }: { onPick: (pos: LatLng) => void }) {
  useMapEvents({
    click(e) {
      onPick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

function FitBounds({
  user,
  vendors,
}: {
  user: LatLng;
  vendors: Vendor[];
}) {
  const map = useMap();
  useEffect(() => {
    const points: L.LatLngExpression[] = [[user.lat, user.lng]];
    for (const v of vendors) points.push([v.lat, v.lng]);
    if (points.length === 1) {
      map.setView(points[0]!, 14);
      return;
    }
    map.fitBounds(L.latLngBounds(points), { padding: [28, 28], maxZoom: 15 });
  }, [map, user, vendors]);
  return null;
}

export type StoreMapProps = {
  user: LatLng;
  vendors: Vendor[];
  highlightedVendorId: string | null;
  onPickLocation: (pos: LatLng) => void;
};

export default function StoreMap({
  user,
  vendors,
  highlightedVendorId,
  onPickLocation,
}: StoreMapProps) {
  return (
    <div className="h-full w-full" data-testid="store-map" role="region" aria-label="Mapa de locales">
      <MapContainer
        center={[user.lat, user.lng]}
        zoom={14}
        className="h-full w-full"
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onPick={onPickLocation} />
        <FitBounds user={user} vendors={vendors} />
        <Marker position={[user.lat, user.lng]} icon={userIcon}>
          <Popup>Tu ubicación</Popup>
        </Marker>
        {vendors.map((v) => (
          <Marker
            key={v.id}
            position={[v.lat, v.lng]}
            icon={vendorIcon(v.id === highlightedVendorId)}
          >
            <Popup>
              <strong>{v.name}</strong>
              <br />
              {v.isOpen ? "Abierto" : "Cerrado"}
              <br />
              {v.address}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
