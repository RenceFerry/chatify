import { IoArrowBackSharp } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { type RefObject, type SetStateAction, useEffect, useMemo, useRef } from "react";
import debounce from "debounce";

const TopSection = ({id, tabRef, onSearch}: {id: string | null, tabRef: RefObject<string | null>, onSearch: React.Dispatch<SetStateAction<string>> }) => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const debounceWr = useMemo(()=>
    debounce(onSearch, 500)
  , [onSearch]);

  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.focus();
  }, []);

  const handleBack = () => {
    navigate(`/${id}/home?tab=${tabRef.current}`)
  }

  return (
    <div className="flex flex-col h-26 py-2 w-full gap-2 px-5 shadow-[0_4px_6px_1px_rgba(0,0,0,0.01)] shadow-wA z-10">
      <div className="flex fle-row justify-between items-center flex-1">
        <button onClick={handleBack} type="button" title="back" className="h-8 w-8 hover:bg-hback rounded-full shadow-[0_2px_6px_1px_rgba(0,0,0,0.01)] shadow-wA">
          <IoArrowBackSharp className="text-2xl m-auto cursor-pointer text-text"/>
        </button>
        <h1 className="text-md font-semibold text-text">Chat With</h1>
        <div className="w-8"/>
      </div>

      <div className="flex flex-row justify-center items-center flex-1">
        <div className="flex flex-row justify-start gap-3 items-center cursor-pointer bg-blueB h-10 md:w-96 rounded-xl">
          <CiSearch className="text-textB ml-4 text-2xl" />
          <input type="text" ref={inputRef} onChange={(e)=>debounceWr(e.target.value)} title="search people" className="flex-1 mr-4 outline-none border-none text-text" placeholder="Search " />
        </div>
      </div>
    </div>
  )
}

export default TopSection;