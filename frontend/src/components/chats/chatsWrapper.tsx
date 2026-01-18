import ChatCard from "./chatCard";
import React from "react";
import { useQuery } from '@tanstack/react-query'
import { ChatCardsSkeleton } from "../../components/skeleton";
import { type ChatType } from "../../pages/home/chatPage";

const ChatsWrapper = ({ query }: { query: string }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['retrieveChats', query],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/getChatsList`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ search: query })
      })
      if (!res.ok) throw new Error();
      return res.json();
    }
  })

  if ( isLoading ) return <ChatCardsSkeleton />;

  return (
    <div className='flex w-full h-full flex-col justify-start items-center gap-3 p-4 overflow-scroll no-scrollbar'>
      {
        isError ? 
        <h1 className="text-xl text-textB">Error Fetching Groups</h1> : 
        data.length===0 && !query ?
        <h1 className="text-xl text-textB">No chats exist</h1> : 
        data.length===0 && query ?
        <h1 className="text-xl text-textB">No match results</h1> :
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