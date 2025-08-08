import React from 'react'
import Footer1 from '../ui/Footer1'
import FooterCopyRight from '../components/FooterCopyRight'

const Footer = () => {
  return (
    <>
    <div className='pb-[60px]  lg:pb-0'>
    <div className='p-0'>
      <Footer1/>
    </div>
    <FooterCopyRight/>
    </div>
      
    </>
    
  )
}

export default Footer
