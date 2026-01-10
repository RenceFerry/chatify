import { useEffect, useState, useRef } from 'react';
import clsx from 'clsx';
import { formatMessageTime } from '../../../utils/helpers';

type Message = {
  senderId: string,
  createdAt: string,
  sent: boolean
}

type TextMessage = Message & {
  type: 'text',
  text: string
}

const Messages = () => {
  const [ messages, setMessages ] = useState<TextMessage[]>([]);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const initialLoad = useRef<boolean>(true);

  const scrollToBottom = (smooth = false) => {
    bottomRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
  }

  useEffect(() => {
    setTimeout(() => {
      setMessages([
        {
          senderId: 'user1',
          createdAt: "2026-01-03T05:12:41.923Z",
          sent: true,
          type: 'text',
          text: 'Hello, how are you?'
        },
        {
          senderId: 'user2',
          createdAt: "2026-01-03T05:12:41.923Z",
          sent: true,
          type: 'text',
          text: 'Hello, how are you?'
        },
        {
          senderId: 'user1',
          createdAt: "2026-01-03T05:12:41.923Z",
          sent: true,
          type: 'text',
          text: 'Hello, how are you?'
        },
        {
          senderId: 'user2',
          createdAt: "2026-01-03T05:12:41.923Z",
          sent: true,
          type: 'text',
          text: 'Hello, how are youdsfshs hapfang mga bata ay naglalaro nang buong maghapon at sila ay nagkakasakit ahahahahahh? how are youdsfshs hapfang mga bata ay naglalaro nang buong maghapon at sila ay nagkakasakit ahahahahahh?'
        },
        {
          senderId: 'user1',
          createdAt: "2026-01-03T05:12:41.923Z",
          sent: true,
          type: 'text',
          text: 'Hello, how are youdsfshs hapfang mga bata ay naglalaro nang buong maghapon at sila ay nagkakasakit ahahahahahh? how are youdsfshs hapfang mga bata ay naglalaro nang buong maghapon at sila ay nagkakasakit ahahahahahh?'
        },
        {
          senderId: 'user2',
          createdAt: "2026-01-03T05:12:41.923Z",
          sent: true,
          type: 'text',
          text: 'Hello, how are you?'
        },
        {
          senderId: 'user1',
          createdAt: "2026-01-03T05:12:41.923Z",
          sent: true,
          type: 'text',
          text: 'Hello, how are you?'
        },
        {
          senderId: 'user2',
          createdAt: "2026-01-03T05:12:41.923Z",
          sent: true,
          type: 'text',
          text: 'Hello, how are you?'
        },
        {
          senderId: 'user1',
          createdAt: "2026-01-03T05:12:41.923Z",
          sent: true,
          type: 'text',
          text: 'Hello, how are you?'
        },
        {
          senderId: 'user2',
          createdAt: "2026-01-03T05:12:41.923Z",
          sent: true,
          type: 'text',
          text: 'Hello, how are youdsfshs hapfang mga bata ay naglalaro nang buong maghapon at sila ay nagkakasakit ahahahahahh? how are youdsfshs hapfang mga bata ay naglalaro nang buong maghapon at sila ay nagkakasakit ahahahahahh?'
        },
        {
          senderId: 'user1',
          createdAt: "2026-01-03T05:12:41.923Z",
          sent: true,
          type: 'text',
          text: 'Hello, how are youdsfshs hapfang mga bata ay naglalaro nang buong maghapon at sila ay nagkakasakit ahahahahahh? how are youdsfshs hapfang mga bata ay naglalaro nang buong maghapon at sila ay nagkakasakit ahahahahahh?'
        },
        {
          senderId: 'user2',
          createdAt: "2026-01-03T05:12:41.923Z",
          sent: true,
          type: 'text',
          text: 'Hello, how are you?'
        },
        {
          senderId: 'user1',
          createdAt: "2026-01-03T05:12:41.923Z",
          sent: true,
          type: 'text',
          text: 'Hello, how are you?'
        },
        {
          senderId: 'user2',
          createdAt: "2026-01-03T05:12:41.923Z",
          sent: true,
          type: 'text',
          text: 'Hello, how are you?'
        },
        {
          senderId: 'user1',
          createdAt: "2026-01-03T05:12:41.923Z",
          sent: true,
          type: 'text',
          text: 'Hello, how are you?'
        },
        {
          senderId: 'user2',
          createdAt: "2026-01-03T05:12:41.923Z",
          sent: true,
          type: 'text',
          text: 'Hello, how are youdsfshs hapfang mga bata ay naglalaro nang buong maghapon at sila ay nagkakasakit ahahahahahh? how are youdsfshs hapfang mga bata ay naglalaro nang buong maghapon at sila ay nagkakasakit ahahahahahh?'
        },
        {
          senderId: 'user1',
          createdAt: "2026-01-03T05:12:41.923Z",
          sent: true,
          type: 'text',
          text: 'Hello, how are youdsfshs hapfang mga bata ay naglalaro nang buong maghapon at sila ay nagkakasakit ahahahahahh? how are youdsfshs hapfang mga bata ay naglalaro nang buong maghapon at sila ay nagkakasakit ahahahahahh?'
        },
        {
          senderId: 'user2',
          createdAt: "2026-01-03T05:12:41.923Z",
          sent: true,
          type: 'text',
          text: 'Hello, how are you?'
        },
        {
          senderId: 'user1',
          createdAt: "2026-01-03T05:12:41.923Z",
          sent: true,
          type: 'text',
          text: 'Hello, how are you?'
        },
        {
          senderId: 'user2',
          createdAt: "2026-01-03T05:12:41.923Z",
          sent: true,
          type: 'text',
          text: 'Hello, how are you?'
        },
        {
          senderId: 'user1',
          createdAt: "2026-01-03T05:12:41.923Z",
          sent: true,
          type: 'text',
          text: 'Hello, how are you?'
        },
        {
          senderId: 'user2',
          createdAt: "2026-01-03T05:12:41.923Z",
          sent: true,
          type: 'text',
          text: 'Hello, how are youdsfshs hapfang mga bata ay naglalaro nang buong maghapon at sila ay nagkakasakit ahahahahahh? how are youdsfshs hapfang mga bata ay naglalaro nang buong maghapon at sila ay nagkakasakit ahahahahahh?'
        },
        {
          senderId: 'user1',
          createdAt: "2026-01-03T05:12:41.923Z",
          sent: true,
          type: 'text',
          text: 'Hello, how are youdsfshs hapfang mga bata ay naglalaro nang buong maghapon at sila ay nagkakasakit ahahahahahh? how are youdsfshs hapfang mga bata ay naglalaro nang buong maghapon at sila ay nagkakasakit ahahahahahh?'
        },
        {
          senderId: 'user2',
          createdAt: "2026-01-03T05:12:41.923Z",
          sent: true,
          type: 'text',
          text: 'Hello, how are you?'
        },
      ])
    }, 1000);

  }, []);

  useEffect(() => {
    const el = messagesContainerRef.current;
    if (!el) return;

    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight;

    if (isNearBottom) {
      scrollToBottom(true);
    }

  }, [messages.length]);
  
  useEffect(() => {
    if (messages.length === 0) return;

    if(initialLoad) {
      scrollToBottom(false);
      initialLoad.current = false;
    }

  }, [messages]);

  return (
    <div ref={messagesContainerRef} className='flex-1 flex flex-col bg-wA w-full items-center p-4 overflow-y-scroll overflow-x-hidden gap-3 no-scrollbar'>
      {messages.map((message, index) => (
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
      ))}

      <div ref={bottomRef} />
    </div>
  )
}

export default Messages;