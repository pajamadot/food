"use client";

import { useState, useCallback } from "react";
import type { Restaurant, LatLng } from "@food/shared";
import { searchNearbyRestaurants } from "@/lib/api-client";

type RestaurantState = {
  restaurants: Restaurant[];
  loading: boolean;
  error: string | null;
};

export function useNearbyRestaurants() {
  const [state, setState] = useState<RestaurantState>({
    restaurants: [],
    loading: false,
    error: null,
  });

  const search = useCallback(async (location: LatLng, radius: number) => {
    setState({ restaurants: [], loading: true, error: null });
    try {
      const data = await searchNearbyRestaurants(
        location.lat,
        location.lng,
        radius
      );
      setState({ restaurants: data.restaurants, loading: false, error: null });
      return data.restaurants;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Search failed";
      setState({ restaurants: [], loading: false, error: message });
      return [];
    }
  }, []);

  const reset = useCallback(() => {
    setState({ restaurants: [], loading: false, error: null });
  }, []);

  return { ...state, search, reset };
}
