import logo from '../assets/logo.png';
import { CiSearch } from "react-icons/ci";
import { GoPlus } from "react-icons/go";

const TopTab = () => {
  return (
    <div className="w-full flex flex-row items-center justify-between h-12 bg-blueE md:h-16">
      <div className="flex flex-row ml-4 gap-2 justify-center items-center h-[60%]">
        <img className='h-full' src={logo} alt="logo" />
        <h1 className='font-extrabold text-white'>Chatify</h1>
      </div>

      <div className="flex flex-row mr-4 gap-2 justify-center items-center h-[60%]">
        <button title='search' className='bg-blueE h-full p-1 rounded-md hover:bg-hblueE' type='button'>
          <CiSearch size={24} color='white' />
        </button>

        <button title='add/create' type='button' className='bg-blueE h-full p-1 rounded-md hover:bg-hblueE'>
          <GoPlus size={24} color='white' />
        </button>
      </div>
    </div>
  )
}

export default TopTab;