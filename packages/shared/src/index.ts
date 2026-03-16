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
  priceLevel?: number; // 0-4: Free/$/$$/$$$/$$$$
  primaryType?: string; // e.g. "Chinese Restaurant"
  cuisineTypes: string[];
  summary?: string; // editorial summary
  photoUri?: string;
  googleMapsUri?: string;
  websiteUri?: string;
  phoneNumber?: string;
  isOpenNow?: boolean;
  dineIn?: boolean;
  takeout?: boolean;
  delivery?: boolean;
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
