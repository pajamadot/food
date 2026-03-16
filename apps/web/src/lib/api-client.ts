import type { NearbySearchResponse, HealthResponse } from "@food/shared";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787/api";

async function fetchApi<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${API_BASE}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) =>
      url.searchParams.set(key, value)
    );
  }

  const response = await fetch(url.toString());
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API error ${response.status}: ${error}`);
  }
  return response.json();
}

export function getHealthStatus(): Promise<HealthResponse> {
  return fetchApi("/health");
}

export function searchNearbyRestaurants(
  lat: number,
  lng: number,
  radius = 1500,
  maxResults = 20
): Promise<NearbySearchResponse> {
  return fetchApi("/places/nearby", {
    lat: lat.toString(),
    lng: lng.toString(),
    radius: radius.toString(),
    maxResults: maxResults.toString(),
  });
}

export function getPhotoUrl(photoName: string): string {
  return `${API_BASE}/places/photo/${photoName}`;
}
