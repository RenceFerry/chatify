import z from 'zod';

export const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long").max(15, "Username must be at most 15 characters long").regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long")
})

export const loginSchema = signupSchema.pick({
  email: true,
  password: true
})

export const EditProfileSchema = signupSchema.pick({
  email: true,
  username: true,
})

export const OtpSchema = z.object({
  otp: z.string().min(6, 'Otp must be a six digit number').max(6, 'Otp must be a six digit number').regex(/^[0-9]/, 'Otp must only be numbers'),
})