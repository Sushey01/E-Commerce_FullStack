import React, { useState } from "react";
import styles from "./Navbar.module.css";
import Logo from "../assets/images/NavLogo.webp";
import User from "../assets/images/user.avif";
import SideBarMenu from "../components/SideBarMenu"

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [toggleSearch, setToggleSearch] = useState(false);
  const [showCategory, setShowCategory] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("Select Category");





  const categories = ["Electronics", "Fashion", "Home & Kitchen", "Books", "Toys"]


  return (
    <>
{/* MOBILE SEARCH DRAWER */}
{toggleSearch && (
  <div className="flex flex-col fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 p-4 shadow-md transition-transform transform md:hidden animate-slideIn">
    {/* Close Button */}
    <button
      onClick={() => setToggleSearch(false)}
      className="absolute top-1 right-5 text-gray-500 hover:text-gray-900 dark:hover:text-white text-4xl"
      aria-label="Close search drawer"
    >
      &times;
    </button>

    {/* Search Input + Category */}
    <div className="flex gap-2 w-full mb-4 relative mt-8">
      {/* Category Dropdown */}
      <div className="relative w-1/3">
        <button
          onClick={() => setShowCategory(!showCategory)}
          className="w-full gap-1 flex items-center justify-between border rounded px-3 py-2 bg-white"
          type="button"
        >
          {selectedCategory}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-chevron-down"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

        {showCategory && (
          <ul className="absolute mt-1 w-full bg-white border rounded shadow z-50 max-h-48 overflow-auto">
            {categories.map((cat) => (
              <li
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setShowCategory(false);
                }}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {cat}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Search Input */}
      <div className="flex items-center flex-1">
        <input
          type="text"
          placeholder="Search for products..."
          className="w-full border rounded-tr-none rounded-br-none rounded-tl-md rounded-bl-md  px-3 py-2"
        />
        <button className="flex border px-3 py-2.5 rounded-tl-none rounded-bl-none rounded-md bg-[#0296A0] text-white ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="21"
            height="21"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-search"
          >
            <path d="m21 21-4.34-4.34" />
            <circle cx="11" cy="11" r="8" />
          </svg>
        </button>
      </div>
    </div>
  </div>
)}



      {/* Main Navbar */}
      <div className={styles.navbar}>
        <div className={styles.middle}>
          <div className={styles.logo}>
            <img src={Logo} alt="Logo" />
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
                <label>
                  <input
                    placeholder="Search for products..."
                    type="text"
                  />
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
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-search-icon lucide-search"
              >
                <path d="m21 21-4.34-4.34" />
                <circle cx="11" cy="11" r="8" />
              </svg>
            </div>
          </div>

          {/* Mobile right icons */}
          <div className="flex content-center float-right items-center space-x-4  lg:hidden">
            {/* 🔍 Mobile search icon with drawer toggle */}
            <button
              onClick={() => setToggleSearch(true)}
              className="block md:hidden"
              aria-label="Open search drawer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                color="#777"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m21 21-4.34-4.34" />
                <circle cx="11" cy="11" r="8" />
              </svg>
            </button>

            {/* ☰ Menu toggle */}
            <button
              aria-label="Toggle menu"
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 block lg:hidden"
            >
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 24 24"
                className="text-2xl"
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
            <img src={User} alt="User" />
          </div>

          {/* ❤️ Wishlist */}
          <div
            className={styles.heart}
            style={{ position: "relative" }}
          >
            <div className="bg-red-500 text-white text-xs font-semibold w-5 h-5 -translate-y-1/2 translate-x-1/2 text-center content-center rounded-full absolute top-0 right-0">
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
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-heart-icon lucide-heart"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </div>

          {/* 🛒 Cart */}
          <div
            className={styles.cart}
            style={{ position: "relative" }}
          >
            <div className="bg-red-500 text-white text-xs font-semibold w-5 h-5 -translate-y-1/2 translate-x-1/2 text-center content-center rounded-full absolute top-0 right-0">
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
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-shopping-cart-icon lucide-shopping-cart"
            >
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
