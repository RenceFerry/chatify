import { useQuery } from '@tanstack/react-query'
import { UsersListSkeleton } from '../../components/skeleton';
import { IoPersonCircleSharp } from "react-icons/io5";

const FriendsList = ({query}: {query: string}) => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ['getFriends', query],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/getConvosList`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ search: query ? query : '*'})
      })
      if (!res.ok) throw new Error('Failed');
      return res.json();
    }
  })

  if (isLoading) return <UsersListSkeleton />;

  return (
    <div className="w-[90%] max-w-[500px] flex-1 flex flex-col justify-start py-4 items-center gap-3 overflow-hidden">
      { !isError ? data.length > 0 ? (data.map(({username, image, id}: { username: string, id: string, image: string}) => (
        <div key={id} className="bg-back w-full h-14 rounded-lg md:h-16 flex flex-row items-center justify-start pl-4 gap-4">
          <div className="rounded-full h-8 md:h-10 w-8 md:w-10 bg-back overflow-hidden">
            {
              !image ? 
              <IoPersonCircleSharp className='text-textB h-full w-full' /> :
              <img src={image} alt="profile" className='object-cover' />
            }
          </div>
          <h1 className='font-semibold text-md text-textB'>{username}</h1>
        </div>
      ))) :
        <h1 className="text-lg text-textB">No Match Results or No Conversation with anyone</h1> :
        <h1 className="text-lg text-textB">Failed to Fetch</h1>
      }
    </div>
  )
}

export default FriendsList;