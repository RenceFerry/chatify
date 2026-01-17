import ChatCard from "./chatCard";
import React, { useContext } from "react";
import { useQuery } from '@tanstack/react-query'
import { ChatCardsSkeleton } from "../../components/skeleton";
import { UserContext } from '../../App';
import { type ChatType } from "../../pages/home/chatPage";

const ChatsWrapper = () => {
  const { userContext } = useContext(UserContext);
  // const data = [
  //   {
  //     profilePic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=b572f102-ec9b-435a-b063-d527ec74dbe7',
  //     name: 'John Doe ow are you? how hs s fang mga bata ay naglalaro nang buong maghapon at marami sa kanila ang mga namatay dahil sa maraming kar',
  //     lastMessage: 'Hey, how are you? how hs s fang mga bata ay naglalaro nang buong maghapon at marami sa kanila ang mga namatay dahil sa maraming karamdaman',
  //     timestamp: '09/05 2:30 PM',
  //     unreadMessages: 0,
  //     person: 'you',
  //     convoId: '1'
  //   },
  //   {
  //     profilePic: logo,
  //     name: 'John Doe',
  //     lastMessage: 'Hey, how are you?',
  //     timestamp: '09/05 2:30 PM',
  //     unreadMessages: 3,
  //     person: 'john',
  //     convoId: '2'
  //   },
  //   {
  //     profilePic: logo,
  //     name: 'John Doe',
  //     lastMessage: 'Hey, how are you?',
  //     timestamp: '09/05 2:30 PM',
  //     unreadMessages: 3,
  //     person: 'you',
  //     convoId: '3'
  //   },
  //   {
  //     profilePic: logo,
  //     name: 'John Doe',
  //     lastMessage: 'Hey, how are you?',
  //     timestamp: '09/05 2:30 PM',
  //     unreadMessages: 127888,
  //     person: 'john',
  //     convoId: '4'
  //   },
  // ];
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