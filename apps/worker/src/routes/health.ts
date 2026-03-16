import { Hono } from "hono";
import type { Env } from "../index";
import type { HealthResponse } from "@food/shared";

export const healthRoute = new Hono<{ Bindings: Env }>();

healthRoute.get("/health", (c) => {
  const response: HealthResponse = {
    status: "ok",
    timestamp: new Date().toISOString(),
  };
  return c.json(response);
});
