import express from "express";
import { validate } from "../middleware/zodValidator.js";
import {
  commonStudentsSchema,
  registerSchema,
  suspendStudentSchema,
} from "../validation/api.js";
import { eq, inArray, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import {
  teacher as teacherSchema,
  student as studentSchema,
  registration as registrationSchema,
} from "../db/schema/index.js";

export const router = express.Router();

router.post("/register", validate(registerSchema), async (req, res) => {
  const { teacher, students } = req.body;

  try {
    const [existingTeacher] = await db
      .select({ email: teacherSchema.email })
      .from(teacherSchema)
      .where(eq(teacherSchema.email, teacher))
      .limit(1);

    if (!existingTeacher) {
      return res.status(404).json({
        message: "Teacher not found",
        error: `Teacher with email ${teacher} does not exist`,
      });
    }

    const existingStudents = await db
      .select()
      .from(studentSchema)
      .where(inArray(studentSchema.email, students));

    if (existingStudents.length !== students.length) {
      const missingStudents = students.filter(
        (email) => !existingStudents.some((s) => s.email === email)
      );

      return res.status(404).json({
        message: "Some students not found",
        details: `The following students do not exist: ${missingStudents.join(
          ", "
        )}`,
      });
    }

    const existingRegistrations = await db
      .select()
      .from(registrationSchema)
      .where(
        inArray(
          registrationSchema.studentEmail,
          existingStudents.map((s) => s.email)
        )
      )
      .where(eq(registrationSchema.teacherEmail, existingTeacher.email));

    const alreadyRegistered = new Set(
      existingRegistrations.map((reg) => reg.studentEmail)
    );
    const newRegistrations = existingStudents.filter(
      (student) => !alreadyRegistered.has(student.email)
    );

    if (newRegistrations.length === 0) {
      return res.status(409).json({
        message: "All students are already registered under this teacher",
      });
    }

    await db.insert(registrationSchema).values(
      newRegistrations.map((student) => ({
        teacherEmail: existingTeacher.email,
        studentEmail: student.email,
      }))
    );

    return res.status(204).end();
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      message: "Failed to register students",
      error: error.message,
    });
  }
});

router.get(
  "/commonstudents",
  validate(commonStudentsSchema),
  async (req, res) => {
    const teachers = req.query.teacher;
    const teacherEmails = Array.isArray(teachers) ? teachers : [teachers]; // Ensure teachers is an array

    try {
      const existingTeachers = await db
        .select({ email: teacherSchema.email })
        .from(teacherSchema)
        .where(inArray(teacherSchema.email, teacherEmails));

      if (existingTeachers.length !== teacherEmails.length) {
        const missingTeachers = teacherEmails.filter(
          (email) => !existingTeachers.some((t) => t.email === email)
        );
        return res.status(404).json({
          message: "Some teachers not found",
          details: `The following teachers do not exist: ${missingTeachers.join(
            ", "
          )}`,
        });
      }

      const commonStudents = await db
        .select({ studentEmail: registrationSchema.studentEmail })
        .from(registrationSchema)
        .where(inArray(registrationSchema.teacherEmail, teacherEmails))
        .groupBy(registrationSchema.studentEmail)
        .having(
          sql`COUNT(DISTINCT ${registrationSchema.teacherEmail}) = ${teacherEmails.length}`
        );

      return res.status(200).json({
        students: commonStudents,
      });
    } catch (error) {
      console.error("Error fetching common students:", error);
      return res.status(500).json({
        message: "Failed to retrieve common students",
        error: error.message,
      });
    }
  }
);

router.post("/suspend", validate(suspendStudentSchema), async (req, res) => {
  const { student: studentEmail } = req.body;

  console.log(studentEmail);

  try {
    const student = await db
      .select()
      .from(studentSchema)
      .where(eq(studentSchema.email, studentEmail))
      .limit(1);

    if (student.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Step 2: Check if the student is already suspended
    if (student[0].status === "suspended") {
      return res.status(400).json({ message: "Student is already suspended" });
    }

    await db
      .update(studentSchema)
      .set({ status: "suspended" })
      .where(eq(studentSchema.email, studentEmail));

    return res.status(204).end();
  } catch (error) {
    console.error("Error suspending student:", error);
  }
});
