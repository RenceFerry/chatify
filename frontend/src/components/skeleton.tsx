import clsx from "clsx"
import { useParams, useSearchParams, Navigate, useNavigate } from "react-router-dom"
import { IoArrowBackSharp } from "react-icons/io5";
import { PiDotsThreeOutlineLight } from "react-icons/pi";
import { IoVideocamOutline } from "react-icons/io5";
import { FiPhone } from "react-icons/fi";
import InputBottom from "./chats/chatPage/inputBottom";
import { useRef } from "react";

export const ChatCardsSkeleton = () => {
  return (
    <div className="flex-1 flex w-full h-full flex-col justify-start items-center gap-3 p-4 overflow-scroll no-scrollbar">
      {
        Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className='w-full flex flex-row h-14 items-center justify-between gap-2 py-3 px-2 bg-hwA rounded-lg animate-pulse'>
            {/** profilePic */}
            <div className='h-10 w-10 bg-back rounded-full' />
      
            {/** name and last message */}
            <div className='flex flex-col flex-1 gap-2'>
              <div className='flex flex-1 flex-row items-center justify-between gap-5'>
                <div className="w-[75%] h-4 bg-back rounded-full"/>
                <div className="w-20 h-3 bg-back rounded-full"/>
              </div>
      
              <div className='flex flex-1 flex-row items-center justify-between'>
                <div className="w-[65%] h-3 bg-back rounded-full"/>
                <div className="w-3 h-2 bg-back rounded-full"/>
              </div>
            </div>
          </div>
        ))
      }
    </div>
  )
}

export const UsersListSkeleton = () => {
  return (
    <div className="w-[90%] max-w-[500px] h-full flex flex-col justify-start pt-4 items-center gap-3">
      <div className="bg-back w-full h-14 md:h-16 rounded-lg animate-pulse flex flex-row items-center justify-start pl-4 gap-3">
        <div className="rounded-full h-8 w-8 md:h-10 md:w-10 bg-wA"/>
        <div className="rounded-full h-4 w-[50%] bg-wA"/>
      </div>
      <div className="bg-back w-full h-14 md:h-16 rounded-lg animate-pulse flex flex-row items-center justify-start pl-4 gap-3">
        <div className="rounded-full h-8 w-8 md:h-10 md:w-10 bg-wA"/>
        <div className="rounded-full h-4 w-[50%] bg-wA"/>
      </div>
      <div className="bg-back w-full h-14 md:h-16 rounded-lg animate-pulse flex flex-row items-center justify-start pl-4 gap-3">
        <div className="rounded-full h-8 w-8 md:h-10 md:w-10 bg-wA"/>
        <div className="rounded-full h-4 w-[50%] bg-wA"/>
      </div>
      <div className="bg-back w-full h-14 md:h-16 rounded-lg animate-pulse flex flex-row items-center justify-start pl-4 gap-3">
        <div className="rounded-full h-8 w-8 md:h-10 md:w-10 bg-wA"/>
        <div className="rounded-full h-4 w-[50%] bg-wA"/>
      </div>
      <div className="bg-back w-full h-14 md:h-16 rounded-lg animate-pulse flex flex-row items-center justify-start pl-4 gap-3">
        <div className="rounded-full h-8 w-8 md:h-10 md:w-10 bg-wA"/>
        <div className="rounded-full h-4 w-[50%] bg-wA"/>
      </div>
      <div className="bg-back w-full h-14 md:h-16 rounded-lg animate-pulse flex flex-row items-center justify-start pl-4 gap-3">
        <div className="rounded-full h-8 w-8 md:h-10 md:w-10 bg-wA"/>
        <div className="rounded-full h-4 w-[50%] bg-wA"/>
      </div>
      <div className="bg-back w-full h-14 md:h-16 rounded-lg animate-pulse flex flex-row items-center justify-start pl-4 gap-3">
        <div className="rounded-full h-8 w-8 md:h-10 md:w-10 bg-wA"/>
        <div className="rounded-full h-4 w-[50%] bg-wA"/>
      </div>
    </div>
  )
}

export const MessagesSkeleton = () => {
  return (
    <div className='flex-1 flex flex-col bg-wA w-full items-center p-4 overflow-y-scroll overflow-x-hidden gap-3 no-scrollbar'>
      {Array.from({length: 4}).map((_, index) => (
        <div key={index} className={clsx('max-w-[500px] my-1 p-2 rounded-xl flex flex-col text-sm md:text-lg w-[65%] bg-textC animate-pulse gap-2', {
          'self-end text-back rounded-br-none': index%2===0,
          'self-start text-text rounded-bl-none': index%2!==0
        })}>
          {Array.from({length: (index+1)*2}).map((_, i) => (
            <div key={i} className={clsx('bg-wA h-4 rounded-full w-11/12 m-2',{
              'self-end text-wA': index%2===0,
              'self-start text-textB': index%2!==0
            })} />
          ))}
        </div>
      ))}
    </div>
  )
}

export const ChatPageSkeleton = ({tabRef}: {tabRef: React.RefObject<string |null>}) => {
  const {id} = useParams();
  const [searchParams] = useSearchParams();
  const convoId = searchParams.get('convoId');
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(`/${id}/home?tab=${tabRef.current}`)
  }

  const onSend = () => {};

  if (!convoId) return <Navigate to={`/${id}/home?tab=chats`} />;

  return (
    <div className="w-full h-full flex flex-col justify-between items-center bg-back pt-2">
      {/** top section */}
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
            <div className="rounded-full h-8 w-8 overflow-hidden bg-wA animate-pulse" />
            <div className="rounded-full h-6 w-18 bg-wA" />
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

      {/** chat area */}
      <MessagesSkeleton />

      {/** input area */}
      <InputBottom onSend={onSend} textareaRef={textareaRef} />
    </div>
  )
}
