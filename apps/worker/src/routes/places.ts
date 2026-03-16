import { Hono } from "hono";
import type { Env } from "../index";
import { searchNearbyRestaurants, getPhotoUri } from "../services/google-places";

export const placesRoute = new Hono<{ Bindings: Env }>();

placesRoute.get("/nearby", async (c) => {
  const lat = parseFloat(c.req.query("lat") || "");
  const lng = parseFloat(c.req.query("lng") || "");
  const radius = parseInt(c.req.query("radius") || "1500", 10);
  const maxResults = parseInt(c.req.query("maxResults") || "20", 10);

  if (isNaN(lat) || isNaN(lng)) {
    return c.json({ error: "lat and lng are required" }, 400);
  }

  if (radius < 100 || radius > 10000) {
    return c.json({ error: "radius must be between 100 and 10000" }, 400);
  }

  try {
    const restaurants = await searchNearbyRestaurants(
      c.env.GOOGLE_PLACES_API_KEY,
      { lat, lng },
      radius,
      Math.min(maxResults, 20)
    );
    return c.json({ restaurants });
  } catch (err) {
    console.error("Places API error:", err);
    return c.json({ error: "Failed to fetch nearby restaurants" }, 500);
  }
});

placesRoute.get("/photo/:photoName{.+}", async (c) => {
  const photoName = c.req.param("photoName");

  if (!photoName) {
    return c.json({ error: "photoName is required" }, 400);
  }

  try {
    const photoUrl = getPhotoUri(
      c.env.GOOGLE_PLACES_API_KEY,
      photoName,
      400,
      400
    );

    const response = await fetch(photoUrl);

    if (!response.ok) {
      return c.json({ error: "Failed to fetch photo" }, 502);
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";
    const body = await response.arrayBuffer();

    return new Response(body, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (err) {
    console.error("Photo proxy error:", err);
    return c.json({ error: "Failed to fetch photo" }, 500);
  }
});
