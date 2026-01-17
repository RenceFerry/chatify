import { Request, Response } from 'express';
import {prisma} from '../lib/prisma.js'

export const getUser = (req: Request, res: Response) => {
  const user = req.user;
  if (!user) return res.redirect('/auth/login');

  //@ts-ignore
  const { username, email, id } = user;

  res.status(200).json({username, email, id});
}

export const getListForCreatingGroups = async (req: Request, res: Response) => {
  const user = req.user;
  let search = req.body.search || null;

  if (search === null) return res.status(400).json({ error: 'Invalid query'});
  if (search === '*') search = '';
  
  //@ts-ignore
  const { id } = user;

  try {
    const chats = await prisma.users.findMany({
      where: {
        id: { not: id},
        username: { contains: search, mode: 'insensitive' },
        conversations: {
          some: {
            conversation: {
              participants: {
                some: {
                  userId: id
                }
              }
            }
          }
        }
      },
      orderBy: {
        username: 'asc'
      },
      take: 50
    });

    res.status(200).json(chats);

  } catch (e) {
    return res.status(500).json({message: 'server error'});
  }
}

export const getPeoplesListForCreatingChats = async (req: Request, res: Response) => {
  const user = req.user;
  let search = req.body.search || null;

  if (search === null) return res.status(400).json({ error: 'Invalid query'});
  if (search === '*') search = '';
  
  //@ts-ignore
  const { id } = user;

  try {
    const users = await prisma.users.findMany({
      where: {
        id: { not: id},
        username: { contains: search, mode: 'insensitive' },
        conversations: {
          none: {
            conversation: {
              participants: {
                some: {
                  userId: id
                }
              }
            }
          }
        }
      },
      orderBy: {
        username: 'asc'
      },
      take: 50
    });

    res.status(200).json(users);

  } catch (e) {
    return res.status(500).json({message: 'server error'});
  }
}

export const getChatsList = async (req: Request, res: Response) => {
  //@ts-ignore
  const { id } = req.user;
  let { search } = req.body;

  if (!search) search = '';

  try {
    const chats = await prisma.conversation.findMany({
      where: {
        type: 'PRIVATE',
        AND: [
          {
            participants: {
              some: {
                userId: id
              }
            },
          },
          {
            participants: {
              some: {
                userId: { not: id},
                user: {
                  username: {contains: search, mode: 'insensitive'}
                }
              }
            }
          }
        ]
      },
      take: 25,
      orderBy: {
        lastMessageAt: 'desc'
      },
      include: {
        participants: {
          include: {
            user: true,
          }
        },
        messages: {
          take: 1,
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            sender: true
          }
        }
      }
    })

    return res.status(200).json(chats);

  } catch (e) {
    return res.status(500).json({ error: 'Server Error' });
  }

}