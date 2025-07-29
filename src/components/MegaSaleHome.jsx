import React from "react";
import Watch from "../assets/images/megawatch.webp"

const MegaSaleHome = ({onPrev, onNext, currentSlide, totalSlide}) => {
  return (
    <div className=" w-full p-3 md:p-11 lg:h-[100vh] content-center bg-[#dcd9d9] border md:rounded-lg  ">
        <div className=" block md:hidden p-2 md:p-3 border-1 border-[#E43100] rounded-2xl mb-4 bg-[#FFDFD7]">
          <p className="text-[#E43100]  font-normal text-center  md:text-start text-sm md:text-base">
  👌 Mega Sale Madness! Enjoy 30% off ✌️
</p>
          </div>
      <div className="grid grid-cols-2 md:grid-cols-2 w-full gap-5">
        <div className="w-full">
          <div className=" hidden md:block p-2 md:p-3 border-1 border-[#E43100] rounded-2xl mb-4 bg-[#FFDFD7]">
          <p className="text-[#E43100]  font-normal  md:text-start text-sm md:text-base">
  👌 Mega Sale Madness! Enjoy 30% off ✌️
</p>
          </div>
          <h1 className="text-[#777]  text-[16px] md:text-4xl mb-4 font-bold text-start">Experience the future of Smartwatches!</h1>
          
          <p className="text-[#777] hidden md:block text-base md:text-[18px] w- mb-4">
            A sleek design with AI voice assistant, IP68 water resistance, and a
            battery that lasts up to 7 days!
          </p>

          <button className=" content-center items-center gap-2  md:hover:bg-blue-600 border flex  p-2 px-3 mb-4 md:rounded-md  rounded-full bg-[#0296a0]">
            <p className="text-[#fff] hidden md:block font-semibold  md:text-[20px]">Shop Now</p>
            <p className="text-[#fff] block md:hidden font-semibold  text-sm">Shop Now</p>
            <svg
              width="12"
              height="9"
              viewBox="0 0 12 9"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.44364 2.34251L6.96384 1.67805C6.96377 1.67803 6.9637 1.67801 6.96362 1.67799C6.89144 1.65894 6.82374 1.62579 6.76441 1.58046C6.70503 1.53509 6.65522 1.47841 6.61786 1.41369C6.58049 1.34897 6.55631 1.27749 6.5467 1.20338C6.53712 1.12943 6.54224 1.05433 6.56177 0.982371M9.44364 2.34251L7.22497 0.701537L7.25781 0.58093C7.25774 0.580911 7.25767 0.580891 7.2576 0.580871C7.18556 0.561282 7.11035 0.556136 7.03631 0.565729C6.9622 0.575331 6.89072 0.599513 6.826 0.636879C6.76128 0.674246 6.7046 0.724057 6.65923 0.783439C6.61396 0.842685 6.58084 0.910291 6.56177 0.982371M9.44364 2.34251L0.712481 7.38345C0.582455 7.45852 0.487576 7.58217 0.448717 7.72719C0.409857 7.87222 0.430201 8.02674 0.505271 8.15677C0.580342 8.28679 0.70399 8.38167 0.849015 8.42053C0.994039 8.45939 1.14856 8.43905 1.27859 8.36398L10.0017 3.32768L9.33857 5.79174L9.33844 5.79223C9.30017 5.93681 9.32065 6.09066 9.39543 6.22018C9.47021 6.3497 9.5932 6.44437 9.73755 6.48351L9.73827 6.4837C9.88284 6.52197 10.0367 6.50149 10.1662 6.42671C10.2957 6.35193 10.3904 6.22894 10.4295 6.08459L10.4296 6.08423L11.4562 2.2531C11.4752 2.18706 11.4807 2.11788 11.4724 2.04966L11.3483 2.06469L11.4724 2.04966C11.4641 1.98098 11.442 1.9147 11.4074 1.85478C11.3728 1.79487 11.3265 1.74258 11.2711 1.70103L11.1961 1.80098L9.44364 2.34251ZM6.56177 0.982371C6.56182 0.982206 6.56186 0.98204 6.56191 0.981876L6.68251 1.01472L6.56164 0.982867C6.56168 0.982702 6.56173 0.982536 6.56177 0.982371ZM11.0869 1.6134C11.0865 1.61328 11.086 1.61316 11.0855 1.61304L11.0557 1.73443L11.0882 1.61374L11.0869 1.6134Z"
                fill="white"
                stroke="white"
                stroke-width="0.25"
              ></path>
            </svg>
          </button>
          <div className="hidden md:flex  gap-3  content-center">
            <p className="text-[#0296a0]  font-normal  md:text-[25px]">02/03</p>
            <div className="content-center flex gap-3">
            <button onClick={onPrev}>
              <svg width="11" height="19" viewBox="0 0 11 19" fill="none"><path d="M1 9.48111L10.1828 17.9622L1 9.48111Z" fill="#0296A0"></path><path d="M1 9.48111L10.1828 17.9622" stroke="#0296A0" stroke-linecap="round" stroke-linejoin="round"></path><path d="M1 9.4812L10.1828 1.00016L1 9.4812Z" fill="#0296A0"></path><path d="M1 9.4812L10.1828 1.00016" stroke="#0296A0" stroke-linecap="round" stroke-linejoin="round"></path></svg>
            </button>
            <button onClick={onNext}>
              <svg width="11" height="19" viewBox="0 0 11 19" fill="none"><path d="M10.3655 9.48111L1.18277 17.9622L10.3655 9.48111Z" fill="#0296A0"></path><path d="M10.3655 9.48111L1.18277 17.9622" stroke="#0296A0" stroke-linecap="round" stroke-linejoin="round"></path><path d="M10.3655 9.4812L1.18277 1.00016L10.3655 9.4812Z" fill="#0296A0"></path><path d="M10.3655 9.4812L1.18277 1.00016" stroke="#0296A0" stroke-linecap="round" stroke-linejoin="round"></path></svg>
            </button>
            </div>
          </div>
        </div>
         <div className="content-center ">
            <img  src={Watch} alt='watch'/>
          </div>
      </div>
    </div>
  );
};

export default MegaSaleHome;