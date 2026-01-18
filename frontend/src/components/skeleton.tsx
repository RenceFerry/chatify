import clsx from "clsx"

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
          {Array.from({length: (index+1)*2}).map(() => (
            <div className={clsx('bg-wA h-4 rounded-full w-11/12 m-2',{
              'self-end text-wA': index%2===0,
              'self-start text-textB': index%2!==0
            })} />
          ))}
        </div>
      ))}
    </div>
  )
}