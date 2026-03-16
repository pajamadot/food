import { Hono } from "hono";
import { cors } from "hono/cors";
import { healthRoute } from "./routes/health";
import { placesRoute } from "./routes/places";

export type Env = {
  GOOGLE_PLACES_API_KEY: string;
  ALLOWED_ORIGIN: string;
};

const app = new Hono<{ Bindings: Env }>();

app.use(
  "/api/*",
  cors({
    origin: (origin, c) => {
      const allowed = c.env.ALLOWED_ORIGIN || "http://localhost:3000";
      if (
        origin === allowed ||
        origin === "http://localhost:3000" ||
        origin === "http://localhost:3001"
      ) {
        return origin;
      }
      return "";
    },
    allowMethods: ["GET", "OPTIONS"],
    allowHeaders: ["Content-Type"],
    maxAge: 86400,
  })
);

app.route("/api", healthRoute);
app.route("/api/places", placesRoute);

app.get("/", (c) => c.text("food-api is running"));

export default app;
