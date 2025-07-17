import { useState } from "react";

import { CiFilter } from "react-icons/ci";
import {
  FaHeadphones,
  FaLaptop,
  FaMobileAlt,
  FaClock,
  FaVrCardboard,
  FaCamera,
  FaHeadset,
  FaPlug,
  FaTv,
  FaMouse,
} from "react-icons/fa";
import { RiArrowRightSLine } from "react-icons/ri";

const SideDropDown = () => {
    const [showList, setShowList] = useState(null)


    const toggleCategory = (index)=>{
        setShowList(showList === index?null:index)
    }

  return (
    <div className="p-5">
      <div className="border rounded-tl-3xl text-white rounded-tr-3xl w-[25%] flex space-x-12 items-center justify-between gap-3 p-3 px-2 bg-[#0296A0]">
        <div className="gap-3 flex">
          <svg
            className="w-6 h-6 text-white content-center"
            viewBox="0 0 20 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 6.5H12"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M1 12H16.125"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M1 1H6.5"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <h3 className="content-center">Departments</h3>
        </div>

        <svg
          className="fill-white"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="1.5em"
          height="1.5em"
        >
          <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6l-6-6z"></path>
        </svg>
      </div>

      <div
        id="bouton"
        className="relative group w-[25%]  md:justify-between justify-end"
      >

        <div className=" hover:showList(true) space-y w-[100%]">
            {departments.map((item, index)=>(
                <Category
                key={index}
                icon={item.icon}
                title={item.title}
                sublist={item.sublist}
                index={index}
                isOpen={showList===index}
                toggleCategory={toggleCategory}/>
            ))}
        </div>

        
      </div>
    </div>
  );
};




const Category = ({ icon, title, sublist, index, isOpen, toggleCategory }) => {
  return (
    <div className="relative w-full">
      {/* Main Category Button */}
      <button
        onClick={() => toggleCategory(index)}
        className=" relative border-b-2 border-gray-400 w-full justify-between p-2.5 hover:bg-gray-100 flex items-center ml-2 md:ml-0 text-gray-400 font-Kanit-Fallback font-normal hover:text-gray-600"
      >
        <div className="border rounded-full p-2 bg-[#E5E7EB] text-black">
          {icon}
        </div>
        <span className="flex-1 text-left ml-3">{title}</span>
        <span
          className={`transition-transform duration-300 ${
            isOpen ? "rotate-90" : ""
          }`}
        >
          <RiArrowRightSLine className="w-5 h-5" />
        </span>
      </button>

      {/* Sublist */}
      {isOpen && (
        <ul
          className="
            absolute
            top-0
            left-full
            ml-2
            bg-white
            shadow-md
            border border-gray-200
            rounded-md
            text-sm
            w-52
            z-50
          "
        >
          {sublist.map((item, idx) => (
            <li
              key={idx}
              className="p-2 px-4 cursor-pointer hover:bg-slate-100 text-gray-700"
            >
              <a href={item.link}>{item.title}</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};



const departments = [
    {
        icon:<FaMobileAlt/>,
        title:"Smartphone & Tablets",
        sublist:[
            {title: "Telephone", link:"/products?category=telephone"},
            {title: "Smartphones", link: "/products?category=smartphones"},
            {title: "Tablets", link:"/products?category=tablets"},
        ]
    },
    {
    icon: <FaLaptop />,
    title: "Laptop & Desktop",
    sublist: [
      { title: "Laptops", link: "/products?catergory=laptops" },
      { title: "Desktops", link: "/products?catergory=desktops" },
      { title: "Notebooks", link: "/products?catergory=notebooks" },
    ],
  },
  {
    icon: <FaHeadphones />,
    title: "Headphones",
    sublist: [
      {
        title: "Over-ear Headphones",
        link: "/products?catergory=over-ear-headphones",
      },
      {
        title: "In-ear Headphones",
        link: "/products?catergory=in-ear-headphones",
      },
      {
        title: "Noise Cancelling",
        link: "/products?catergory=noise-cancelling-headphones",
      },
    ],
  },
  {
    icon: <FaClock />,
    title: "Smart Watches",
    sublist: [
      {
        title: "Fitness Trackers",
        link: "/products?catergory=fitness-trackers",
      },
      {
        title: "Wearable Watches",
        link: "/products?catergory=wearable-watches",
      },
      { title: "Smartwatches", link: "/products?catergory=smartwatches" },
    ],
  },
  {
    icon: <FaVrCardboard />,
    title: "Virtual Reality Headsets",
    sublist: [
      { title: "Standalone VR", link: "/products?catergory=standalone-vr" },
      { title: "Tethered VR", link: "/products?catergory=tethered-vr" },
      {
        title: "Augmented Reality",
        link: "/products?catergory=augmented-reality",
      },
    ],
  },
  {
    icon: <FaCamera />,
    title: "Drone & Camera",
    sublist: [
      { title: "Drones", link: "/products?catergory=drones" },
      { title: "Digital Cameras", link: "/products?catergory=digital-cameras" },
      { title: "Action Cameras", link: "/products?catergory=action-cameras" },
    ],
  },
  {
    icon: <FaHeadset />,
    title: "Wireless Headphone",
    sublist: [
      {
        title: "Bluetooth Headphones",
        link: "/products?catergory=bluetooth-headphones",
      },
      {
        title: "Wireless Earbuds",
        link: "/products?catergory=wireless-earbuds",
      },
      {
        title: "Noise Cancelling",
        link: "/products?catergory=noise-cancelling-headphones",
      },
    ],
  },
  {
    icon: <FaPlug />,
    title: "Electronics Accessories",
    sublist: [
      { title: "Chargers", link: "/products?catergory=chargers" },
      { title: "Cables", link: "/products?catergory=cables" },
      { title: "Adapters", link: "/products?catergory=adapters" },
    ],
  },
  {
    icon: <FaTv />,
    title: "Electronic, TVs & More",
    sublist: [
      { title: "Televisions", link: "/products?catergory=televisions" },
      { title: "Projectors", link: "/products?catergory=projectors" },
      { title: "Media Players", link: "/products?catergory=media-players" },
    ],
  },
  {
    icon: <FaMouse />,
    title: "Computer Peripherals",
    sublist: [
      { title: "Mice", link: "/products?catergory=mice" },
      { title: "Keyboards", link: "/products?catergory=keyboards" },
      { title: "Monitors", link: "/products?catergory=monitors" },
    ],
  },
]

export default SideDropDown;
