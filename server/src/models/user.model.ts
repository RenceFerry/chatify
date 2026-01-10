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
  findOrCreate: (data: { 
    email: string;
    username: string; 
    password?: string | null;
    image?: string;
  }) => prisma.users.upsert({
    where: { email: data.email},
    update: {},
    create: {
      email: data.email,
      username: data.username,
      image: data.image,
    },
    select: {
      id: true,
      username: true,
      email: true,
    }
  })
}