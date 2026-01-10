import clsx from 'clsx';

const ToggleButton = ({on, cb}: {on: boolean, cb: () => void}) => {
  return (
    <button type='button' title='dark mode' className={clsx('flex bg-textB h-6 w-10 border-3 border-textB rounded-full items-center hover:bg-htextB hover:border-htextB md:h-8 md:w-12',{
      'justify-end': on,
      'justify-start': !on
    })} onClick={cb}>
      <div className='bg-wA h-4 w-4 md:h-6 md:w-6 rounded-full'></div>
    </button>
  )
}

export default ToggleButton;