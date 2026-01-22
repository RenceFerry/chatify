
import {prisma} from '../../lib/prisma.js'

export const storeMessages = async (message: {
  id: string,
  senderId: string,
  content: string,
  conversationId: string,
  sender: {
    username: string,
    image: string
  }
}) => {
  const {senderId, conversationId, content} = message;

  try{
    const response = await prisma.conversation.update({
      where: {
        id: conversationId
      },
      data: {
        lastMessageAt: new Date(),
        messages: {
          create: {
            content, 
            createdAt: new Date(),
            sender: {
              connect: {id: senderId}
            },
          }
        }
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1,
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
                image: true
              }
            }
          }
        }
      }
    })
    return response;
  }catch(e){
    return null;
  }
}

export const getParticipants = async (convoId: string, id: string) => {
  try {
    const participants = await prisma.conversationParticipant.findMany({
      where: {
        conversationId: convoId,
        userId: {
          not: id
        }
      }
    })

    return participants;
  } catch (e) {
    return null;
  }
}

export const setUnreadCount = async (participants: ({
user: {
    image: string | null;
    username: string;
};
} & {
    id: string;
    conversationId: string;
    userId: string;
    lastReadAt: Date | null;
    unreadCount: number;
})[]) => {
  const idOut = participants.map(participants => participants.userId);

  try {
    await prisma.conversationParticipant.updateMany({
      where: {
        conversationId: participants[0]!.conversationId,
        userId: { in: idOut}
      },
      data: {
        unreadCount: {increment: 1}
      }
    })
  } catch (e) {
    console.log(e);
  }
}