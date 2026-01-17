import { useQuery } from "@tanstack/react-query";
import { UsersListSkeleton } from "../skeleton";
import { IoPersonCircleSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../App";
import { useContext } from "react";

const PeoplesList = ({query, tabRef}: {tabRef: React.RefObject<string>, query: string}) => {
  const navigate = useNavigate();
  const { userContext } = useContext(UserContext);
  console.log(userContext);
  const { data, isError, isLoading } = useQuery({
    queryKey: ['searchPeople', query],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/getPeoplesList`, {
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

  const handleClick = async ({id, username, email}: {email: string, username: string, id: string}) => {
    let convo;
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/serverActions/createConvo`, {
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
      console.log(res.ok)
      if (!res.ok) throw new Error();
      
      convo = await res.json();
    } catch (e) {
      console.log(e);
      return;
    } 

    tabRef.current = 'chats';
    navigate(`/${userContext?.id}/chat?convo=${convo.id}`);
  }

  return (
    <div className="w-[90%] max-w-[500px] flex-1 flex flex-col justify-start items-center gap-3 py-4">
      { !isError ? data.length > 0 ? (data.map(({username, image, id, email}: { username: string, id: string, image: string, email: string}) => (
        <div key={id} onClick={() => handleClick({id, username, email})} className="bg-back w-full h-14 rounded-lg md:h-16 flex flex-row items-center justify-start pl-4 gap-4 hover:bg-hback cursor-pointer">
          <div className="rounded-full h-8 md:h-10 w-8 md:w-10 bg-back overflow-hidden">
            {
              image ? 
              <img src={image} alt="profile" className='object-cover' /> :
              <IoPersonCircleSharp className="text-textB h-full w-full m-auto object-cover" />
            }
          </div>
          <h1 className='font-semibold text-md text-textB'>{username}</h1>
        </div>
      ))) :
        <h1 className="text-lg text-textB">No Match Results</h1> :
        <h1 className="text-lg text-textB">Failed to Fetch</h1>
      }
    </div>
  )
}

export default PeoplesList;