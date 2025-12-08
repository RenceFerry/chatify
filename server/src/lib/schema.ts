import z from 'zod';

export const signupSchema = z.object({
  username: z.string().min(3, "username must be at least 3 characters long").max(15, "username must be at most 15 characters long").regex(/^[a-zA-Z0-9_]+$/, "username can only contain letters, numbers, and underscores"),
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long")
})

export const loginSchema = signupSchema.pick({
  email: true,
  password: true
})