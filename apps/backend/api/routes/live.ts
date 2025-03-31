import { Hono } from "hono";
import { pool } from "../db";

const live = new Hono();

live.get("/", async (c) => {
  try {
    const result = await pool.query("SELECT * FROM live_videos");
    return c.json(result.rows);
  } catch (err) {
    console.error("Error al consultar la base:", err);
    return c.json({ error: "Error al consultar la base de datos" }, 500);
  }
});

export default live;