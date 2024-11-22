import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, { message: "Content must be of at least 10 characters" })
    .max(300, { message: "Message exceeding limit" }),
});
