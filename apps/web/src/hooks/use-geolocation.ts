"use client";

import { useState, useCallback } from "react";
import type { LatLng } from "@food/shared";

type GeolocationState = {
  location: LatLng | null;
  loading: boolean;
  error: string | null;
};

const DEFAULT_LOCATION: LatLng = { lat: 49.2827, lng: -123.1207 }; // Vancouver

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    loading: false,
    error: null,
  });

  const locate = useCallback(() => {
    if (!navigator.geolocation) {
      setState({
        location: DEFAULT_LOCATION,
        loading: false,
        error: "Geolocation not supported, using default location",
      });
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          loading: false,
          error: null,
        });
      },
      (err) => {
        setState({
          location: DEFAULT_LOCATION,
          loading: false,
          error: `${err.message}. Using default location.`,
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  }, []);

  const setLocation = useCallback((location: LatLng) => {
    setState({ location, loading: false, error: null });
  }, []);

  return { ...state, locate, setLocation };
}
