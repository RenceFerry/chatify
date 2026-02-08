import { FiMoon } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import ToggleButton from "../toggleButton";
import { useContext } from "react";
import { ThemeContext } from "../../lib/contexts";

const More = () => {
  const { theme, changeTheme } = useContext(ThemeContext)!;
  const on = theme === "dark" ? true : false;

  return (
    <div className='flex-1 flex w-full h-full flex-col justify-between p-4 items-center'>
      <div className="flex flex-col gap-2 w-full text-sm md:text-lg md:w-[80%] mt-6">
        <div className='flex flex-row justify-between h-6 w-full items-center '>
          <div className='flex flex-row gap-2 items-center'>
            <FiMoon size={18} className='text-textB'/>
            <span className='text-textB font-semibold'>Dark Mode</span>
          </div>
          <ToggleButton on={on} cb={changeTheme} />
        </div>
      </div>


      {/** delete account */}
      <button type='button' title='Delete account' className='w-full flex justify-center items-center gap-3 rounded-lg bg-bgError h-12 hover:bg-hbgError text-error mt-3 font-semibold text-sm max-w-96'>
        <MdDeleteOutline size={20}/>
        <span className="text-sm md:text-lg">DELETE ACCOUNT</span>
      </button>
    </div>
  )
}

export default More;