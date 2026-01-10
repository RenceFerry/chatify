import { IoChatbubbleEllipses } from "react-icons/io5";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { IoPersonCircleOutline } from "react-icons/io5";
import { IoPersonCircleSharp } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";
import { TiGroupOutline } from "react-icons/ti";
import { TiGroup } from "react-icons/ti";
import clsx from "clsx";
import type { SetURLSearchParams } from "react-router-dom";
import type { RefObject } from "react";

const Navbar = ({ activeTab, setSearchParams, tabRef }: { activeTab: string | null; setSearchParams: SetURLSearchParams, tabRef: RefObject<string | null> }) => {
    
  const handleClick = (tabValue: string) => {
    setSearchParams({ tab: tabValue });
    tabRef.current = tabValue;
  }

  return (
    <div className="flex flex-row justify-evenly items-center h-14 bg-wA rounded-tl-2xl rounded-tr-2xl w-full gap-3 px-4 md:flex-1 md:flex-col md:h-full md:rounded-none md:py-4 md:px-0 md:justify-start">
      <button onClick={()=>handleClick('chats')} title="chats" type="button" className={clsx("flex flex-col justify-center items-center gap-1 rounded-lg h-[90%] flex-1 md:w-[90%] md:flex-row md:max-h-14 md:gap-4 md:px-3 md:justify-start", {
        'bg-blueC': activeTab === 'chats',
        'hover:bg-hwA': activeTab !== 'chats'
      })}>
        {
          activeTab === 'chats' ?
          <IoChatbubbleEllipses size={24} className="text-wA"/> :
          <IoChatbubbleEllipsesOutline size={24} className="text-textB"/>
        }

        <span className={clsx("m-0 p-0 text-xs text-textB md:block", {
          'text-wA block': activeTab === 'chats',
          'hidden': activeTab !== 'chats'
        })}>Chats</span>
      </button>

      <button title="groups" type="button" onClick={()=>handleClick('groups')} className={clsx("flex flex-col justify-center items-center gap-1 rounded-lg h-[90%] flex-1 md:w-[90%] md:flex-row md:max-h-14 md:gap-4 md:px-3 md:justify-start", {
        'bg-blueC': activeTab === 'groups',
        'hover:bg-hwA': activeTab !== 'groups'
      })}>
        {
          activeTab === 'groups' ?
          <TiGroup size={24} className="text-wA"/> :
          <TiGroupOutline size={24} className="text-textB"/>
        }

        <span className={clsx("m-0 p-0 text-xs text-textB md:block", {
          'text-wA block': activeTab === 'groups',
          'hidden': activeTab !== 'groups'
        })}>Groups</span>
      </button>

      <button type="button" title="profile" onClick={()=>handleClick('profile')} className={clsx("flex flex-col justify-center items-center gap-1 rounded-lg h-[90%] flex-1 md:w-[90%] md:flex-row md:max-h-14 md:gap-4 md:px-3 md:justify-start", {
        'bg-blueC': activeTab === 'profile',
        'hover:bg-hwA': activeTab !== 'profile'
      })}>
        {
          activeTab === 'profile' ?
          <IoPersonCircleSharp size={24} className="text-wA"/> :
          <IoPersonCircleOutline size={24} className="text-textB"/>
        }

        <span className={clsx("m-0 p-0 text-xs text-textB md:block", {
          'text-wA block': activeTab === 'profile',
          'hidden': activeTab !== 'profile'
        })}>Profile</span>
      </button>

      <button type="button" title="more" onClick={()=>handleClick('more')} className={clsx("flex flex-col justify-center items-center gap-1 rounded-lg h-[90%] flex-1 md:w-[90%] md:flex-row md:max-h-14 md:gap-4 md:px-3 md:justify-start", {
        'bg-blueC': activeTab === 'more',
        'hover:bg-hwA': activeTab !== 'more'
      })}>
        {
          activeTab === 'more' ?
          <RxHamburgerMenu size={24} className="text-wA"/> :
          <RxHamburgerMenu size={24} className="text-textB"/>
        }

        <span className={clsx("m-0 p-0 text-xs text-textB md:block", {
          'text-wA block': activeTab === 'more',
          'hidden': activeTab !== 'more'
        })}>More</span>
      </button>
    </div>
  )
}

export default Navbar