import { int, mysqlTable, varchar } from "drizzle-orm/mysql-core";

export const teacherTable = mysqlTable("teachers", {
  id: int("id").primaryKey().autoincrement(),
  email: varchar("email", { length: 255 }).notNull().unique(),
});
