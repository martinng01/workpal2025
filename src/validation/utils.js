import { z } from "zod";

export const emailSchema = z
  .string()
  .email({ message: "Please enter a valid email." });
