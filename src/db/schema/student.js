import { mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { registration } from "./registration.js";
import { relations } from "drizzle-orm";

export const student = mysqlTable("students", {
  email: varchar("email", { length: 255 }).primaryKey(),
  status: varchar("status", { length: 255 }),
});

export const studentRelations = relations(student, ({ many }) => ({
  registration: many(registration),
}));
