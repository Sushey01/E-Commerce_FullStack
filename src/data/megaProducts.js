import HeadPhone from "../assets/images/headphone.png";
import MegaWatch from "../assets/images/megawatch.webp";
import Laptop from "../assets/images/laptop.png";
import Camera from "../assets/images/camera.png";
import Speaker from "../assets/images/speaker.png"

const megaProducts = [
  {
    id: 1,
    bannerText: "🎧 Mega Sale! Get 20% off on Headphones! 🎶",
    title: "Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation and crystal-clear sound.",
    label: "Shop Now",
    price: 15000,
    image: HeadPhone,
    category: "Electronics",
    rating: 4.5,
    reviews: 120,
  },
  {
    id: 2,
    bannerText: "⌚ Mega Sale Madness! Enjoy 30% off ✌️",
    title: "Smart Watch",
    description: "Stylish smart watch with heart rate monitor, GPS, and 7-day battery life.",
    label: "Shop Now",
    price: 12000,
    image: MegaWatch,
    category: "Wearables",
    rating: 4.2,
    reviews: 85,
  },
  {
    id: 3,
    bannerText: "💻 Limited Offer on Gaming Laptops! 🕹️",
    title: "Gaming Laptop",
    description: "Powerful laptop with high-end graphics and blazing-fast performance for gaming.",
    label: "Shop Now",
    price: 95000,
    image: Laptop,
    category: "Computers",
    rating: 4.8,
    reviews: 45,
  },
  {
    id: 4,
    bannerText: "🔊 Special Offer on Bluetooth Speakers! 🎵",
    title: "Bluetooth Speaker",
    description: "Portable speaker with deep bass, long battery life, and sleek design.",
    label: "Shop Now",
    price: 5000,
    image: Speaker,
    category: "Audio",
    rating: 4.4,
    reviews: 78,
  },
  {
    id: 5,
    bannerText: "📸 Capture the Moment with DSLR Cameras! 🌟",
    title: "DSLR Camera",
    description: "Professional camera with multiple lens options and stunning image quality.",
    label: "Shop Now",
    price: 55000,
    image: Camera,
    category: "Photography",
    rating: 4.6,
    reviews: 32,
  },
  // Add more dummy products here as needed
];

export default megaProducts;
