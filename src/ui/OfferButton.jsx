import React from 'react'

const ButtonUi = () => {
  return (
    <>
      <button className=' p-1 border-1 rounded flex flex-col bg-[#e17900] cursor-pointer'>
        <p className='text-white text-sm'>24</p>
        <p className='text-white text-[12px]'>Minutes</p>
      </button>
    </>
  )
}

export default ButtonUi
