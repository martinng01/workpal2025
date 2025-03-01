import { z } from "zod";
import { emailSchema } from "./utils.js";

export const registerSchema = z.object({
  teacher: emailSchema,
  students: z.array(emailSchema).nonempty({
    message: "At least one student is required",
  }),
});
