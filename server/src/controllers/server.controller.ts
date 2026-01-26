import { generateSecureNumber } from "../lib/utils.js"; 
import { Request, Response } from "express";
import { prisma } from '../lib/prisma.js'
import { Prisma } from "../generated/prisma/client.js";
import { EditProfileSchema } from "../lib/schema.js";
import z from 'zod';
import redis from "../lib/redis.js";
import { sendEmail } from './auth.controller.js'

export const createConvo = async (req: Request, res: Response) => {
  const participants: {
    user: {
      username: string,
      id: string,
      email: string
    },
    toFriend: {
      username: string,
      id: string,
      email: string
    }
  } = req.body;

  if (!participants) return res.status(400).json({ error: 'Invalid Group Participants'});

  try {
    const convo = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const existingConversation = await tx.conversation.findFirst({
        where: {
          type: 'PRIVATE',
          AND: [
            { 
              participants: {
                some: { userId: participants.user.id}
              },
            },
            {
              participants: {
                some: { userId: participants.toFriend.id}
              }
            },
            {
              participants: {
                none: {
                  userId: {
                    notIn: [ participants.user.id, participants.toFriend.id]
                  }
                }
              }
            }
          ]
        }
      })

      if (existingConversation) throw Error('Existion Conversation');

      const conversation = await tx.conversation.create({
        data: {
          type: 'PRIVATE',
          name: `${participants.user.username} and ${participants.toFriend.username}`,
          participants: {
            create: [
              {
                user: {
                  connect: {
                    id: participants.user.id
                  }
                }
              },
              {
                user: {
                  connect: {
                    id: participants.toFriend.id
                  }
                }
              }
            ]
          }
        }
      })

      return conversation;
    })

    return  res.status(201).json(convo);
  } catch (e) {
    return res.status(500).json({ error: 'Conversation Creation Failed'});
  }
}

export const createGroup = async (req: Request, res: Response) => {
  const participants: {
    user: {
      username: string,
      id: string,
      email: string
    },
    toFriend: {
      username: string,
      id: string,
      email: string
    }
  } = req.body;

  if (!participants) return res.status(400).json({ error: 'Invalid Group Participants'});

  try {
    const group = await prisma.conversation.create({
      data: {
        type: 'GROUP',
        name: `${participants.user.username} and ${participants.toFriend.username}`,
        participants: {
          create: [
            {
              user: {
                connect: {
                  id: participants.user.id
                }
              }
            },
            {
              user: {
                connect: {
                  id: participants.toFriend.id
                }
              }
            }
          ]
        }
      }
    })

    return  res.status(201).json(group);
  } catch (e) {
    return res.status(500).json({ error: 'Conversation Creation Failed'});
  }
}

export const editProfile = async (req: Request, res: Response) => {
  //@ts-ignore
  const {id, email: userEmail}: {id: string, userEmail: string} = req.user;
  const data = req.body;

  const validatedData = EditProfileSchema.safeParse(data);
  if (!validatedData.success) {
    return res.status(400).json(z.treeifyError(validatedData.error));
  }

  const { username, email, bio }: {bio: string, email: string, username: string} = data; 

  try {
    const emailExist = await prisma.users.findUnique({
      where: {
        email: validatedData.data.email,
      }
    })

    if (emailExist) return res.status(400).json({ errors: ['Email already exist']});

    const otp = generateSecureNumber(6);
    await redis.set(userEmail, JSON.stringify({username, bio, email, otp, id}), {expiration: {type: 'EX', value: 60*5}});

    res.cookie("email", userEmail, {
      path: '/',
      httpOnly: true,
      //@ts-ignore
      sameSite: true,
      secure: true,
    })
    await sendEmail(userEmail, otp);

    res.status(200).json('verify your email');
  } catch (e) {
    console.log(e);
    return res.status(500).json({ errors: ['server error']});
  }
}

export const updateProfile = async (req: Request, res: Response) => {
  //@ts-ignore
  const {email, username, id, bio} = req.user;

  try {
    const result = await prisma.users.update({
      where: {
        id
      },
      data: {
        username,
        email,
        bio
      },
      select: {
        id: true,
        username: true,
        email: true,
        image: true,
        bio: true
      }
    })

    if (!result) return res.status(400).json({ errors: ['not found']});

    return res.status(200).json(result);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ errors: ['server error']})
  }
}

export const resendOtp = async (req: Request, res: Response) => {
  const email = req.cookies.email;

  if (!email) return res.status(400).json({ errors: ['email not found, resend data']});

  try {
    const pass = await redis.get(email);

    if (!pass) return res.status(400).json({ errors: ['Otp Expired, Submit details again']});

    const otp = generateSecureNumber(6);
    const data = JSON.parse(pass);

    await redis.set(email, JSON.stringify({
      id: data.id,
      email: data.email,
      otp,
      bio: data.bio,
      username: data.username
    }))

    sendEmail(email, otp);

    res.status(200).json({message: "Otp sent"});
  } catch (e) {
    return res.status(500).json({ errors: ['server error']});
  }
}