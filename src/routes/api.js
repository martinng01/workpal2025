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
  student as studentSchema,
  registration as registrationSchema,
} from "../db/schema/index.js";
import { extractEmailsFromText } from "../utils/index.js";
import {
  checkIfStudentExists,
  checkIfMultipleStudentsExist,
  checkIfTeacherExists,
  checkifMultipleTeachersExist,
} from "../validation/utils.js";

export const router = express.Router();

router.post("/register", validate(registerSchema), async (req, res) => {
  const { teacher: teacherEmail, students: studentEmails } = req.body;

  try {
    const teacherExists = await checkIfTeacherExists(teacherEmail);
    if (!teacherExists) {
      return res.status(404).json({
        message: "Teacher not found",
        error: `Teacher with email ${teacherEmail} does not exist`,
      });
    }

    const { missingStudents } = await checkIfMultipleStudentsExist(
      studentEmails
    );

    if (missingStudents.length > 0) {
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
      .where(inArray(registrationSchema.studentEmail, studentEmails))
      .where(eq(registrationSchema.teacherEmail, teacherEmail));

    const alreadyRegistered = new Set(
      existingRegistrations.map((reg) => reg.studentEmail)
    );
    const newRegistrations = studentEmails.filter(
      (studentEmail) => !alreadyRegistered.has(studentEmail)
    );

    if (newRegistrations.length === 0) {
      return res.status(409).json({
        message: "All students are already registered under this teacher",
      });
    }

    await db.insert(registrationSchema).values(
      newRegistrations.map((studentEmail) => ({
        teacherEmail: teacherEmail,
        studentEmail: studentEmail,
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
      const { missingTeachers } = await checkifMultipleTeachersExist(
        teacherEmails
      );

      if (missingTeachers.length > 0) {
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

  try {
    const studentExists = await checkIfStudentExists(studentEmail);
    if (!studentExists) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    const student = await db
      .select({ email: studentSchema.email, status: studentSchema.status })
      .from(studentSchema)
      .where(eq(studentSchema.email, studentEmail))
      .limit(1);

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

router.post("/retrievefornotifications", async (req, res) => {
  const { teacher: teacherEmail, notification } = req.body;

  try {
    const mentionedEmails = extractEmailsFromText(notification);

    const { missingStudents } = await checkIfMultipleStudentsExist(
      mentionedEmails
    );

    if (missingStudents.length > 0) {
      return res.status(404).json({
        message: "Some students not found",
        details: `The following students do not exist: ${missingStudents.join(
          ", "
        )}`,
      });
    }

    const teacherExists = await checkIfTeacherExists(teacherEmail);
    if (!teacherExists) {
      return res.status(404).json({
        message: "Teacher not found",
        error: `Teacher with email ${teacherEmail} does not exist`,
      });
    }

    const studentsRegisteredToTeacher = await db
      .select({ studentEmail: registrationSchema.studentEmail })
      .from(registrationSchema)
      .where(eq(registrationSchema.teacherEmail, teacherEmail));

    const allEmails = [
      ...studentsRegisteredToTeacher.map((s) => s.studentEmail),
      ...mentionedEmails,
    ];

    const uniqueEmails = [...new Set(allEmails)];

    console.log("Unique emails for notification:", uniqueEmails);

    if (uniqueEmails.length === 0) {
      return res
        .status(200)
        .json({ message: "No students found for the notification" });
    }

    return res.status(200).json({ recipients: uniqueEmails });
  } catch (error) {
    console.error("Error retrieving students for notification:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
