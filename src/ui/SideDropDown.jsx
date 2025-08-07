import { useState, useEffect } from "react";
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

const SideDropDown = ({IsLayout= true, initialOpen=true}) => {
    const [showList, setShowList] = useState(null)
    const [showCategory, setShowCategory]= useState(initialOpen)

    const toggleCategory = (index)=>{
        setShowList(showList === index?null:index)
    }



    // Update when initialopen changes
    // This ensures that if initialOpen changes after render, showCategory updates to match.
    // Not always required, but helpful if your page/layout updates dynamically.


    useEffect(()=>{
      setShowCategory(initialOpen);
    }, [initialOpen])


// useEffect(() => {
//   document.body.style.overflow = showCategory ? 'hidden' : 'auto';
//   return () => {
//     document.body.style.overflow = 'auto';
//   };
// },[showCategory]);



  return (
    <div className={`${IsLayout ? "absolute":''}`} >
      <div 
      onClick={()=>setShowCategory((prev)=>!prev)}
      className="  border rounded-tl-3xl text-white rounded-tr-3xl w-[100%] flex space-x-12 items-center justify-between gap-3 p-3 px-2.5 bg-[#0296A0] cursor-pointer">
        <div className="gap-3 flex ">
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
  className={`fill-white transition-transform duration-300 ${
    showCategory ? "rotate-180" : ""
  }`}
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
        className="relative group w-[100%] md:justify-between justify-end"
      >

       <div
          className={`transition-all duration-500 ease-in-out  z-[99] ${
            showCategory ? "max-h-[1000px]" : "max-h-0 overflow-hidden" //block and hidden also can be used..
          }`}
    
        >
          {departments.map((item, index) => (
            <Category
              key={index}
              {...item}
              icon={item.icon}
              title={item.title}
              sublist={item.sublist}
              index={index}
              isOpen={showList === index}
              toggleCategory={toggleCategory}
            />
          ))}
        </div>
      
      </div>
    </div>
  );
};




const Category = ({ icon, title, sublist, index, isOpen, toggleCategory }) => {
  return (
    <div className="relative w-full bg-white shadow-md">
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
            z-[999]
          "
        >
          {sublist.map((item, idx) => (
            <li
              key={idx}
              className="p-2 px-4 cursor-pointer hover:bg-slate-100 text-gray-700  "
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
