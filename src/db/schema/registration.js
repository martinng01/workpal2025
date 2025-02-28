import { mysqlTable, int } from "drizzle-orm/mysql-core";

export const registrationTable = mysqlTable("registrations", {
  teacherId: int("teacher_id").notNull(),
  studentId: int("student_id").notNull(),
});
