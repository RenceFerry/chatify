import { Request, Response } from "express";
import { prisma } from '../lib/prisma.js'
import { Prisma } from "../generated/prisma/client.js";

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