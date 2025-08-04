import React, { useState, useEffect } from 'react'
import { ChevronUp } from 'lucide-react'

const RedirectTopButton = () => {
 const [showButton, setShowButton] = useState(false)

useEffect(()=>{
  const handleScroll = ()=>{
    const heroHeight = document.getElementById('hero')?.offsetHeight || 400;
    setShowButton(window.scrollY>heroHeight)
  }

  window.addEventListener('scroll', handleScroll)
}, [])


function handleScrollToTop(){
  window.scrollTo({top:0, behavior:"smooth"})
}

  return showButton ? (
    <div
    onClick={handleScrollToTop}
    className='fixed bottom-[80px]  right-6 z-50 border rounded-full flex justify-center items-center p-2 w-10 h-10 md:w-12 md:h-12  bg-white shadow-md hover:bg-blue-100 transition duration-300 cursor-pointer'>
      <ChevronUp/>
    </div>
  ) : null;
}

export default RedirectTopButton
