import { Hono } from "hono";
import { cors } from "hono/cors";
import live from "./routes/live";

const app = new Hono();

app.use("*", cors({
    origin: "https://manija.ucielsola.dev",
}));  

app.route("/live", live);

export default {
  port: 3000,
  fetch: app.fetch,
};