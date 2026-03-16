export type LatLng = {
  lat: number;
  lng: number;
};

export type Restaurant = {
  id: string;
  name: string;
  address: string;
  location: LatLng;
  rating?: number;
  userRatingCount?: number;
  priceLevel?: string;
  cuisineTypes: string[];
  photoUri?: string;
  googleMapsUri?: string;
  isOpenNow?: boolean;
};

export type NearbySearchRequest = {
  lat: number;
  lng: number;
  radius?: number;
  maxResults?: number;
};

export type NearbySearchResponse = {
  restaurants: Restaurant[];
};

export type HealthResponse = {
  status: "ok";
  timestamp: string;
};

export type AppState =
  | "IDLE"
  | "LOCATING"
  | "SEARCHING"
  | "RESULTS"
  | "SPINNING"
  | "WINNER";
