import Messages from "../../components/chats/chatPage/messages";
import TopMenu from "../../components/chats/chatPage/topMenu";
import InputBottom from "../../components/chats/chatPage/inputBottom";
import { useParams } from "react-router-dom";
import type { RefObject } from "react";

const ChatPage = ({tabRef}: {tabRef: RefObject<string | null>}) => {
  const {id} = useParams();

  return (
    <div className="w-full h-full flex flex-col justify-between items-center bg-back pt-2">
      {/** top section */}
      <TopMenu id={id} tabRef={tabRef} />

      {/** chat area */}
      <Messages />

      {/** input area */}
      <InputBottom />
    </div>
  )
}

export default ChatPage;