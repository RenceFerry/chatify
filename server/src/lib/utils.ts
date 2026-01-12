import crypto from 'crypto';
import { type UserType } from './customTypes.js'
import { User } from '../models/export.js'
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';

export const generateSecureNumber = (digit: number) => {
  const min = 10 ** (digit - 1);
  const max = 10 ** digit;

  return crypto.randomInt(min, max);
}

//just a list of users for testing
export const users = Array.from({ length: 500 }, () => ({
  username: faker.internet.username(),
  email: faker.internet.email(),
  password: '12345678',
  image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${faker.string.uuid()}`
}))

export const createUsers = async ( users: UserType[] ) => {
  for (const user of users) {
    const { email, username, password, image } = user;

    const hashedPassword = await bcrypt.hash(password as string, 10);

    try {
      await User.create({
        data: {
          email,
          username,
          password: hashedPassword,
          image
        }
      })
    } catch(e) {
      console.log(e);
    }
  }
}