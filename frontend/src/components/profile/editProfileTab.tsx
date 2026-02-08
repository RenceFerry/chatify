import { useCallback, useEffect, useContext, useRef, useState } from "react";
import { BACKEND_URL, onChange } from "../../utils/helpers";
import { EditProfileSchema, OtpSchema } from "../../utils/schema";
import z from 'zod';
import { UserContext } from "../../lib/contexts";
import { useNavigate } from "react-router-dom";

const MAX_TEXTAREA_HEIGHT = 150; // Maximum height in pixels
const MAX_BIO_LENGTH = 150;

type Error = { errors: string[]; properties?: { username?: { errors: string[]; } | undefined; email?: { errors: string[]; } | undefined; otp?: { errors: string[]; } | undefined; } | undefined; message?: string };

const EditProfileTab = ({setIsOpen}: { setIsOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const {userContext, changeUser} = useContext(UserContext);
  const [ characterCount, setCharacterCount ] = useState(0);
  const [ error, setError ] = useState<Error>();
  const [ showVerify, setShowVerify ] = useState(false);
  const [ timer, setTimer ] = useState(5*60);
  const [ disabled, setDisabled ] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const inputOtpRef =  useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  const startTimer = useCallback(() => {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      })
    }, 1000)
  }, [])

  if (timer <= 0) setDisabled(true);

  const onTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e, MAX_TEXTAREA_HEIGHT);
    const textarea = e.currentTarget;

    if (textarea.value.length > MAX_BIO_LENGTH) {
      textarea.value = textarea.value.slice(0, MAX_BIO_LENGTH);
    }

    setCharacterCount(textarea.value.length);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formdata = new FormData(form);
    const data = Object.fromEntries(formdata.entries());

    const validatedData = EditProfileSchema.safeParse(data);

    if (!validatedData.success) {
      return setError(z.treeifyError(validatedData.error));
    }

    setError(undefined);

    try {
      const res = await fetch(`${BACKEND_URL}/api/serverActions/editProfile`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (res.ok) {
        setShowVerify(true);
        startTimer();
        inputOtpRef.current?.focus();
      }
    } catch (e) {
      console.log(e);
    }
  }

  const verifyEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formdata = new FormData(form);
    const data = Object.fromEntries(formdata.entries());

    const validOtp = OtpSchema.safeParse(data);

    if (!validOtp.success) return setError(z.treeifyError(validOtp.error))

    try {
      const res = await fetch(`${BACKEND_URL}/api/serverActions/verify`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const dataRes = await res.json();
      if (!res.ok) setError(dataRes)

      changeUser(dataRes);
      navigate(`${userContext?.id}/home`);
      
    } catch(e) {
      console.log(e);
    }
  }

  const resend = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/serverActions/resendOtp`, {
        method: 'POST',
        credentials: 'include'
      })

      const dataRes = await response.json();
      setError(dataRes);

    } catch (e) {
      console.log(e);
    }
  } 

  const cancel = () => {
    setShowVerify(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsOpen(false);
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [])

  return (
    <div className="absolute bottom-0 right-0 w-full flex flex-col justify-center items-center bg-back rounded-tl-xl rounded-tr-xl gap-5 h-[75%]">
      { !showVerify ?
        <div className="w-full h-full flex flex-col py-5 gap-5 items-center justify-center">
          <h1 className="text-text font-bold text-xl">Edit Profile</h1>
          <form onSubmit={handleSubmit} className="w-[85%] max-w-96 flex flex-col justify-center items-center gap-2 border-2 border-blueC rounded-lg p-4">
            <div className="flex w-full flex-col justify-center gap-1 items-start">
              <label htmlFor="name" className="text-textB">Name</label>
              <input type="text" id="name" name="username" className="w-full h-12 rounded-lg bg-back border border-textC px-3 text-text outline-none"/>

              { error?.properties?.username?.errors[0] &&
                <p className="text-error text-md">{error?.properties?.username?.errors[0]}</p>
              }
            </div>
            
            <div className="flex w-full flex-col justify-center gap-1 items-start">
              <label htmlFor="email" className="text-textB">Email</label>
              <input type="text" id="email" name="email" className="w-full h-12 rounded-lg bg-back border border-textC px-3 text-text outline-none"/>

              { error?.properties?.email?.errors[0] &&
                <p className="text-error text-md">{error?.properties?.email?.errors[0]}</p>
              }
            </div>

            <div className="flex w-full flex-col justify-center gap-1 items-start">
              <label htmlFor="bio" className="text-textB">Bio</label>
              <textarea onChange={onTextareaChange} id="bio" name="bio" className="no-scrollbar w-full h-10 rounded-lg bg-back border border-textC px-3 text-text outline-none resize-none"/>

              <span className="text-textB text-sm">{characterCount}/{MAX_BIO_LENGTH}</span>
            </div>

            { error?.errors[0] &&
              <p className="text-error text-md self-center">{error.errors[0]}</p>
            }


            <div className="w-full flex flex-row jusitify-center items-center gap-3 mt-6">
              <button type="button" onClick={() => setIsOpen(false)} className="flex-1 bg-blueA rounded-full h-12 text-blueD hover:bg-hblueA font-semibold text-lg">Cancel</button>

              <button type="submit" className="flex-1 bg-blueC rounded-full h-12 text-blueA hover:bg-hblueC font-semibold text-lg">Save</button>
            </div>
          </form>
        </div> :
        <div className="w-full h-full flex flex-col py-5 gap-5 items-center justify-center">
          <h1 className="text-text font-bold text-xl">Verify your Email</h1>
          <form onSubmit={verifyEmail} className="w-[85%] max-w-96 flex flex-col justify-center items-center gap-2 border-2 border-blueC rounded-lg p-4">
            <div className="flex w-full flex-col justify-center gap-1 items-start">
              <label htmlFor="otp" className="text-textB">Otp</label>
              <input type="number" ref={inputOtpRef} id="otp" name="otp" className="w-full h-12 rounded-lg bg-back border border-textC px-3 text-text outline-none"/>

              { error?.errors?.[0] ?
                <p className="text-error text-md">{error.errors[0]}</p> :
                error?.properties?.otp ? 
                <p className="text-error text-md">{error.properties.otp.errors[0]}</p> : ''
              }
            </div>
            <p className="mt-4 text-textB text-md text-center">Didn't recieve any emails? Try checking your spam folder.</p>

            <p className="mt-4 text-blueC text-md text-center">{!(Math.floor(timer/60)==0)?`${Math.floor(timer/60)}:`:''}{(timer % 60)<10?`0${timer % 60}`:timer % 60}</p>

            { error?.message && 
              <p className="text-blueD text-md self-center">{error.message}</p>
            }

            <div className="w-full flex flex-row jusitify-center items-center gap-3 mt-6">
              <button type="button" onClick={cancel} className="flex-1 bg-blueA rounded-full h-12 text-blueD hover:bg-hblueA font-semibold text-lg">Cancel</button>

              <button disabled={disabled} type="submit" className="flex-1 bg-blueC rounded-full h-12 text-blueA hover:bg-hblueC font-semibold text-lg">Verify</button>

            </div>
            <button type="button" onClick={resend} className="text-md text-blueC mt-3 underline">Resend Otp?</button>
          </form>
        </div>
      }
    </div>
  )
}

export default EditProfileTab;