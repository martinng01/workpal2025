import { mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { student } from "./student";
import { teacher } from "./teacher";
import { relations } from "drizzle-orm";

export const registration = mysqlTable("registrations", {
  teacherEmail: varchar("teacher_email", { length: 255 })
    .notNull()
    .references(() => teacher.email),
  studentEmail: varchar("student_email", { length: 255 })
    .notNull()
    .references(() => student.email),
});

export const registrationRelations = relations(registration, ({ one }) => ({
  teacher: one(teacher, {
    fields: [registration.teacherEmail],
    references: [teacher.email],
  }),
  student: one(student, {
    fields: [registration.studentEmail],
    references: [student.email],
  }),
}));
