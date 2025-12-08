import { prisma } from "../lib/prisma.js";

export const User = {
  create: (options: {
    data: { 
      email: string;
      username: string; 
      password?: string | null; 
      image?: string
    },
    select?: object
  }) => prisma.users.create({ data: options.data, select: options.select ? options.select : null }),

  findByEmail: (email: string) => prisma.users.findUnique({ where: { email } }),
  findById: (id: string) => prisma.users.findUnique({ where: { id } }),
}