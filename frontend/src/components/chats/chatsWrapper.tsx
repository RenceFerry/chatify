import ChatCard from "./chatCard";
import React, { useContext } from "react";
import { useQuery } from '@tanstack/react-query'
import { ChatCardsSkeleton } from "../../components/skeleton";
import { UserContext } from '../../App';
import { type ChatType } from "../../pages/home/chatPage";

const ChatsWrapper = () => {
  const { userContext } = useContext(UserContext);
  const { data, isLoading, isError } = useQuery({
    queryKey: ['retrieveChats', userContext!.id],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/getChatsList`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
      })
      if (!res.ok) throw new Error();
      return res.json();
    }
  })

  if (isLoading) return <ChatCardsSkeleton />;

  return (
    <div className='flex-1 flex w-full h-full flex-col justify-start items-center gap-3 p-4'>
      {
        isError ? 
        <h1>Error Fetching Chats</h1> :
        data.map((chat: ChatType, index: number) => (
        <React.Fragment key={index}>
          <ChatCard
            chat={chat}
          />
        </React.Fragment>
      ))}
    </div>
  )
}

export default ChatsWrapper;