import { useSearchParams } from "react-router-dom";
import TopTab from "../../components/topTab";
import Navbar from "../../components/navbar";
import More from "../../components/more/more";
import Profile from "../../components/profile/profile";
import EditProfileTab from '../../components/profile/editProfileTab'
import ChatsWrapper from "../../components/chats/chatsWrapper";
import GroupsWrapper from "../../components/chats/groupsWrapper";
import { useEffect, useState, type RefObject } from "react";
import { clsx } from "clsx";

const TABS_REGEX = /^(chats|groups|profile|more)$/;

const HomeWrapper = ({tabRef}: {tabRef: RefObject<string | null>}) => {
  const [ SearchParams, setSearchParams ] = useSearchParams();
  const [ editProfileIsOpen, setEditProfileIsOpen ] = useState(false);
  const [ isMediumScreen, setIsMediumScreen ] = useState(false);
  const activeTab = SearchParams.get('tab');
  
  useEffect(() => {
    const handleResize = () => {
      setIsMediumScreen(window.innerWidth > 768);
      console.log(window.innerWidth >= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (!TABS_REGEX.test(activeTab as string)) {
      setSearchParams({ tab: 'chats' }, { replace: true });
      return;
    }
  }, [ activeTab, setSearchParams ]);
  return (
    <>
      <div className={clsx('flex flex-col justify-between items-center w-full h-full', {
        'brightness-50 pointer-events-none': editProfileIsOpen && !isMediumScreen,
      })}>
        <TopTab />
        <div className='flex-1 flex flex-col items-center justify-between w-full md:flex-row-reverse md:items-start md:justify-start'>
          <div className='flex-1 flex flex-col justify-center items-center w-full md:flex-5 md:h-full md:relative bg-back'>
            <div className={clsx('flex w-full h-full bg-back',{
              'brightness-50 pointer-events-none': editProfileIsOpen && isMediumScreen,
            })}>
              {activeTab === 'chats' && <ChatsWrapper />}
              {activeTab === 'groups' && <GroupsWrapper />}
              {activeTab === 'profile' && <Profile setIsOpen={setEditProfileIsOpen} />}
              {activeTab === 'more' && <More />}
            </div>
            {(isMediumScreen && editProfileIsOpen) && <EditProfileTab setIsOpen={setEditProfileIsOpen} />}
          </div>
          <Navbar activeTab={activeTab} setSearchParams={setSearchParams} tabRef={tabRef} />
        </div>
      </div>

      {(!isMediumScreen && editProfileIsOpen) && <EditProfileTab setIsOpen={setEditProfileIsOpen} />}
    </>
  );
};

export default HomeWrapper;