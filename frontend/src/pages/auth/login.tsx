import { FaGoogle } from "react-icons/fa";
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className='h-full relative w-full bg-back overflow-hidden flex flex-col justify-around items-center'>
      {/** background */}
      <div className="w-full flex flex-row justify-center">
        <div className="absolute bg-blueA w-[200%] rounded-[100%] h-screen z-10 bottom-[40%] -right-[20%] border-50 border-wA"></div>
      </div>

      {/** header */}
      <div className='w-full flex-1 flex flex-row justify-around items-center z-20'>
        <h1 className='text-xl font-extrabold md:text-4xl text-blueD'>Login<br/>To your account</h1>

        <button type='button' title='signup' className='bg-wA text-blueD px-4 py-2 text-sm md:px-5 md:py-3 rounded-full md:text-lg font-semibold shadow-md shadow-blueD hover:mt-1 hover:shadow-sm cursor-pointer'><Link to="/auth/signup">Sign Up</Link></button>
      </div>

      {/** form */}
      <div className='flex-3 z-20 w-full flex justify-center items-center'>
        <div className='w-[60%] shadow-md shadow-blueC min-w-[300px] max-w-[600px] rounded-xl py-20 flex flex-row items-center justify-center gap-3 bg-back px-5 md:px-10'>
          <form action="none" className='flex-1 flex flex-col justify-center items-start'>
            <div className='flex flex-col gap-2 mb-5 w-full'>
              <label htmlFor="email" className='text-blueD text-lg font-semibold'>Email</label>
              <input title='email' placeholder='Type your email' type='email' name='email' className='bg-none h-14 border border-text rounded-md px-3 text-blueD' />
            </div>

            <div className='flex flex-col gap-2 mb-5 w-full'>
              <label htmlFor="password" className='text-blueD text-lg font-semibold'>Password</label>
              <input title='password' placeholder='Type your password' type='password' name='password' className='bg-none h-14 border border-text rounded-md px-3 text-blueD' />
            </div>

            <div className='flex flex-col gap-2 mb-5 w-full'>
              <button type='button' title='login' className='w-full bg-blueC h-14 rounded-xl grid items-center text-lg font-semibold text-blueA'>Log in</button>

              <div className='flex w-full justify-between items-center'>
                <div className='flex-1 bg-zinc-500 h-[2px]'></div>
                <p className='text-zinc-500 mx-3'>OR</p>
                <div className='flex-1 bg-zinc-500 h-[2px]'></div>
              </div>

              <button type='button' title='login' className='w-full bg-blueC h-14 rounded-xl flex justify-center items-center text-lg font-semibold text-blueA'><FaGoogle className="inline mr-2" />Continue with Google</button>
            </div>


          </form>
        </div>
      </div>
    </div>
  )
}

export default Login