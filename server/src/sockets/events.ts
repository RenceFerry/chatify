import { Socket, Server } from "socket.io";
import { storeMessages, setUnreadCount } from "./socketcontollers/serverActions.controller.js";

export const conversationEvents = (socket: Socket, io: Server) => {
  socket.on('conversation:open', (convoId) => {
    socket.join(convoId);
    console.log(socket.id + 'joined' + convoId);
  })

  socket.on('conversation:close', (convoId) => {
    socket.leave(convoId);
    console.log(socket.id + 'leave' + convoId);
  })
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
    const socketsOut = participants.filter(participant => !idIn.includes(participant.userId) && participant.userId !== user.id)

    participants.forEach(participant => {
      io.to(participant.userId).emit(`conversation:${messageStore.type}:new-message`, messageStore);
    })

    if (socketsOut.length > 0) {
      setUnreadCount(socketsOut);
    }

    socket.emit('message:sent', {sentMessage: messageStore.messages[0], id: message.id});
  })
}

