import ChatCard from "./chatCard";
import React from "react";
import logo from '../../assets/logo.png';

const GroupsWrapper = () => {
  const data = [
    {
      profilePic: logo,
      name: 'John Doe ow are you? how hs s fang mga bata ay naglalaro nang buong maghapon at marami sa kanila ang mga namatay dahil sa maraming kar',
      lastMessage: 'Hey, how are you? how hs s fang mga bata ay naglalaro nang buong maghapon at marami sa kanila ang mga namatay dahil sa maraming karamdaman',
      timestamp: '09/05 2:30 PM',
      unreadMessages: 0,
      person: 'you',
      convoId: '1'
    },
    {
      profilePic: logo,
      name: 'John Doe',
      lastMessage: 'Hey, how are you?',
      timestamp: '09/05 2:30 PM',
      unreadMessages: 3,
      person: 'john',
      convoId: '2'
    },
    {
      profilePic: logo,
      name: 'John Doe',
      lastMessage: 'Hey, how are you?',
      timestamp: '09/05 2:30 PM',
      unreadMessages: 3,
      person: 'you',
      convoId: '3'
    },
    {
      profilePic: logo,
      name: 'John Doe',
      lastMessage: 'Hey, how are you?',
      timestamp: '09/05 2:30 PM',
      unreadMessages: 127888,
      person: 'john',
      convoId: '4'
    },
  ];

  return (
    <div className='flex-1 flex w-full h-full flex-col justify-start items-center gap-1 p-4'>
      {data.map((chat, index) => (
        <React.Fragment key={index}>
          <ChatCard
            person={chat.person}
            img={chat.profilePic}
            name={chat.name}
            lstMessage={chat.lastMessage}
            date={chat.timestamp}
            unread={chat.unreadMessages}
            convoId={chat.convoId}
          />
        </React.Fragment>
      ))}
    </div>
  )
}

export default GroupsWrapper;