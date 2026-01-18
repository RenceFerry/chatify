import Messages from "../../components/chats/chatPage/messages";
import TopMenu from "../../components/chats/chatPage/topMenu";
import InputBottom from "../../components/chats/chatPage/inputBottom";
import { Navigate, useParams, useSearchParams } from "react-router-dom";
import type { RefObject } from "react";

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

const ChatPage = ({tabRef}: {tabRef: RefObject<string | null>}) => {
  const {id} = useParams();
  const [searchParams] = useSearchParams();
  const convoId = searchParams.get('convoId');

  if (!convoId) return <Navigate to={`/${id}/home?tab=chats`} />;

  return (
    <div className="w-full h-full flex flex-col justify-between items-center bg-back pt-2">
      {/** top section */}
      <TopMenu id={id} tabRef={tabRef} />

      {/** chat area */}
      <Messages convoId={convoId} />

      {/** input area */}
      <InputBottom />
    </div>
  )
}

export default ChatPage;