import { z } from "zod";

export const messageSchema = z.object({
  content: z.string ().min(1, {message: 'Content must be of at least 10 characters'})
 
});