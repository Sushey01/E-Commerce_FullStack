import React from 'react'

const ButtonUi = ({value, label}) => {
  return (
    <>
      <button className=' p-1 border-1 rounded flex flex-col items-center bg-[#e17900] cursor-pointer'>
        <p className='text-white text-xs'>{value}</p>
        <p className='text-white text-[10px]'>{label}</p>
      </button>
    </>
  )
}

export default ButtonUi
