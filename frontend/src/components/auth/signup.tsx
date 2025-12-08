import { FaGoogle } from "react-icons/fa";
import { useState } from 'react';
import { signupSchema } from "../../utils/schema";
import { useNavigate, Link } from "react-router-dom";
import z from 'zod';

type ZodError = { errors: string[]; properties?: { username?: { errors: string[]; } | undefined; email?: { errors: string[]; } | undefined; password?: { errors: string[]; } | undefined;} | undefined;};

type Error = {
  zodError?: ZodError;
  resError?: {
    error: ZodError;
    message: string;
  }
} | undefined;

const Signup = () => {
  const navigate = useNavigate();
  const [ error, setError ] = useState<Error>();

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const validatedData = signupSchema.safeParse(data);
    if (!validatedData.success) {
      return setError({ zodError: z.treeifyError(validatedData.error)});
    } else setError(undefined);

    let result;
    try{
      result = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
    } catch(e) {
      console.log(e);
      return;
    }
    
    

    if (!result.ok) {
      const response = await result.json();

      setError({resError: response});
    }
    else if(result.redirected) {
      navigate(result.url);
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
        <h1 className='text-xl font-extrabold md:text-4xl text-blueD'>Create<br/>A new account</h1>

        <button type='button' title='signup' className='bg-wA text-blueD px-4 py-2 text-sm md:px-5 md:py-3 rounded-full md:text-lg font-semibold shadow-md shadow-blueD hover:mt-1 hover:shadow-sm cursor-pointer'><Link to="/auth/login">Log in</Link></button>
      </div>

      {/** form */}
      <div className='flex-3 z-20 w-full flex justify-center items-center'>
        <div className='w-[60%] shadow-md shadow-blueC min-w-[300px] max-w-[600px] rounded-xl py-20 flex flex-row items-center justify-center gap-3 bg-back px-5 md:px-10'>
          <form onSubmit={handleSignup} className='flex-1 flex flex-col justify-center items-start'>
            <div className='flex flex-col gap-2 mb-2 w-full'>
              <label htmlFor="username" className='text-blueD text-lg font-semibold'>Username</label>
              <input title='username' placeholder='Type your username' name='username' className='bg-none h-14 border border-text rounded-md px-3 text-blueD' />
              {
                error?.zodError?.properties?.username && (
                  <p className="text-md text-error p-0 m-0">{error?.zodError?.properties?.username.errors[0]}</p>
                )
              }
            </div>

            <div className='flex flex-col gap-2 mb-2 w-full'>
              <label htmlFor="email" className='text-blueD text-lg font-semibold'>Email</label>
              <input title='email' placeholder='Type your email'  name='email' className='bg-none h-14 border border-text rounded-md px-3 text-blueD' />
              {
                error?.zodError?.properties?.email && (
                  <p className="text-md text-error p-0 m-0">{error?.zodError?.properties?.email.errors[0]}</p>
                )
              }
            </div>

            <div className='flex flex-col gap-2 mb-3 w-full'>
              <label htmlFor="password" className='text-blueD text-lg font-semibold'>Password</label>
              <input title='password' placeholder='Type your password' name='password' type="password" className='bg-none h-14 border border-text rounded-md px-3 text-blueD' />
              {
                error?.zodError?.properties?.password && (
                  <p className="text-md text-error p-0 m-0">{error?.zodError?.properties?.password.errors[0]}</p>
                )
              }
            </div>

            <div className='flex flex-col gap-2 mb-5 w-full'>
              <button type='submit' title='signup' className='w-full bg-blueC h-14 rounded-xl grid items-center text-lg font-semibold text-blueA'>Sign up</button>

              <div className='flex w-full justify-between items-center'>
                <div className='flex-1 bg-zinc-500 h-0.5'></div>
                <p className='text-zinc-500 mx-3'>OR</p>
                <div className='flex-1 bg-zinc-500 h-0.5'></div>
              </div>

              <button type='button' title='login' className='w-full bg-blueC h-14 rounded-xl flex justify-center items-center text-lg font-semibold text-blueA'><FaGoogle className="inline mr-2" />Continue with Google</button>
            </div>
            {
                error?.resError?.message && (
                  <p className="text-md text-error p-0 m-0">{error?.resError?.message}</p>
                )
              }
          </form>
        </div>
      </div>
    </div>
  )
}

export default Signup;