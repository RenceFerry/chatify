import logo from '../assets/logo.png';
import { CiSearch } from "react-icons/ci";
import { GoPlus } from "react-icons/go";
import { useState, useContext, useMemo, useCallback } from 'react';
import clsx from 'clsx';
import { Link, useSearchParams } from 'react-router-dom';
import { UserContext } from '../App';
import debounce from 'debounce';

const TopTab = ({onSearch}: { onSearch: (tab: string, value: string) => void }) => {
  const [ showAddCreate, setShowAddCreate ] = useState(false);
  const [ showSearch, setShowSearch ] = useState(false);
  const { userContext } = useContext(UserContext);
  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab');

  const onChange = useCallback((value: string) => {
    onSearch(tab!, value);
  },[onSearch, tab])

  const debounceWr = useMemo(()=>
    debounce(onChange, 500),
    [onChange]
  )

  return (
    <div className="w-full flex flex-row items-center justify-between h-12 bg-blueE md:h-16 relative">
      <div className="flex flex-row ml-4 gap-2 justify-center items-center h-[60%]">
        <img className='h-full' src={logo} alt="logo" />
        <h1 className={clsx('font-extrabold text-white md:block', {
          'hidden': showSearch
        })}>Chatify</h1>
      </div>


      <div className="flex flex-row mr-4 gap-2 justify-center items-center h-[60%]">
        {showSearch && 
          <input type="text" onChange={(e)=>debounceWr(e.target.value)} title='search' className='border-none outline-none rounded-lg bg-blueC h-full p-3 text-back' placeholder='Search chats....' />
        }

        <button title='search' className='bg-blueE h-full p-1 rounded-md hover:bg-hblueE' onClick={() => setShowSearch(!showSearch)} type='button'>
          {showSearch ? <GoPlus size={24} color='white' className='rotate-45' /> :
            <CiSearch size={24} color='white' />
          }
        </button>

        <button onClick={() => setShowAddCreate(!showAddCreate)} title='add/create' type='button' className='bg-blueE h-full p-1 rounded-md hover:bg-hblueE'>
          <GoPlus size={24} color='white' className={clsx('transition-all duration-75',{
          'rotate-45': showAddCreate
        })} />
        </button>
      </div>

      {/** options */}
      {
        showAddCreate && (
          <div className="flex flex-col w-56 bg-wA justify-center items-center gap-2 py-2 rounded-lg absolute h-26 top-14 md:top-18 z-10 right-4">
            <Link className='flex justify-start px-4 items-center w-[80%] flex-1 text-text hover:bg-blueC hover:text-wA rounded-lg' title='add people' to={`/${userContext!.id}/addPeople`}>Add People</Link>
            <Link title='create group' to={`/${userContext!.id}/createGroup`} className='flex justify-start px-4 items-center w-[80%] flex-1 text-text hover:bg-blueC hover:text-wA rounded-lg'>Create Group</Link>
          </div>
        )
      }
    </div>
  )
}

export default TopTab;