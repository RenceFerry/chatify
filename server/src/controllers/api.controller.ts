import { Request, Response } from 'express';
import {prisma} from '../lib/prisma.js'
import z from 'zod';

const Uiid = z.guid();

export const getUser = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) return res.redirect('/auth/login');

  //@ts-ignore
  const { id } = user;

  try {
    const response = await prisma.users.findUnique({
      where: {
        id
      },
      select: {
        id: true,
        image: true,
        username: true,
        email: true
      }
    })
    res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({error: "server error"});
  }

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
            user: {
              select: {
                username: true, 
                image: true
              }
            }
          },
        },
        messages: {
          take: 1,
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            sender: {
              select: {
                username: true,
                image: true
              }
            }
          }
        }
      }
    })

    return res.status(200).json(chats);

  } catch (e) {
    console.log(e)
    return res.status(500).json({ error: 'Server Error' });
  }
}

export const getGroupsList = async (req: Request, res: Response) => {
  //@ts-ignore
  const { id } = req.user;
  let { search } = req.body;

  if (!search) search = '';

  try {
    const chats = await prisma.conversation.findMany({
      where: {
        type: 'GROUP',
        AND: [
          {
            participants: {
              some: {
                userId: id
              }
            },
          },
          {
            OR: [
              {
                participants: {
                  some: {
                    userId: { not: id},
                    user: {
                      username: {contains: search, mode: 'insensitive'}
                    }
                  }
                }
              },
              {
                name: {
                  contains: search,
                  mode: 'insensitive'
                }
              }
            ]
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
            user: {
              select: {
                image: true,
                username: true
              }
            }
          }
        },
        messages: {
          take: 1,
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            sender: {
              select: {
                image: true,
                username: true
              }
            }
          }
        }
      }
    })

    return res.status(200).json(chats);

  } catch (e) {
    return res.status(500).json({ error: 'Server Error' });
  }
}

export const getMessages = async (req: Request, res: Response) => {
  //@ts-ignore
  const {id} = req.user;
  const {convoId} = req.body || '';

  if (!convoId) return res.status(400).json({ error: 'invalid conversation id'});
  
  const valid = Uiid.safeParse(convoId);
  if (!valid.success) return res.status(400).json({ error: 'invalid conversation id'});

  try{
    const messages = await prisma.conversation.findUnique({
      where: {
        id: convoId,
        participants: {
          some: {
            userId: id
          }
        }
      },
      include: {
        messages: {
          take: 30,
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            sender: {
              select: {
                username: true,
                image: true
              }
            }
          }
        },
        participants: {
          include: {
            user: {
              select: {
                username: true,
                image: true,
                id: true
              }
            }
          }
        }
      }
    })
    res.status(200).json(messages);
  }catch (e) {
    return res.status(500).json({ error: 'server error'});
  }
}