import { useQuery } from '@tanstack/react-query'
import { UsersListSkeleton } from '../../components/skeleton';
import { IoPersonCircleSharp } from "react-icons/io5";
import { type RefObject, useContext } from 'react';
import { UserContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL } from "../../utils/helpers";

const FriendsList = ({query, tabRef}: {tabRef: RefObject<string | null>, query: string}) => {
  const {userContext} = useContext(UserContext);
  const navigate = useNavigate();
  const { data, isError, isLoading } = useQuery({
    queryKey: ['getFriends', query],
    queryFn: async () => {
      const res = await fetch(`${BACKEND_URL}/api/getConvosList`, {
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

  const handleClick = async ({id, username, email}: {email: string, username: string, id: string}) => {
    let group;
    try {
      const res = await fetch(`${BACKEND_URL}/api/serverActions/createGroup`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user: userContext,
          toFriend: {id, username, email}
        })
      })
      if (!res.ok) throw new Error();
      
      group = await res.json();
    } catch (e) {
      console.log(e);
      return;
    } 

    tabRef.current = 'groups';
    return navigate(`/${userContext?.id}/chat?convoId=${group.id}`);
  }

  if (isLoading) return <UsersListSkeleton />;

  return (
    <div className="w-[90%] max-w-[500px] flex-1 flex flex-col justify-start items-center gap-3 py-4">
      { !isError ? data.length > 0 ? (data.map(({username, image, id, email}: { username: string, id: string, image: string, email: string}) => (
        <div key={id} onClick={()=>handleClick({username, email, id})} className="bg-back w-full h-14 rounded-lg md:h-16 flex flex-row items-center justify-start pl-4 gap-4">
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