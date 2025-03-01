import { z } from "zod";
import { emailSchema } from "./utils.js";

export const registerSchema = z.object({
  teacher: emailSchema,
  students: z.array(emailSchema).nonempty({
    message: "At least one student is required",
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
