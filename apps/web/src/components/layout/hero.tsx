"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2, Search } from "lucide-react";
import type { LatLng } from "@food/shared";

type HeroProps = {
  onGetStarted: () => void;
  onLocationSearch: (location: LatLng) => void;
  loading: boolean;
};

async function geocodeAddress(query: string): Promise<LatLng | null> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
  const res = await fetch(url, {
    headers: { "User-Agent": "food.pajamadot.com" },
  });
  const data = await res.json();
  if (data.length > 0) {
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  }
  return null;
}

export function Hero({ onGetStarted, onLocationSearch, loading }: HeroProps) {
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!query.trim()) return;
    setSearching(true);
    setError("");
    const location = await geocodeAddress(query.trim());
    setSearching(false);
    if (location) {
      onLocationSearch(location);
    } else {
      setError("Location not found. Try a more specific address.");
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center gap-6 py-12 text-center md:py-20"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="text-6xl"
      >
        🍽️
      </motion.div>
      <h1 className="max-w-2xl text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
        Can&apos;t Decide{" "}
        <span className="text-primary">What to Eat?</span>
      </h1>
      <p className="max-w-lg text-lg text-muted-foreground">
        Pick a spot on the map, find nearby restaurants, and spin the wheel to
        let fate decide your next meal.
      </p>

      <div className="flex w-full max-w-md flex-col gap-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Enter an address or city..."
            className="flex-1 rounded-lg border bg-background px-4 py-2.5 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
          />
          <Button
            onClick={handleSearch}
            disabled={searching || !query.trim()}
            size="lg"
          >
            {searching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            Go
          </Button>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <Button
          variant="outline"
          size="lg"
          onClick={onGetStarted}
          disabled={loading}
          className="gap-2"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <MapPin className="h-5 w-5" />
          )}
          {loading ? "Finding your location..." : "Use My Location"}
        </Button>
      </div>
    </motion.section>
  );
}
