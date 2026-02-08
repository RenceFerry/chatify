import { IoArrowBackSharp } from "react-icons/io5";
import { PiDotsThreeOutlineLight } from "react-icons/pi";
import { IoVideocamOutline } from "react-icons/io5";
import { FiPhone } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { type RefObject } from "react";
import type { ConversationWithMessagesType } from "../../../pages/home/chatPage";
import { IoPersonCircleSharp } from "react-icons/io5";

const TopMenu = ({data, id, tabRef}: {data: ConversationWithMessagesType | undefined, id: string | undefined, tabRef: RefObject<string | null>}) => {
  const navigate = useNavigate();
  const isPrivate = data?.type === 'PRIVATE';
  const name = isPrivate ? data.participants[0].user.id === id ? data.participants[1].user.username : data.participants[0].user.username : data?.name;
  const image = isPrivate ? data.participants[0].user.id === id ? data.participants[1].user.image : data.participants[0].user.image : data?.image;

  const handleBack = () => {
    navigate(`/${id}/home?tab=${tabRef.current}`)
  }

  return (
    <div className="flex flex-col h-22 pb-2 w-full gap-2 px-5 shadow-[0_4px_6px_1px_rgba(0,0,0,0.01)] shadow-wA">
      <div className="flex fle-row justify-between items-center flex-1">
        <button onClick={handleBack} type="button" title="back" className="h-8 w-8 hover:bg-hback rounded-full shadow-[0_2px_6px_1px_rgba(0,0,0,0.01)] shadow-wA">
          <IoArrowBackSharp className="text-2xl m-auto cursor-pointer text-text"/>
        </button>
        <h1 className="text-md font-semibold text-text">Messages</h1>
        <button type="button" title="more" className="h-8 w-8 hover:bg-hback rounded-full shadow-[0_2px_6px_1px_rgba(0,0,0,0.01)] shadow-wA">
          <PiDotsThreeOutlineLight className="text-2xl cursor-pointer text-text m-auto"/>
        </button>
      </div>

      <div className="flex flex-row justify-between items-center flex-1">
        <div className="flex flex-row justify-center gap-3 items-center ml-5 cursor-pointer">
          <div className="rounded-full h-8 w-8 md:h-10 md:w-10 overflow-hidden bg-blueB">
            {
              image ?
              <img src={image} alt='profile pic' className="object-cover"/> :
              <IoPersonCircleSharp className="h-full w-full text-textB" />
            }
          </div>
          <h2 className="text-blueD text-md md:text-xl font-semibold">{name}</h2>
        </div>

        <div className="flex flex-row gap-3 items-center justify-center mr-5">
          <button type="button" title="video call" className="hover:bg-hback rounded-full h-8 w-8">
            <IoVideocamOutline className="text-2xl m-auto cursor-pointer text-text"/>
          </button>

          <button type="button" title="audio call" className="hover:bg-hback rounded-full h-8 w-8">
            <FiPhone className="text-xl m-auto cursor-pointer text-text"/>
          </button>
        </div>
      </div>
    </div>
  )
}

export default TopMenu;