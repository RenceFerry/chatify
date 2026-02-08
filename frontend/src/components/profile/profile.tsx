import { BsPencilFill } from "react-icons/bs";
import { BsPencil } from "react-icons/bs";
import { MdContentCopy } from "react-icons/md";
import { TbLogout2 } from "react-icons/tb";
import { BACKEND_URL } from '../../utils/helpers';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useRef, useState } from 'react';
import { UserContext } from '../../lib/contexts';
import { IoPersonCircleSharp } from "react-icons/io5";
import imageCompression from 'browser-image-compression';
import ImageCropper from "./imageCropper";
import type { Area } from "react-easy-crop";
import { cropImage } from "../../utils/helpers";
import type {UserType} from "../../lib/types";

const Profile = ({ setIsOpen }: {setIsOpen: React.Dispatch<React.SetStateAction<boolean>>}) => {
  const navigate = useNavigate();
  const {userContext, changeUser} = useContext(UserContext);
  const fileInputRef =  useRef<HTMLInputElement>(null);
  const fileRef = useRef<File | null>(null);
  const [ imgUrl, setImgUrl ] =  useState<string>('');
  const formDataRef = useRef<FormData | null>(null);
  const [ showCropper, setShowCropper ] = useState<boolean>(false);
  const [ croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

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

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      console.log(e);
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    fileRef.current = e.target.files?.[0] || null;
    if (!fileRef.current || !fileRef.current.type.startsWith('image/')) return;
    const options = {
      maxSizeMB: 5,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    };

    const compressedFile = await imageCompression(fileRef.current, options);

    formDataRef.current = new FormData();
    formDataRef.current.append('image', compressedFile);

    const reader = new FileReader();
    reader.onload = (e) => {
      setImgUrl(e.target?.result as string);
      setShowCropper(true);
    }

    reader.readAsDataURL(compressedFile);
  };

  const save = async () => {
    if (!croppedAreaPixels || !formDataRef.current) return;

    const croppedImage = await cropImage(fileRef.current as File, croppedAreaPixels);

    formDataRef.current.set('image', croppedImage);

    const reader = new FileReader();
    reader.onload = (e) => {
      setImgUrl(e.target?.result as string);
      setShowCropper(false);
    }
    
    reader.readAsDataURL(croppedImage);

    try {
      const res = await fetch(`${BACKEND_URL}/api/serverActions/updateImage`, {
        method: 'POST',
        credentials: 'include',
        body: formDataRef.current
      });

      if (!res.ok) alert('Failed to upload image');

      const newImageUrl = await res.json();
      changeUser((prev: UserType | null) => prev ? {...prev, image: newImageUrl.image} : null);
    } catch (e) {
      console.log(e);
    }
  }

  const profileLink = `${window.location.origin}/profile?id=${userContext?.id}`;

  return (
    <div className='flex-1 flex flex-col justify-center items-center w-full h-full relative'>
      {
        showCropper &&
        <ImageCropper setCroppedAreaPixels={setCroppedAreaPixels} imgUrl={imgUrl} save={save} /> 
      }
      {/** Profile Picture/ name */}
      <div className="flex flex-col justify-center items-center flex-1 w-full gap-2">
        <div className="h-36 w-36 relative rounded-full">
          <div className="rounded-full h-full w-full overflow-hidden">
            {
              imgUrl ?
              <img src={imgUrl} alt="Profile pic" className='object-cover' /> :
              userContext?.image ? 
              <img src={userContext?.image} alt="Profile pic" className='object-cover' /> :
              <IoPersonCircleSharp className='w-full h-full text-textB' />
            }
          </div>

          <input type="file" hidden accept="image/*" ref={fileInputRef} onChange={handleFileChange} />

          <button onClick={() => fileInputRef.current?.click()} type='button' title='Change profile Pic' className='absolute top-0 right-0 h-10 w-10 bg-blueC rounded-full hover:bg-hblueC'>
            <BsPencilFill size={20} className='text-wA mx-auto'/>
          </button>
        </div>

        <h1 className='font-bold text-lg text-text md:text-2xl'>{userContext?.username}</h1>
      </div>

      {/** Profile details */}
      <div className="flex flex-1 flex-col w-[80%] items-center justify-start gap-2 text-sm text-text md:text-lg">
        <div className="flex flex-row justify-between items-center w-full gap-2">
          <h5 className='whitespace-pre truncate'><span className='text-textB'>Profile Link : </span><Link to={profileLink}>{profileLink}</Link></h5>

          <button onClick={() => copyToClipboard(profileLink)} type='button' title='copy' className='text-textB hover:bg-hback rounded-full p-2'><MdContentCopy /></button>
        </div>

        <div className="flex flex-row justify-between items-center w-full gap-2">
          <h5 className='whitespace-pre truncate'><span className='text-textB'>Email :</span>  {userContext?.email}</h5>

          <button onClick={() => copyToClipboard(userContext?.email || '')} type='button' title='copy' className='text-textB hover:bg-hback rounded-full p-2'><MdContentCopy /></button>
        </div>

        <div className="flex flex-row justify-between items-center w-full gap-2">
          <h5 className='whitespace-pre'><span className='text-wrap'><span className='text-textB'>Bio :</span><br />{userContext?.bio}</span></h5>

          <button onClick={() => copyToClipboard(userContext?.bio || '')} type='button' title='copy' className='text-textB hover:bg-hback rounded-full p-2'><MdContentCopy /></button>
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