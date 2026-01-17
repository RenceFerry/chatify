import React, { type RefObject, useContext, useState } from 'react'
import { UserContext } from '../../App';
import TopSection from '../../components/createGroup/topSection';
import FriendsList from '../../components/createGroup/friendsList';

const CreateGroup = ({tabRef}: {tabRef: RefObject<string | null>}) => {
  const { userContext } = useContext(UserContext);
  const [ query, setQuery ] = useState('');

  return (
    <div className='flex flex-col justify-between items-center w-full h-full'>
      <TopSection id={userContext!.id} tabRef={tabRef} onSearch={setQuery} />
      
      <div className="flex flex-1 flex-col w-full justify-center items-center bg-wA overflow-scroll no-scrollbar">
        <FriendsList query={query} />
      </div>
    </div>
  )
}

export default CreateGroup;