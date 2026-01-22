import { BsFillSendFill } from "react-icons/bs";
import { useRef, useEffect, type RefObject } from "react";
import { onChange } from "../../../utils/helpers";

const MAX_TEXTAREA_HEIGHT = 150; // Maximum height in pixels

const InputBottom = ({onSend, textareaRef}: {textareaRef: RefObject<HTMLTextAreaElement | null>, onSend: () => void}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, [textareaRef])

  return (
    <div ref={containerRef} className='flex bg-back py-2 md:py-4 w-full flex-row justify-center items-center gap-2'>
      <textarea ref={textareaRef} onChange={(e) => onChange(e, MAX_TEXTAREA_HEIGHT)} title="type a message" placeholder="Type your message..." className="textarea outline-none bg-wA text-text rounded-2xl w-[70%] h-10 md:h-12 px-3 pt-3 pb-1 resize-none" />

      <button onClick={onSend} title='attachments' type='button' className='w-8 md:w-10 h-8 md:h-10 rounded-full bg-blueC hover:bg-blueC'>
        <BsFillSendFill className="text-lg md:text-xl m-auto cursor-pointer text-wA"/>
      </button>
    </div>
  )
}

export default InputBottom;