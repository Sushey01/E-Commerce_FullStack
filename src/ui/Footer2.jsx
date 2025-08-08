import React from "react";
import Facebook from "../assets/images/facebook.webp";
import Instagram from "../assets/images/instagram.webp";
import Twitter from "../assets/images/twitter.webp";
import Linkedln from "../assets/images/linkedln.webp";
import Apple from "../assets/images/apple.webp";
import PlayStore from "../assets/images/playstore.webp";

const Footer2 = () => {
  return (
    <div className="bg-[#f9f9f9] p-3 ">
      <div className="flex flex-col md:flex-row md:flex-wrap gap-8 justify-between">
        {/* About */}
        <div className="flex flex-col gap-3 max-w-md">
          <p className="text-[#666] text-lg font-semibold">About The Shop</p>
          <p className="text-[#777]">
            We're not just an online store; we're your gateway to a world of
            cutting-edge electronics and telemobile devices.
          </p>
          <div>
            <p className="text-[#666] font-medium">Follow Us</p>
            <div className="flex gap-3 mt-2">
              <img src={Facebook} alt="facebook" className="w-6 h-6" />
              <img src={Instagram} alt="instagram" className="w-6 h-6" />
              <img src={Twitter} alt="twitter" className="w-6 h-6" />
              <img src={Linkedln} alt="linkedin" className="w-6 h-6" />
            </div>
          </div>
        </div>

        
        {/* <div className="flex md:flex-col"> */}
          
        {/* Popular Categories */}
        <div className="flex flex-col gap-3 min-w-[150px]">
          <p className="text-[#666] text-lg font-semibold">Popular Categories</p>
          <div className="flex flex-col gap-1 text-[#555] text-sm">
            <a href="#">Smartphone & Tablets</a>
            <a href="#">Laptop & Desktop</a>
            <a href="#">Headphones</a>
            <a href="#">Smart Watches</a>
            <a href="#">Drone & Camera</a>
            <a href="#">Computer Accessories</a>
            <a href="#">Laptop</a>
          </div>
        </div>

        {/* Let Us Help You */}
        <div className="flex flex-col gap-3 min-w-[150px]">
          <p className="text-[#666] text-lg font-semibold">Let Us Help You</p>
          <div className="flex flex-col gap-1 text-[#555] text-sm">
            <a href="#">Your Account</a>
            <a href="#">Your Order</a>
            <a href="#">Return Policy</a>
            <a href="#">Help Center</a>
            <a href="#">Product Replacement</a>
            <a href="#">Shop With Points</a>
          </div>
        </div>
        {/* </div> */}

        {/* Get to Know Us */}
        <div className="flex flex-col gap-3 min-w-[150px]">
          <p className="text-[#666] text-lg font-semibold">Get to Know Us</p>
          <div className="flex flex-col gap-1 text-[#555] text-sm">
            <a href="#">About Us</a>
            <a href="#">Careers</a>
            <a href="#">Store Location</a>
            <a href="#">News Center</a>
            <a href="#">Product Replacement</a>
            <a href="#">Contact Us</a>
          </div>
        </div>

        {/* App Download */}
        <div className="flex flex-col gap-3 min-w-[180px]">
          <p className="text-[#666] text-lg font-semibold">Download App</p>
          <div className="flex md:flex-col justify-center gap-3 w-full ">
            <button className="border rounded-full bg-black py-2 px-4 justify-center flex items-center gap-2">
              <img src={Apple} alt="apple" className="w-7 h-7" />
              <div>
                <p className="text-white text-[11px]">Available on</p>
                <p className="text-white text-sm">Apple Store</p>
              </div>
            </button>

            <button className="border rounded-full bg-black py-2 px-4 flex justify-center items-center gap-2">
              <img src={PlayStore} alt="playstore" className="w-7 h-7" />
              <div>
                <p className="text-white text-[11px]">Available on</p>
                <p className="text-white text-sm">Google Play</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer2;
