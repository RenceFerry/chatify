import { FaGoogle } from "react-icons/fa";

const Verify = () => {
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

export default Verify;