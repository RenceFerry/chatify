import Messages from "../../components/chats/chatPage/messages";
import TopMenu from "../../components/chats/chatPage/topMenu";
import InputBottom from "../../components/chats/chatPage/inputBottom";
import { useSearchParams } from "react-router-dom";
import { type RefObject, useContext, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChatPageSkeleton } from "../../components/skeleton";
import {socket} from '../../lib/socket';
import { queryClient } from "../../lib/tansStackQuery";
import { UserContext } from "../../App";
import { generateRandomNumber } from "../../utils/helpers";
import { BACKEND_URL } from "../../utils/helpers";

export type ChatType = ({
    participants: ({
        user: {
            image: string | null;
            username: string;
        };
    } & {
        id: string;
        conversationId: string;
        lastReadAt: string | null;
        unreadCount: number;
        userId: string;
    })[];
    messages: ({
        sender: {
            image: string | null;
            username: string;
        };
    } & {
        id: string;
        createdAt: string;
        content: string;
        senderId: string;
        conversationId: string;
    })[];
} & {
    id: string;
    createdAt: string;
    name: string;
    image: string | null;
    type: 'PRIVATE' | 'GROUP';
    lastMessageAt: Date;
})

export type ConversationWithMessagesType = ({
    participants: ({
        user: {
            id: string;
            image: string | null;
            username: string;
        };
    } & {
        id: string;
        conversationId: string;
        userId: string;
        lastReadAt: string | null;
        unreadCount: number;
    })[];
    messages: ({
        sender: {
            image: string | null;
            username: string;
        };
    } & {
        id: string;
        createdAt: string;
        content: string;
        senderId: string;
        conversationId: string;
    })[];
} & {
    id: string;
    createdAt: string;
    name: string;
    image: string | null;
    type: 'PRIVATE' | 'GROUP';
    lastMessageAt: Date;
}) | null

const ChatPage = ({tabRef}: {tabRef: RefObject<string | null>}) => {
  const {userContext} = useContext(UserContext);
  const [searchParams] = useSearchParams();
  const convoId = searchParams.get('convoId');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {data, isError, isLoading} = useQuery<ConversationWithMessagesType>({
    queryKey: ['getMessages', convoId],
    queryFn: async () => {
      const res = await fetch(`${BACKEND_URL}/api/getMessages`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          "Content-Type": 'application/json'
        },
        body: JSON.stringify({ convoId })
      })
      if (!res.ok) throw new Error();

      const dataMessage = await res.json()
      dataMessage.messages.reverse();
      return dataMessage;
    }
  })

  const onSend = () => {
    const value = textareaRef.current?.value;
    if (!value) return;
    let message;

    queryClient.setQueryData(['getMessages', convoId], (oldValue: ConversationWithMessagesType) => {
      const newValue = structuredClone(oldValue);
      const id = String(generateRandomNumber(6));

      newValue?.messages.push({
        createdAt: 'sending...',
        senderId: userContext!.id,
        content: value,
        conversationId: oldValue?.id ?? '',
        id,
        sender: {
          username: userContext!.username,
          image: userContext!.image
        }
      })

      message = {
        senderId: userContext!.id,
        content: value,
        conversationId: oldValue?.id ?? '',
        id,
        sender: {
          username: userContext!.username,
          image: userContext!.image
        }
      }

      return newValue;
    })

    textareaRef.current!.value = '';
    textareaRef.current?.focus();

    socket.emit('message:send', {message, convoId});
  }

  useEffect(() => {
    socket.on('message:failed', (failedMessage) => {
      queryClient.setQueryData(['getMessages', convoId], (oldValue: ConversationWithMessagesType)=> {
        const newValue = structuredClone(oldValue);

        for (const message of newValue!.messages) {
          if (message.id === failedMessage.id) {
            message.createdAt = 'failed';
          }
        }

        return newValue;
      })
    })

    socket.on('message:sent', ({sentMessage, id}) => {
      queryClient.setQueryData(['getMessages', convoId], (oldValue: ConversationWithMessagesType) => {
        const newValue = structuredClone(oldValue);
        newValue?.messages.forEach((message, i) => {
          if (message.id === id) {
            newValue.messages[i] = structuredClone(sentMessage);
          }
        })

        return newValue;
      })
    })

    socket.on('message:new', (message) => {
      queryClient.setQueryData(['getMessages', convoId], (oldValue: ConversationWithMessagesType) => {
        const newValue = structuredClone(oldValue);

        newValue?.messages.push(message);

        return newValue;
      })
    })


  }, [convoId])

  useEffect(() => {
    socket.emit('conversation:open', convoId);

    return () => {
      socket.emit('conversation:close', convoId);
    }
  }, [convoId]);

  if (isLoading) return <ChatPageSkeleton tabRef={tabRef} />


  return (
    <div className="w-full h-full flex flex-col justify-between items-center bg-back pt-2">
      {/** top section */}
      <TopMenu data={data} id={userContext!.id} tabRef={tabRef} />

      {/** chat area */}
      <Messages isError={isError} messages={data?.messages} />

      {/** input area */}
      <InputBottom onSend={onSend} textareaRef={textareaRef} />
    </div>
  )
}

export default ChatPage;