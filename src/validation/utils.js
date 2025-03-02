import { z } from "zod";
import { eq, inArray } from "drizzle-orm";
import { db } from "../db/index.js";
import {
  teacher as teacherSchema,
  student as studentSchema,
} from "../db/schema/index.js";

export const emailSchema = z
  .string()
  .email({ message: "Please enter a valid email." });

export const checkIfTeacherExists = async (teacherEmail) => {
  const [teacher] = await db
    .select({ email: teacherSchema.email })
    .from(teacherSchema)
    .where(eq(teacherSchema.email, teacherEmail))
    .limit(1);

  return teacher ? true : false;
};

export const checkIfStudentExists = async (studentEmail) => {
  const [student] = await db
    .select()
    .from(studentSchema)
    .where(eq(studentSchema.email, studentEmail))
    .limit(1);

  return student ? true : false;
};

export const checkIfMultipleStudentsExist = async (studentEmails) => {
  const existingStudents = await db
    .select({ email: studentSchema.email })
    .from(studentSchema)
    .where(inArray(studentSchema.email, studentEmails));

  const existingEmails = new Set(existingStudents.map((s) => s.email));
  const missingStudents = studentEmails.filter(
    (email) => !existingEmails.has(email)
  );

  return { existingStudents, missingStudents };
};

export const checkifMultipleTeachersExist = async (teacherEmails) => {
  const existingTeachers = await db
    .select({ email: teacherSchema.email })
    .from(teacherSchema)
    .where(inArray(teacherSchema.email, teacherEmails));

  const existingEmails = new Set(existingTeachers.map((s) => s.email));
  const missingTeachers = teacherEmails.filter(
    (email) => !existingEmails.has(email)
  );

  return { existingTeachers, missingTeachers };
};
