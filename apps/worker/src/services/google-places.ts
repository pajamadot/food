import type { Restaurant, LatLng } from "@food/shared";

const PLACES_API_BASE = "https://places.googleapis.com/v1/places:searchNearby";

type GooglePlace = {
  id: string;
  displayName?: { text: string };
  formattedAddress?: string;
  location?: { latitude: number; longitude: number };
  rating?: number;
  userRatingCount?: number;
  priceLevel?: string;
  types?: string[];
  photos?: Array<{ name: string }>;
  googleMapsUri?: string;
  currentOpeningHours?: { openNow?: boolean };
  regularOpeningHours?: { openNow?: boolean };
};

const CUISINE_TYPE_MAP: Record<string, string> = {
  chinese_restaurant: "Chinese",
  japanese_restaurant: "Japanese",
  korean_restaurant: "Korean",
  indian_restaurant: "Indian",
  italian_restaurant: "Italian",
  mexican_restaurant: "Mexican",
  thai_restaurant: "Thai",
  vietnamese_restaurant: "Vietnamese",
  french_restaurant: "French",
  greek_restaurant: "Greek",
  mediterranean_restaurant: "Mediterranean",
  american_restaurant: "American",
  pizza_restaurant: "Pizza",
  sushi_restaurant: "Sushi",
  seafood_restaurant: "Seafood",
  steak_house: "Steakhouse",
  barbecue_restaurant: "BBQ",
  ramen_restaurant: "Ramen",
  hamburger_restaurant: "Burgers",
  sandwich_shop: "Sandwiches",
  bakery: "Bakery",
  cafe: "Cafe",
  coffee_shop: "Coffee",
  ice_cream_shop: "Ice Cream",
  brunch_restaurant: "Brunch",
  breakfast_restaurant: "Breakfast",
  fast_food_restaurant: "Fast Food",
  vegan_restaurant: "Vegan",
  vegetarian_restaurant: "Vegetarian",
};

function extractCuisineTypes(types?: string[]): string[] {
  if (!types) return [];
  const cuisines: string[] = [];
  for (const type of types) {
    if (CUISINE_TYPE_MAP[type]) {
      cuisines.push(CUISINE_TYPE_MAP[type]);
    }
  }
  return cuisines.length > 0 ? cuisines : ["Restaurant"];
}

function mapPlace(place: GooglePlace): Restaurant {
  return {
    id: place.id,
    name: place.displayName?.text || "Unknown",
    address: place.formattedAddress || "",
    location: {
      lat: place.location?.latitude || 0,
      lng: place.location?.longitude || 0,
    },
    rating: place.rating,
    userRatingCount: place.userRatingCount,
    priceLevel: place.priceLevel,
    cuisineTypes: extractCuisineTypes(place.types),
    photoUri: place.photos?.[0]?.name || undefined,
    googleMapsUri: place.googleMapsUri,
    isOpenNow:
      place.currentOpeningHours?.openNow ??
      place.regularOpeningHours?.openNow,
  };
}

export async function searchNearbyRestaurants(
  apiKey: string,
  location: LatLng,
  radius: number,
  maxResults: number
): Promise<Restaurant[]> {
  const body = {
    includedTypes: ["restaurant"],
    maxResultCount: maxResults,
    locationRestriction: {
      circle: {
        center: { latitude: location.lat, longitude: location.lng },
        radius,
      },
    },
  };

  const fieldMask = [
    "places.id",
    "places.displayName",
    "places.formattedAddress",
    "places.location",
    "places.rating",
    "places.userRatingCount",
    "places.priceLevel",
    "places.types",
    "places.photos",
    "places.googleMapsUri",
    "places.currentOpeningHours",
    "places.regularOpeningHours",
  ].join(",");

  const response = await fetch(PLACES_API_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": fieldMask,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Google Places API error ${response.status}: ${text}`);
  }

  const data = (await response.json()) as { places?: GooglePlace[] };
  return (data.places || []).map(mapPlace);
}

export function getPhotoUri(
  apiKey: string,
  photoName: string,
  maxWidth: number,
  maxHeight: number
): string {
  return `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=${maxWidth}&maxHeightPx=${maxHeight}&key=${apiKey}`;
}
