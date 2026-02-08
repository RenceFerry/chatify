import { prisma } from "../lib/prisma.js";
import { Socket, Server } from "socket.io";
import { storeMessages, setUnreadCount } from "./socketcontollers/serverActions.controller.js";
import redis from "../lib/redis.js";

export const conversationEvents = async (socket: Socket, io: Server) => {
  socket.on('conversation:open', async (convoId: string) => {
    socket.join(convoId);
    
    try {
      await prisma.conversationParticipant.update({
        where: {
          userId_conversationId: {
            userId: socket.data.user.id,
            conversationId: convoId
          }
        },
        data: {
          lastReadAt: new Date()
        }
      })
    } catch (e) {
      console.log(e);
    }
  });

  socket.on('conversation:close', async (convoId: string) => {
    socket.leave(convoId);
  });
}

export const messageEvents = (socket: Socket, io: Server) => {
  const user = socket.data.user;

  socket.on('message:send', async ({message, convoId}) => {
    const messageStore = await storeMessages(message);

    if (!messageStore) {
      socket.emit('message:failed', message);
      return;
    }

    socket.to(convoId).emit('message:new', messageStore.messages[0]);

    const participants = messageStore.participants;
    const socketsIn = await io.in(convoId).fetchSockets();
    const idIn: string[] = socketsIn.map(socket => socket.data.user.id).filter(Boolean);
    const socketsOut = participants.filter((participant: {
        user: {
            image: string | null;
            username: string;
        };
    } & {
        id: string;
        lastReadAt: Date | null;
        unreadCount: number;
        userId: string;
        conversationId: string;
    }) => !idIn.includes(participant.userId) && participant.userId !== user.id)

    participants.forEach((participant: {
        user: {
            image: string | null;
            username: string;
        };
    } & {
        id: string;
        lastReadAt: Date | null;
        unreadCount: number;
        userId: string;
        conversationId: string;
    }) => {
      io.to(participant.userId).emit(`conversation:${messageStore.type}:new-message`, messageStore);
    })

    if (socketsOut.length > 0) {
      setUnreadCount(socketsOut);
    }

    socket.emit('message:sent', {sentMessage: messageStore.messages[0], id: message.id});
  })
};

export const callsEvents = (socket: Socket, io: Server) => {
  socket.on('call:start', ({ to, isVideo }) => {
    socket.to(to).emit('call:incoming', { from: socket.data.user.id, isVideo });
  });

  socket.on('call:answer', ({ to, answer }) => {
    socket.to(to).emit('call:answered', { from: socket.data.user.id, answer });
  });

  socket.on('call:ice-candidate', ({ to, candidate }) => {
    socket.to(to).emit('call:ice-candidate', { from: socket.data.user.id, candidate });
  });

  socket.on('call:end', ({ to }) => {
    socket.to(to).emit('call:ended', { from: socket.data.user.id });
  });
}