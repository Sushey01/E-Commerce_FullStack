import Iphone from "../assets/images/iphone.webp"
import Laptop from "../assets/images/laptop.png"
import Watch from "../assets/images/megawatch.webp"
import Gaming from "../assets/images/gaming.png"
import Camera from "../assets/images/camera.png"
import Headphone from "../assets/images/headphone.png"




const categoryProductData = [
  {
    title: "Smartphones",
    items: "iPhone, Samsung, OnePlus",
    image: Gaming,
    route: "smartphones",
  },
  {
    title: "Laptops",
    items: "MacBook, Dell, HP, Asus",
    image: Laptop,
    route: "laptops",
  },
  {
    title: "Tablets",
    items: "iPad, Android Tablets",
    image: Iphone,
    route: "tablets",
  },
  {
    title: "Wearables",
    items: "Smartwatches, Fitness Bands",
    image: Watch,
    route: "wearables",
  },
  {
    title: "Audio",
    items: "Headphones, Earbuds, Speakers",
    image: Headphone,
    route: "audio",
  },
  {
    title: "Gaming",
    items: "Consoles, Accessories, Games",
    image: Gaming,
    route: "gaming",
  },
  {
    title: "Cameras",
    items: "DSLR, Mirrorless, Action Cams",
    image: Camera,
    route: "cameras",
  },
  {
    title: "Accessories",
    items: "Chargers, Cables, Power Banks",
    image: Iphone,
    route: "accessories",
  },
];

export default categoryProductData;
