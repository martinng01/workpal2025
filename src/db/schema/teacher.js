import { mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { registration } from "./registration.js";
import { relations } from "drizzle-orm";

export const teacher = mysqlTable("teachers", {
  email: varchar("email", { length: 255 }).primaryKey(),
});

export const teacherRelations = relations(teacher, ({ many }) => ({
  registration: many(registration),
}));
