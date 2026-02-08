import { IoArrowBackSharp } from "react-icons/io5";
import { UserContext } from '../lib/contexts';
import { useContext } from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BACKEND_URL } from "../utils/helpers";
import { ProfilePageSkeleton } from "../components/skeleton";
import { IoPersonCircleSharp } from "react-icons/io5";

const ProfilePage = () => {
  const { userContext } = useContext(UserContext);
  const navigate = useNavigate();
  const [ searchParams, ] = useSearchParams();
  const id = searchParams.get('id');

  const { data: profileData, isError, isLoading } = useQuery({
    queryKey: ['getProfile', id],
    queryFn: async () => {
      if (userContext && userContext.id === id) {
        return userContext;
      }

      try {
        const response = await fetch(`${BACKEND_URL}/api/getProfile`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id })
        });
        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }
        return response.json();
      } catch (error) {
        console.error("Error fetching profile data:", error);
        throw error;
      }
    }
  });

  const handleBack = () => {
    if (userContext) {
      navigate(`${window.location.origin}/${userContext.id}/home?tab=profile`);
    } else {
      navigate(`${window.location.origin}/auth/login`);
    }
  };

  const handleMessage = () => {
    navigate(`${window.location.origin}/${userContext?.id}/chat?convoId=${profileData.id}`);
  }

  if (isLoading) {
    return <ProfilePageSkeleton />;
  }

  return (
    <div className='w-full h-full bg-back flex flex-col  justify-between items-center'>
      {/** Top menu */}
      <div className="flex w-full p-5 flex-row justify-between items-center">
        <button type="button" onClick={handleBack} title="back" className="h-8 w-8 hover:bg-hback rounded-full shadow-[0_2px_6px_1px_rgba(0,0,0,0.01)] shadow-wA flex items-center">
          <IoArrowBackSharp className="text-2xl m-auto cursor-pointer text-text"/>
        </button>
        <h1 className="text-xl font-semibold text-text">Profile</h1>
        <div className="h-8 w-8"></div>
      </div>

      {/** Profile component */}

      {
        isError ? 
        <div className="flex-1 flex flex-col py-10 justify-start items-center w-full">
          <h1 className="text-textB text-md md:text-2xl">Failed to fetch Profile</h1> 
        </div> :
        <div className="flex-1 w-full flex flex-col justify-start py-10 gap-6 items-center">
          <div className="flex flex-col gap-5 items-center">
            <div className="overflow-hidden w-52 h-52 bg-wA rounded-full">
              {
                !profileData.image ? 
                <IoPersonCircleSharp className="h-full w-full text-textB" /> :
                <img src={profileData.image} alt="profile pic" className="object-cover" />
              }
            </div>

            <h1 className="text-xl md:text-2xl font-semibold text-text">{profileData.username}</h1>
          </div>

          <div className="border-textB text-textB p-3 border-2 rounded-2xl max-w-84">
            {profileData.bio}
          </div>

          <button type='button' onClick={handleMessage} className='w-full max-w-52 flex justify-center items-center gap-3 rounded-lg bg-blueC h-12 hover:bg-hblueC text-wA mt-3'>
            Message
          </button>
        </div>
      }
    </div>
  )
}

export default ProfilePage;