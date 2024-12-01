import { AuthConfig, initAuthConfig } from "@hono/auth-js";
import { Hono } from "hono";
import { handle } from "hono/vercel";

import authConfig from "@/auth.config";
import ai from "./ai";
import images from "./images";
import projects from "./projects";
import subscriptions from "./subscriptions";
import users from "./users";

// Revert to "edge" if planning on planning on the edge
export const runtime = "nodejs";

function getAuthConfig(): AuthConfig {
  const config = {
    ...authConfig,
    secret: process.env.AUTH_SECRET,
  } as AuthConfig;
  return config;
}

const app = new Hono().basePath("/api");

app.use("*", initAuthConfig(getAuthConfig));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app
  .route("/projects", projects)
  .route("/images", images)
  .route("/ai", ai)
  .route("/subscriptions", subscriptions)
  .route("/users", users);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
