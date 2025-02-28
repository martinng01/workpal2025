import { int, mysqlTable, varchar } from "drizzle-orm/mysql-core";

export const studentTable = mysqlTable("students", {
  id: int("id").primaryKey().autoincrement(),
  email: varchar("email", { length: 255 }).notNull().unique(),
});
