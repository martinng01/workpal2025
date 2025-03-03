import { z } from "zod";
import { emailSchema } from "./utils.js";

export const registerSchema = z.object({
  body: z.object({
    teacher: emailSchema.nonempty({
      message: "Teacher is required",
    }),
    students: z.array(emailSchema).nonempty({
      message: "At least one student is required",
    }),
  }),
});

export const commonStudentsSchema = z.object({
  teacher: z.array(emailSchema).nonempty({
    message: "At least one teacher is required",
  }),
});

export const suspendStudentSchema = z.object({
  student: emailSchema,
});

export const notificationSchema = z.object({
  teacher: emailSchema,
  notification: z.string(),
});
