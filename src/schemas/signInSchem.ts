import { z } from "zod";

//identifier --> username/email etc
export const signInSchema = z.object({
  identifier: z.string(),
  password: z.string(),
  
    
});
