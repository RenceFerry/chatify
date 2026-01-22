import React from "react";
import { useQuery } from '@tanstack/react-query'
import { ChatCardsSkeleton } from "../../components/skeleton";
import { type ChatType } from "../../pages/home/chatPage";
import ChatCard from "./chatCard";
import { BACKEND_URL } from "../../utils/helpers";

const GroupsWrapper = ({query}: {query: string}) => {
    const { data, isLoading, isError } = useQuery({
      queryKey: ['retrieveGroups', query],
      queryFn: async () => {
        const res = await fetch(`${BACKEND_URL}/api/getGroupsList`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({ search: query})
        })
        if (!res.ok) throw new Error();
        return res.json();
      },
    });
  
    if (isLoading) return <ChatCardsSkeleton />;

  return (
    <div className='flex-1 flex w-full h-full flex-col justify-start items-center gap-1 p-4 overflow-scroll no-scrollbar'>
      {
        isError ? 
        <h1 className="text-xl text-textB">Error Fetching Groups</h1> : 
        data.length===0 && !query ?
        <h1 className="text-xl text-textB">No groups exist</h1> : 
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

export default GroupsWrapper;