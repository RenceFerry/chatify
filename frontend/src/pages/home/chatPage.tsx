import Messages from "../../components/chats/chatPage/messages";
import TopMenu from "../../components/chats/chatPage/topMenu";
import InputBottom from "../../components/chats/chatPage/inputBottom";
import { useParams, useSearchParams } from "react-router-dom";
import type { RefObject } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChatPageSkeleton } from "../../components/skeleton";

export type ChatType = ({
    participants: ({
        user: {
            id: string;
            image: string | null;
            created_at: Date;
            username: string;
            password: string | null;
            email: string;
        };
    } & {
        id: string;
        conversationId: string;
        lastReadAt: Date | null;
        unreadCount: number;
        userId: string;
    })[];
    messages: ({
        sender: {
            id: string;
            image: string | null;
            created_at: Date;
            username: string;
            password: string | null;
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        content: string;
        senderId: string;
        conversationId: string;
    })[];
} & {
    id: string;
    createdAt: Date;
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
            created_at: Date;
            username: string;
            password: string | null;
            email: string;
        };
    } & {
        id: string;
        conversationId: string;
        userId: string;
        lastReadAt: Date | null;
        unreadCount: number;
    })[];
    messages: {
        id: string;
        createdAt: Date;
        content: string;
        senderId: string;
        conversationId: string;
    }[];
} & {
    id: string;
    createdAt: Date;
    name: string;
    image: string | null;
    type: 'PRIVATE' | 'GROUP';
    lastMessageAt: Date;
}) | null

const ChatPage = ({tabRef}: {tabRef: RefObject<string | null>}) => {
  const {id} = useParams();
  const [searchParams] = useSearchParams();
  const convoId = searchParams.get('convoId');

  const {data, isError, isLoading} = useQuery<ConversationWithMessagesType>({
    queryKey: ['getMessages', convoId],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/getMessages`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          "Content-Type": 'application/json'
        },
        body: JSON.stringify({ convoId })
      })
      console.log(res.status)
      if (!res.ok) throw new Error();

      return res.json();
    }
  })

  if (isLoading) return <ChatPageSkeleton tabRef={tabRef} />

  return (
    <div className="w-full h-full flex flex-col justify-between items-center bg-back pt-2">
      {/** top section */}
      <TopMenu data={data} id={id} tabRef={tabRef} />

      {/** chat area */}
      <Messages isError={isError} messages={data?.messages} />

      {/** input area */}
      <InputBottom />
    </div>
  )
}

export default ChatPage;