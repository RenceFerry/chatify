import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { formatMessageTime } from '../../../utils/helpers';
import { queryClient } from '../../../lib/tansStackQuery';
import { MessagesSkeleton } from '../../skeleton';

type Message = {
  senderId: string,
  createdAt: string,
  sent: boolean
}

type TextMessage = Message & {
  type: 'text',
  text: string
}

const Messages = ({convoId}: {convoId: string}) => {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const initialLoad = useRef<boolean>(true);


  const scrollToBottom = (smooth = false) => {
    bottomRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
  }

  const {data: messages, isError, isLoading} = useQuery<TextMessage[]>({
    queryKey: ['getMessages', convoId],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/getMessages`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          "Content-Type": 'application/json'
        },
        body: JSON.stringify({ convoId })
      })
      console.log(res.status)
      if (!res.ok) throw new Error();

      return res.json();
    }
  })

  
  useEffect(() => {
    const el = messagesContainerRef.current;
    if (!el) return;

    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight;

    if (isNearBottom) {
      scrollToBottom(true);
    }

  }, [messages?.length]);
  
  useEffect(() => {
    if (messages?.length === 0) return;

    if(initialLoad) {
      scrollToBottom(false);
      initialLoad.current = false;
    }

  }, [messages]);

  if (isLoading) return <MessagesSkeleton />;

  return (
    <div ref={messagesContainerRef} className='flex-1 flex flex-col bg-wA w-full items-center p-4 overflow-y-scroll overflow-x-hidden gap-3 no-scrollbar'>
      {
        isError ?
        <h1 className='text-xl text-textB'>Failed to Fetch Messages</h1> :
        !messages ?
        <h1 className='text-xl text-textB'>Start Chatting</h1> :
        messages?.map((message, index) => (
          <div key={index} className={clsx('max-w-[70%] my-1 p-2 rounded-xl flex flex-col text-sm md:text-lg', {
            'bg-blueD self-end text-back rounded-br-none': message.senderId === 'user1',
            'bg-back self-start text-text rounded-bl-none': message.senderId !== 'user1'
          })}>
            {message.text}
            <span className={clsx('text-xs mt-2',{
              'self-end text-wA': message.senderId === 'user1',
              'self-start text-textB': message.senderId !== 'user1'
            })}>
              {formatMessageTime(message.createdAt)}
            </span>
          </div>
        ))
      }

      <div ref={bottomRef} />
    </div>
  )
}

export default Messages;