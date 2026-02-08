import { useContext, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { formatMessageTime } from '../../../utils/helpers';
import { UserContext } from '../../../lib/contexts';

type Message = {
  id: string;
  createdAt: string;
  content: string;
  senderId: string;
  conversationId: string;
}

const Messages = ({isError, messages}: {isError: boolean, messages: Message[] | undefined}) => {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const initialLoad = useRef<boolean>(true);
  const {userContext} = useContext(UserContext);

  const scrollToBottom = (smooth = false) => {
    bottomRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
  }
  
  useEffect(() => {
    const el = messagesContainerRef.current;
    if (!el) return;

    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;

    if (isNearBottom) {
      scrollToBottom(true);
    }

  }, [messages?.length]);
  
  useEffect(() => {
    if(initialLoad) {
      scrollToBottom(false);
      initialLoad.current = false;
    }

  }, []);

  return (
    <div ref={messagesContainerRef} className='flex-1 flex flex-col bg-wA w-full items-center p-4 overflow-y-scroll overflow-x-hidden gap-3 no-scrollbar'>
      {
        isError ?
        <h1 className='text-xl text-textB'>Failed to Fetch Messages</h1> :
        !messages || messages.length === 0 ?
        <h1 className='text-xl text-textB'>Start Chatting</h1> :
        messages?.map((message) => (
          <div key={message.id} className={clsx('max-w-[70%] my-1 p-2 rounded-xl flex flex-col text-sm md:text-lg relative overflow-visible', {
            'bg-blueD self-end text-back rounded-br-none': message.senderId === userContext?.id,
            'bg-back self-start text-text rounded-bl-none': message.senderId !== userContext?.id
          })}>
            {message.content}
            <span className={clsx('text-xs mt-2',{
              'self-end text-wA': message.senderId === userContext?.id,
              'self-start text-textB': message.senderId !== userContext?.id
            })}>
              {
                message.createdAt === 'sending...'?
                'sending...':
                formatMessageTime(message.createdAt)
              }
            </span>
          </div>
        ))
      }

      <div ref={bottomRef} />
    </div>
  )
}

export default Messages;