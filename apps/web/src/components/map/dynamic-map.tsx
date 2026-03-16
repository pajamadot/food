"use client";

import dynamic from "next/dynamic";
import type { LatLng, Restaurant } from "@food/shared";

const LeafletMap = dynamic(() => import("./leaflet-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-xl bg-muted">
      <div className="animate-pulse text-muted-foreground">Loading map...</div>
    </div>
  ),
});

type DynamicMapProps = {
  center: LatLng;
  radius: number;
  restaurants: Restaurant[];
  onLocationChange: (pos: LatLng) => void;
};

export function DynamicMap(props: DynamicMapProps) {
  return <LeafletMap {...props} />;
}
