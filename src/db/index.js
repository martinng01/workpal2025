import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "db/schema";

export const db = drizzle(
  { connectionString: process.env.DATABASE_URL },
  schema
);
