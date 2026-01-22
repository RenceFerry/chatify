import { type RefObject, useContext, useState } from 'react'
import TopSection from '../../components/addPeople/topSection';
import { UserContext } from '../../App';
import PeoplesList from '../../components/addPeople/peoplesList';

const AddPeople = ({tabRef}: {tabRef: RefObject<string | null>}) => {
  const { userContext } = useContext(UserContext);
  const [ query, setQuery ] = useState('');

  return (
    <div className='flex flex-col w-full h-full justify-between items-center'>
      <TopSection tabRef={tabRef} id={userContext!.id} onSearch={setQuery} />
      <div className="flex flex-col justify-start items-center flex-1 w-full bg-wA overflow-scroll no-scrollbar">
        <PeoplesList tabRef={tabRef} query={query} />
      </div>
    </div>
  )
}

export default AddPeople;