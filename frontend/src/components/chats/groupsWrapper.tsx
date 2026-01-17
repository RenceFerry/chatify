import ChatCard from "./chatCard";
import React from "react";
import logo from '../../assets/logo.png';

const GroupsWrapper = () => {
  

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