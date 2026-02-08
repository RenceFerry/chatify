import logo from "../assets/logo.png"

export const Loading = () => {
  return (
    <div className='h-full w-full bg-back flex justify-center items-center'>
      <img className="animate-pulse" alt='logo' src={logo}/>
    </div>
  )
}
