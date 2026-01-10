import { FaCheckDouble } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import clsx from 'clsx';

const ChatCard = ({ img, name, unread, person, lstMessage, date, convoId }: { img: string, name: string, person: string, unread: number, lstMessage: string, date: string, convoId: string }) => {
  const { id } = useParams();

  const navigate = useNavigate();
  const handleChatClick = () => {
    navigate(`/${id}/chat?convoId=${convoId}`);
  }

  return (
    <div onClick={handleChatClick} className='w-full flex flex-row h-14 items-center justify-between gap-2 px-2 hover:bg-hback rounded-lg'>
      {/** profilePic */}
      <div className='h-10 w-10'>
        <img src={img} alt='profile' className='h-full w-full rounded-full object-cover'/>
      </div>

      {/** name and last message */}
      <div className='flex flex-col flex-1'>
        <div className='flex flex-1 flex-row items-center justify-between'>
          <h1 className={clsx('font-semibold w-46 md:w-96 truncate text-md', {
            'text-text': unread > 0,
            'text-textB': unread === 0
          })}>{name}</h1>
          <span className='text-xs text-textB'>{date}</span>
        </div>

        <div className='flex flex-1 flex-row items-center justify-between'>
          <p className='text-textB truncate font-semibold text-xs w-48 md:w-96'><span className='text-blueD'>{person}</span>: {lstMessage}</p>
          <div className={clsx('grid items-center px-1 rounded-sm', {
            'bg-none': unread === 0,
            'bg-blueB': unread > 0
          })}>
            {
              unread === 0 ?
              <FaCheckDouble className="text-textB"/> :
              <span className='text-xs text-textB'>{unread > 99 ? '99+' : unread}</span>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatCard;