import { FaCheckDouble } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { type ChatType } from "../../pages/home/chatPage";
import clsx from 'clsx';
import { IoPersonCircleSharp } from "react-icons/io5";
import { formatMessageTime } from "../../utils/helpers";

const ChatCard = ({chat}: {chat: ChatType}) => {
  const { id } = useParams();
  const { image: img, messages, participants, id: convoId } = chat; 

  let me, friend;
  if (participants[0].userId === id) {
    me = participants[0];
    friend = participants[1];
  } else {
    me = participants[1];
    friend = participants[0]; 
  }

  const date = messages[0] ? formatMessageTime(messages[0]?.createdAt) : '';
  const sender = messages[0] ? messages[0].senderId === id ? 'You:' : messages[0].sender.username + ':' : '';
  const unread = me.unreadCount;
  const name = chat.type === 'PRIVATE' ? friend.user.username.split(' ')[0] : chat.name;
  const lstMessage = messages[0] ? messages[0].content: `Begin Conversation with ${name}`;
  const isPrivate = chat.type === 'PRIVATE';


  const navigate = useNavigate();
  const handleChatClick = () => {
    navigate(`/${id}/chat?convoId=${convoId}`);
  }

  return (
    <div onClick={handleChatClick} className='w-full flex flex-row py-2 items-center justify-between gap-2 px-2 hover:bg-hback rounded-lg'>
      {/** profilePic */}
      <div className='h-10 w-10 bg-blueB rounded-full overflow-hidden'>
        {
          img ? 
          <img src={img} alt='profile' className='h-full w-full rounded-full object-cover'/> :
          friend.user.image && isPrivate ?
          <img src={friend.user.image} alt='profile' className='h-full w-full rounded-full object-cover'/> :
          <IoPersonCircleSharp className="h-full w-full text-textB" />
        }
      </div>

      {/** name and last message */}
      <div className={clsx('flex flex-col flex-1', {
            'text-text': unread > 0,
            'text-textB': unread === 0
          })}>
        <div className='flex flex-1 flex-row items-center justify-between'>
          <h1 className='font-semibold w-46 md:w-96 truncate text-md'>{name}</h1>
          <span className='text-xs'>{date}</span>
        </div>

        <div className='flex flex-1 flex-row items-center justify-between'>
          <p className='truncate font-semibold text-xs w-48 md:w-96'><span className='text-blueD'>{sender}</span> {lstMessage}</p>
          <div className={clsx('grid items-center px-1 rounded-sm', {
            'bg-none': unread === 0,
            'bg-blueB': unread > 0
          })}>
            {
              unread === 0 ?
              <FaCheckDouble /> :
              <span className='text-xs'>{unread > 99 ? '99+' : unread}</span>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatCard;