"use client";

import { useState, useCallback, useMemo } from "react";
import type { AppState, Restaurant } from "@food/shared";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useNearbyRestaurants } from "@/hooks/use-nearby-restaurants";
import { useWheelState } from "@/hooks/use-wheel-state";
import { Header } from "@/components/layout/header";
import { Hero } from "@/components/layout/hero";
import { DynamicMap } from "@/components/map/dynamic-map";
import { SearchControls } from "@/components/restaurant/search-controls";
import { RestaurantList } from "@/components/restaurant/restaurant-list";
import { SpinWheel } from "@/components/wheel/spin-wheel";
import { WinnerDialog } from "@/components/wheel/winner-dialog";
import { motion, AnimatePresence } from "framer-motion";

export default function HomePage() {
  const [appState, setAppState] = useState<AppState>("IDLE");
  const [radius, setRadius] = useState(1500);
  const [cuisineFilter, setCuisineFilter] = useState("All");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [soundEnabled, setSoundEnabled] = useState(true);

  const geo = useGeolocation();
  const restaurantSearch = useNearbyRestaurants();

  // Filter restaurants by cuisine
  const filteredRestaurants = useMemo(() => {
    if (cuisineFilter === "All") return restaurantSearch.restaurants;
    return restaurantSearch.restaurants.filter((r) =>
      r.cuisineTypes.some(
        (c) => c.toLowerCase() === cuisineFilter.toLowerCase()
      )
    );
  }, [restaurantSearch.restaurants, cuisineFilter]);

  // Get selected restaurants for wheel (max 12)
  const selectedRestaurants = useMemo(() => {
    const selected = filteredRestaurants.filter((r) => selectedIds.has(r.id));
    return selected.slice(0, 12);
  }, [filteredRestaurants, selectedIds]);

  const wheel = useWheelState(selectedRestaurants);

  const handleGetStarted = useCallback(() => {
    setAppState("LOCATING");
    geo.locate();
  }, [geo]);

  const handleLocationSearch = useCallback(
    (location: { lat: number; lng: number }) => {
      geo.setLocation(location);
      setAppState("SEARCHING");
    },
    [geo]
  );

  // Once location is found, update state
  if (geo.location && !geo.loading && appState === "LOCATING") {
    setAppState("SEARCHING");
  }

  const handleSearch = useCallback(async () => {
    if (!geo.location) return;
    setAppState("SEARCHING");
    const results = await restaurantSearch.search(geo.location, radius);
    if (results.length > 0) {
      // Auto-select all by default
      setSelectedIds(new Set(results.map((r) => r.id)));
      setAppState("RESULTS");
    } else {
      setAppState("RESULTS");
    }
  }, [geo.location, radius, restaurantSearch]);

  const handleToggleRestaurant = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < 12) {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleSpin = useCallback(() => {
    if (selectedRestaurants.length < 2) return;
    setAppState("SPINNING");
    wheel.spin();
  }, [selectedRestaurants.length, wheel]);

  // Watch for winner
  if (wheel.winner && appState === "SPINNING") {
    setAppState("WINNER");
  }

  const handleSpinAgain = useCallback(() => {
    wheel.clearWinner();
    setAppState("RESULTS");
  }, [wheel]);

  const handleNewSearch = useCallback(() => {
    wheel.reset();
    restaurantSearch.reset();
    setSelectedIds(new Set());
    setCuisineFilter("All");
    setAppState(geo.location ? "SEARCHING" : "IDLE");
  }, [wheel, restaurantSearch, geo.location]);

  const showMap = appState !== "IDLE";
  const showResults = appState === "RESULTS" || appState === "SPINNING" || appState === "WINNER";

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((s) => !s)}
      />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <AnimatePresence mode="wait">
            {appState === "IDLE" && (
              <motion.div
                key="hero"
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Hero
                  onGetStarted={handleGetStarted}
                  onLocationSearch={handleLocationSearch}
                  loading={geo.loading}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {showMap && geo.location && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="py-6"
            >
              <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
                {/* Left: Map + Results */}
                <div className="space-y-4">
                  <div className="h-[350px] overflow-hidden rounded-xl border shadow-sm md:h-[450px]">
                    <DynamicMap
                      center={geo.location}
                      radius={radius}
                      restaurants={filteredRestaurants}
                      onLocationChange={(pos) => {
                        geo.setLocation(pos);
                      }}
                    />
                  </div>

                  {geo.error && (
                    <p className="text-sm text-yellow-600">{geo.error}</p>
                  )}

                  {restaurantSearch.error && (
                    <p className="text-sm text-destructive">
                      {restaurantSearch.error}
                    </p>
                  )}

                  {showResults && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <RestaurantList
                        restaurants={filteredRestaurants}
                        selectedIds={selectedIds}
                        onToggle={handleToggleRestaurant}
                      />
                    </motion.div>
                  )}

                  {showResults && filteredRestaurants.length === 0 && !restaurantSearch.loading && (
                    <div className="rounded-lg border border-dashed p-8 text-center">
                      <p className="text-lg font-medium">No restaurants found</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Try increasing the search radius or moving the pin.
                      </p>
                    </div>
                  )}
                </div>

                {/* Right: Controls + Wheel */}
                <div className="space-y-6">
                  <SearchControls
                    radius={radius}
                    onRadiusChange={setRadius}
                    cuisineFilter={cuisineFilter}
                    onCuisineFilterChange={setCuisineFilter}
                    onSearch={handleSearch}
                    loading={restaurantSearch.loading}
                    disabled={!geo.location}
                  />

                  {showResults && selectedRestaurants.length >= 2 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3, type: "spring" }}
                    >
                      <SpinWheel
                        restaurants={selectedRestaurants}
                        rotation={wheel.rotation}
                        isSpinning={wheel.isSpinning}
                        onSpin={handleSpin}
                        soundEnabled={soundEnabled}
                      />
                    </motion.div>
                  )}

                  {showResults &&
                    selectedRestaurants.length < 2 &&
                    filteredRestaurants.length > 0 && (
                      <p className="text-center text-sm text-muted-foreground">
                        Select at least 2 restaurants to spin the wheel
                      </p>
                    )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <WinnerDialog
        winner={wheel.winner}
        onClose={wheel.clearWinner}
        onSpinAgain={handleSpinAgain}
        onNewSearch={handleNewSearch}
      />

      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        Made with 🎲 by{" "}
        <a
          href="https://pajamadot.com"
          className="font-medium text-foreground hover:text-primary"
          target="_blank"
          rel="noopener noreferrer"
        >
          PajamaDot
        </a>
      </footer>
    </div>
  );
}
