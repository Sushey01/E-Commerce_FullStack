import React from 'react'
import Car from "../assets/images/deliverycar.webp"
import Support from "../assets/images/support.webp"
import Wallet from "../assets/images/wallet.webp"
import Payment from "../assets/images/payment.webp"
import Footer2 from './Footer2'

const Footer1 = () => {
  return (
    <>
      <div className=' md:my-6 p-3 flex flex-col gap-2 md:flex-row  justify-between border-b-2'>
        <div className='flex items-center gap-2 '>
        <img src={Car}/>
        <div className='flex flex-col gap-1'>
            <p className=' font-semibold text-[#666]'>Fast Delivery</p>
            <p className="text-[#777]">Experience Lightning-Fast Delivery</p>
        </div>
        </div>

        <div className='flex items-center gap-3 '>
        <img src={Payment}/>
        <div className='flex flex-col gap-1'>
            <p className=' font-semibold text-[#666]'>Secured Payment</p>
            <p className="text-[#777]">Shop with Confidence</p>
        </div>
        </div>

        <div className='flex items-center gap-3 '>
        <img src={Wallet}/>
        <div className='flex flex-col gap-1'>
            <p className=' font-semibold text-[#666]'>Money Back</p>
            <p className="text-[#777]">100% Money-Back Guarantee</p>
        </div>
        </div>

        <div className='flex items-center gap-3 '>
        <img src={Support}/>
        <div className='flex flex-col gap-1'>
            <p className=' font-semibold text-[#666]'>24/7 Support</p>
            <p className="text-[#777]">Always Here for You</p>
        </div>
        </div>
      </div>
      <Footer2/>
    </>
  )
}

export default Footer1
