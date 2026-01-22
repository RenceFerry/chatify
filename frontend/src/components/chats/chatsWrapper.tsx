import ChatCard from "./chatCard";
import React, { useEffect } from "react";
import { useQuery } from '@tanstack/react-query'
import { ChatCardsSkeleton } from "../../components/skeleton";
import { type ChatType } from "../../pages/home/chatPage";
import { socket } from "../../lib/socket";
import { queryClient } from "../../lib/tansStackQuery";

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
      const dataMessage = await res.json();
      console.log(dataMessage, 'retrieveChats');
      return dataMessage;
    }
  })

  useEffect(() => {
    socket.on('conversation:PRIVATE:new-message', (conversation: ChatType) => {
      queryClient.setQueryData(['retrieveChats', query], (oldValue: ChatType[]) => {
        const newValue = oldValue.filter(old => old.id !== conversation.id)

        console.log('conversation:PRIVATE:new-message', [conversation, ...newValue]);
        return [conversation, ...newValue];
      })
    })
  }, [query])

  if ( isLoading ) return <ChatCardsSkeleton />;

  return (
    <div className='flex w-full h-full flex-col justify-start items-center gap-3 p-4 overflow-scroll no-scrollbar'>
      {
        isError ? 
        <h1 className="text-xl text-textB">Error Fetching Chats</h1> : 
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