import type { Restaurant, LatLng } from "@food/shared";

const PLACES_API_BASE = "https://places.googleapis.com/v1/places:searchNearby";

type GooglePlace = {
  id: string;
  displayName?: { text: string };
  formattedAddress?: string;
  shortFormattedAddress?: string;
  location?: { latitude: number; longitude: number };
  rating?: number;
  userRatingCount?: number;
  priceLevel?: string;
  primaryType?: string;
  primaryTypeDisplayName?: { text: string };
  types?: string[];
  editorialSummary?: { text: string };
  photos?: Array<{ name: string }>;
  googleMapsUri?: string;
  websiteUri?: string;
  nationalPhoneNumber?: string;
  currentOpeningHours?: { openNow?: boolean };
  regularOpeningHours?: { openNow?: boolean };
  dineIn?: boolean;
  takeout?: boolean;
  delivery?: boolean;
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
  middle_eastern_restaurant: "Middle Eastern",
  turkish_restaurant: "Turkish",
  spanish_restaurant: "Spanish",
  brazilian_restaurant: "Brazilian",
  indonesian_restaurant: "Indonesian",
  lebanese_restaurant: "Lebanese",
  persian_restaurant: "Persian",
  african_restaurant: "African",
  caribbean_restaurant: "Caribbean",
  filipino_restaurant: "Filipino",
};

const PRICE_LEVEL_MAP: Record<string, number> = {
  PRICE_LEVEL_FREE: 0,
  PRICE_LEVEL_INEXPENSIVE: 1,
  PRICE_LEVEL_MODERATE: 2,
  PRICE_LEVEL_EXPENSIVE: 3,
  PRICE_LEVEL_VERY_EXPENSIVE: 4,
};

// Types that indicate the result is NOT actually a restaurant
const EXCLUDED_PRIMARY_TYPES = new Set([
  "hotel",
  "lodging",
  "motel",
  "resort_hotel",
  "extended_stay_hotel",
  "convention_center",
  "event_venue",
  "grocery_store",
  "supermarket",
  "gas_station",
  "convenience_store",
  "shopping_mall",
]);

function extractCuisineTypes(
  types?: string[],
  primaryTypeDisplay?: string
): string[] {
  if (!types) return primaryTypeDisplay ? [primaryTypeDisplay] : [];
  const cuisines: string[] = [];
  for (const type of types) {
    if (CUISINE_TYPE_MAP[type]) {
      cuisines.push(CUISINE_TYPE_MAP[type]);
    }
  }
  if (cuisines.length > 0) return cuisines;
  // Fall back to the display name from Google
  if (primaryTypeDisplay) return [primaryTypeDisplay];
  return ["Restaurant"];
}

function mapPlace(place: GooglePlace): Restaurant | null {
  // Filter out non-restaurant results (hotels, etc.)
  if (place.primaryType && EXCLUDED_PRIMARY_TYPES.has(place.primaryType)) {
    return null;
  }
  // Also check types array
  if (
    place.types?.some(
      (t) =>
        t === "lodging" || t === "hotel" || t === "grocery_store"
    ) &&
    !place.types?.some((t) => t.includes("restaurant"))
  ) {
    return null;
  }

  const primaryTypeDisplay = place.primaryTypeDisplayName?.text;

  return {
    id: place.id,
    name: place.displayName?.text || "Unknown",
    address: place.shortFormattedAddress || place.formattedAddress || "",
    location: {
      lat: place.location?.latitude || 0,
      lng: place.location?.longitude || 0,
    },
    rating: place.rating,
    userRatingCount: place.userRatingCount,
    priceLevel:
      place.priceLevel != null
        ? PRICE_LEVEL_MAP[place.priceLevel] ?? undefined
        : undefined,
    primaryType: primaryTypeDisplay,
    cuisineTypes: extractCuisineTypes(place.types, primaryTypeDisplay),
    summary: place.editorialSummary?.text,
    photoUri: place.photos?.[0]?.name || undefined,
    googleMapsUri: place.googleMapsUri,
    websiteUri: place.websiteUri,
    phoneNumber: place.nationalPhoneNumber,
    isOpenNow:
      place.currentOpeningHours?.openNow ??
      place.regularOpeningHours?.openNow,
    dineIn: place.dineIn,
    takeout: place.takeout,
    delivery: place.delivery,
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
    excludedTypes: ["hotel", "lodging"],
    maxResultCount: maxResults,
    rankPreference: "POPULARITY",
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
    "places.shortFormattedAddress",
    "places.location",
    "places.rating",
    "places.userRatingCount",
    "places.priceLevel",
    "places.primaryType",
    "places.primaryTypeDisplayName",
    "places.types",
    "places.editorialSummary",
    "places.photos",
    "places.googleMapsUri",
    "places.websiteUri",
    "places.nationalPhoneNumber",
    "places.currentOpeningHours",
    "places.regularOpeningHours",
    "places.dineIn",
    "places.takeout",
    "places.delivery",
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
  const restaurants = (data.places || [])
    .map(mapPlace)
    .filter((r): r is Restaurant => r !== null);

  return restaurants;
}

export function getPhotoUri(
  apiKey: string,
  photoName: string,
  maxWidth: number,
  maxHeight: number
): string {
  return `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=${maxWidth}&maxHeightPx=${maxHeight}&key=${apiKey}`;
}
