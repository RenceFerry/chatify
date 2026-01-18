import { socket } from '../../lib/socket';
import { useEffect, useRef } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import ChatPage from './chatPage';
import HomeWrapper from './homeWrapper';
import AddPeople from './addPeople';
import CreateGroup from './createGroup';

const Home = () => {
  const tab = useRef(null);
  
  useEffect(() => {
    
    socket.connect();

    return () => {
      socket.disconnect();
    }
  }, [])

  return (
    <div className='flex flex-col justify-between items-center w-full h-full bg-back relative'>
      <Outlet />

      <Routes>
        <Route path="/chat" element={<ChatPage tabRef={tab} />} />
        <Route path="/home" element={<HomeWrapper tabRef={tab} />} />
        <Route path="/createGroup" element={<CreateGroup tabRef={tab} />} />
        <Route path="/addPeople" element={<AddPeople tabRef={tab} />} />
      </Routes>
    </div>
  )
}

export default Home