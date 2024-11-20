import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "Username must be at least 2 characters long")
  .max(20, "Username must not exceed 20 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters");

//signup will contain multiple values hence initialising it as an object
export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: 'Invalid email address'}),
    password: z.string().min(6, {message: 'Password should contain at least 6 characters'})
})