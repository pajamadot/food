"use client";

import { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import type { LatLng, Restaurant } from "@food/shared";

// Fix default marker icons
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const restaurantIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [20, 33],
  iconAnchor: [10, 33],
  popupAnchor: [1, -28],
  shadowSize: [33, 33],
});

function MapUpdater({ center }: { center: LatLng }) {
  const map = useMap();
  const prevCenter = useRef(center);

  useEffect(() => {
    if (
      prevCenter.current.lat !== center.lat ||
      prevCenter.current.lng !== center.lng
    ) {
      map.flyTo([center.lat, center.lng], map.getZoom(), { duration: 0.8 });
      prevCenter.current = center;
    }
  }, [center, map]);

  return null;
}

function DraggableMarker({
  position,
  onDragEnd,
}: {
  position: LatLng;
  onDragEnd: (pos: LatLng) => void;
}) {
  const markerRef = useRef<L.Marker>(null);

  return (
    <Marker
      position={[position.lat, position.lng]}
      icon={defaultIcon}
      draggable
      ref={markerRef}
      eventHandlers={{
        dragend: () => {
          const marker = markerRef.current;
          if (marker) {
            const pos = marker.getLatLng();
            onDragEnd({ lat: pos.lat, lng: pos.lng });
          }
        },
      }}
    >
      <Popup>Drag me to search a different area</Popup>
    </Marker>
  );
}

type LeafletMapProps = {
  center: LatLng;
  radius: number;
  restaurants: Restaurant[];
  onLocationChange: (pos: LatLng) => void;
};

export default function LeafletMap({
  center,
  radius,
  restaurants,
  onLocationChange,
}: LeafletMapProps) {
  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={14}
      className="h-full w-full rounded-xl"
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapUpdater center={center} />
      <DraggableMarker position={center} onDragEnd={onLocationChange} />
      <Circle
        center={[center.lat, center.lng]}
        radius={radius}
        pathOptions={{
          color: "#f97316",
          fillColor: "#f97316",
          fillOpacity: 0.08,
          weight: 2,
        }}
      />
      {restaurants.map((r) => (
        <Marker
          key={r.id}
          position={[r.location.lat, r.location.lng]}
          icon={restaurantIcon}
        >
          <Popup>
            <strong>{r.name}</strong>
            <br />
            {r.rating && `${r.rating} stars`}
            {r.cuisineTypes.length > 0 && ` · ${r.cuisineTypes.join(", ")}`}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
