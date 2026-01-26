
import logo from '../../assets/logo.png';
import { BsPencilFill } from "react-icons/bs";
import { BsPencil } from "react-icons/bs";
import { MdContentCopy } from "react-icons/md";
import { TbLogout2 } from "react-icons/tb";
import { BACKEND_URL } from '../../utils/helpers';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../App';
import { IoPersonCircleSharp } from "react-icons/io5";

const Profile = ({ setIsOpen }: {setIsOpen: React.Dispatch<React.SetStateAction<boolean>>}) => {
  const navigate = useNavigate();
  const {userContext} = useContext(UserContext);

  const data = {
    profilePic: logo,
    name: 'John Doe',
    email: 'john.lennon@gmail.com',
    profileLink: 'www.chatify.com/ddddddddddddddddddddddjohndoe',
    bio: 'hellohssl shang mga bata ay naglalaro nang buong maghapon dhfsl hay naku!'
  };

  const handleLogout = async () => {
    try {
      await fetch(`${BACKEND_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })

      navigate('/auth/login');
    }catch (e) {
      console.log(e);
    }
  }

  return (
    <div className='flex-1 flex flex-col justify-center items-center w-full h-full'>
      {/** Profile Picture/ name */}
      <div className="flex flex-col justify-center items-center flex-1 w-full gap-2">
        <div className="h-36 w-36 relative rounded-full">
          <div className="rounded-full h-full w-full overflow-hidden">
            {
              userContext?.image ? 
              <img src={data.profilePic} alt="Profile pic" className='object-cover' /> :
              <IoPersonCircleSharp className='w-full h-full text-textB' />
            }
          </div>
          <button type='button' title='Change profile Pic' className='absolute top-0 right-0 h-10 w-10 bg-blueC rounded-full hover:bg-hblueC'>
            <BsPencilFill size={20} className='text-wA mx-auto'/>
          </button>
        </div>

        <h1 className='font-bold text-lg text-text md:text-2xl'>{userContext?.username}</h1>
      </div>

      {/** Profile details */}
      <div className="flex flex-1 flex-col w-[80%] items-center justify-start gap-2 text-sm text-text md:text-lg">
        <div className="flex flex-row justify-between items-center w-full gap-2">
          <h5 className='whitespace-pre truncate'><span className='text-textB'>Profile Link :</span>  {data.profileLink}</h5>

          <button type='button' title='copy' className='text-textB hover:bg-hback rounded-full p-2'><MdContentCopy /></button>
        </div>

        <div className="flex flex-row justify-between items-center w-full gap-2">
          <h5 className='whitespace-pre truncate'><span className='text-textB'>Email :</span>  {userContext?.email}</h5>

          <button type='button' title='copy' className='text-textB hover:bg-hback rounded-full p-2'><MdContentCopy /></button>
        </div>

        <div className="flex flex-row justify-between items-center w-full gap-2">
          <h5 className='whitespace-pre'><span className='text-wrap'><span className='text-textB'>Bio :</span><br />{userContext?.bio}</span></h5>

          <button type='button' title='copy' className='text-textB hover:bg-hback rounded-full p-2'><MdContentCopy /></button>
        </div>

        <button type='button' onClick={()=>setIsOpen(true)} title='Edit profile' className='w-full flex flex-row justify-center items-center gap-3 rounded-lg bg-blueC h-12 hover:bg-hblueC text-wA mt-3'>
          <BsPencil size={20}/>
          <span>Edit Profile</span>
        </button>

        <button type='button' onClick={handleLogout} title='Edit profile' className='w-full flex justify-center items-center gap-3 rounded-lg bg-wA h-12 hover:bg-hwA text-textB mt-3'>
          <TbLogout2 size={20}/>
          <span>Logout</span>
        </button>
      </div>

    </div>
  )
}

export default Profile;