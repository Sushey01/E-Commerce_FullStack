import React, { useState } from "react";
import styles from "./Navbar.module.css";
import Logo from "../assets/images/NavLogo.webp";
import User from "../assets/images/user.avif";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={styles.navbar}>
      <div className={styles.middle}>
        <div className={styles.logo}>
          <img src={Logo}></img>
          
        </div>
        
        <div className={styles.firstNav}>
          <div className={styles.bars}>
            <div className={styles.category}>
              <select>
                <option>Select Category</option>
                <option>Electronics</option>
                <option>Fashion</option>
                <option>Home & Kitchen</option>
                <option>Books</option>
                <option>Toys</option>
              </select>
            </div>
            <div className={styles.search1}>
              {/* <p>Search for products</p> */}
              <label>
                <input placeholder="Search for products..." type="text" />
              </label>
            </div>
          </div>
          <div className={styles.search2}>
            <p>Search</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-search-icon lucide-search"
            >
              <path d="m21 21-4.34-4.34" />
              <circle cx="11" cy="11" r="8" />
            </svg>
          </div>
        
        </div>
       
        <div className="flex content-center float-right items-center space-x-4 ">
           <svg
              xmlns="http://www.w3.org/2000/svg"
          className="lg:hidden !important"
              width="20"
              color="#777"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-search-icon lucide-search"
            >
              <path d="m21 21-4.34-4.34" />
              <circle cx="11" cy="11" r="8" />
            </svg>
        <button
          aria-label="Toggle menu"
          onClick={() => setMenuOpen(!menuOpen)}
          className=" p-2 block lg:hidden"
        >
          <svg
            stroke="currentColor"
            fill="currentColor"
            stroke-width="0"
            viewBox="0 0 24 24"
            class="text-2xl"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M3 4H21V6H3V4ZM9 11H21V13H9V11ZM3 18H21V20H3V18Z"></path>
          </svg>
        </button>
      </div>
      </div>

      <div className={styles.secondNav}>
        <div className={styles.user}>
          <img src={User}></img>
        </div>
        <div className={styles.heart} style={{ position: "relative" }}>
          <div className="bg-red-500 text-white text-xs  font-semibold w-5 h-5 -translate-y-1/2 translate-x-1/2 text-center content-center rounded-full absolute top-0 right-0">
            1
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            color="#777"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-heart-icon lucide-heart"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </div>
        <div className={styles.cart} style={{ position: "relative" }}>
          <div className="bg-red-500 text-white text-xs  font-semibold w-5 h-5 -translate-y-1/2 translate-x-1/2 text-center content-center rounded-full absolute top-0 right-0">
            1
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            color="#777"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-shopping-cart-icon lucide-shopping-cart"
          >
            <circle cx="8" cy="21" r="1" />
            <circle cx="19" cy="21" r="1" />
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
          </svg>
        </div>
      </div>
      
    </div>
  );
};

export default Navbar;
