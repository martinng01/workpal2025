import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "./schema/index.js";
import mysql from "mysql2";

const pool = mysql.createPool(process.env.DATABASE_URL);

export const db = drizzle(pool, {
  // connectionString: process.env.DATABASE_URL,
  mode: "default",
  schema,
});
