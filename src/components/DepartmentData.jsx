import React from 'react';
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
export default departments;
