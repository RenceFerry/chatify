import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL } from "../../utils/helpers";

const Verify = () => {
  const [ expiration, setExpiration ] = useState(5*60);
  const [ disabled, setDisabled ] = useState(false);
  const [ error, setError ] = useState<{ message: string }>();
  const navigate = useNavigate();

  if (expiration <= 0) {
    setDisabled(true);
  }

  //countdown
  useEffect(() => {
    if (expiration <= 0) {
      return;
    }

    const countDown = setInterval(()=>{
      setExpiration((prev) => prev - 1);
  
    }, 1000);

    return () => {
      clearInterval(countDown);
    };
  }, [expiration]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    const formData = new FormData(e.currentTarget);
    const otp = Object.fromEntries(formData.entries());

    let result;
    try {
      result = await fetch(`${BACKEND_URL}/api/auth/verify`, {
        method: 'POST',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(otp),
      });
    } catch (e) {
      console.log(e);
      return;
    }

    if (!result.ok) {
      const response = await result.json();

      setError(response);
    } else if (result.redirected) {

      navigate(result.url);
    }
  }

  const handleResendOtp = async () => {
    const response = await fetch(`${BACKEND_URL}/api/auth/resendOtp`, {
      method: 'POST',
      credentials: "include",
    });

    if (response.ok) setExpiration(5*60);
    else {
      const message = await response.json();
      setError(message);
    }
  }

  return (
    <div className='h-full relative w-full bg-back overflow-hidden flex flex-col justify-around items-center'>
      {/** background */}
      <div className="w-full flex flex-row justify-center">
        <div className="absolute bg-blueA w-[200%] rounded-[100%] h-screen z-10 bottom-[40%] -right-[20%] border-50 border-wA"></div>
      </div>

      {/** header */}
      <div className='w-full flex-1 flex flex-row justify-around items-center z-20'>
        <h1 className='text-xl text-center font-extrabold md:text-4xl text-blueD'>Verify<br/>Your email</h1>
      </div>

      {/** form */}
      <div className='flex-3 z-20 w-full flex justify-center items-start'>
        <div className='w-[60%] shadow-md shadow-blueC min-w-[300px] max-w-[600px] rounded-xl py-20 flex flex-row items-center justify-center gap-3 bg-back px-5 md:px-10'>
          <form onSubmit={handleSubmit} className='flex-1 flex flex-col justify-center items-start'>
            <div className='flex flex-col gap-2 mb-5 w-full'>
              <label htmlFor="otp" className='text-blueD text-lg font-semibold'>Enter the 6 digit code we sent to your email.</label>
              <input title='code' placeholder='6 digit code' name='otp' className='bg-none h-14 border border-text rounded-md px-3 text-blueD' />
            </div>

            <button type='submit' disabled={disabled} title='login' className='w-full bg-blueC h-14 rounded-xl flex justify-center items-center text-lg font-semibold text-blueA'>Verify</button>

            <button title="resend" type="button" onClick={handleResendOtp} className="text-blueC mt-2 underline">Resend code?</button>

            <p className="mx-auto mt-2 text-blueD">Code will expire in {!(Math.floor(expiration/60)==0)?`${Math.floor(expiration/60)}:`:''}{(expiration % 60)<10?`0${expiration % 60}`:expiration % 60}</p>

            {
              error?.message && (
                <p className='m-auto mt-2 text-error'>{error.message}</p>
              )
            }

            <p className='self-center text-textB mt-3'>Didn't recieve any emails? Try checking your spam folder.</p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Verify;