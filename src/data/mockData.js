import Laptop from "../assets/images/laptop.webp";
import Xaomi from "../assets/images/xaomi.png";
import Samsung from "../assets/images/samsung.png";
import Honor from "../assets/images/honor.png";

import ProductImage from "../assets/images/laptop.webp";
import ProductImage1 from "../assets/images/laptop1.webp";
import ProductImage2 from "../assets/images/laptop2.webp";
import ProductImage3 from "../assets/images/laptop3.webp";

const mockProducts = [
  {
    id: '1',
    name: 'Apple MacBook Pro 16.2"',
    description: 'Liquid Retina XDR Display, M2 Max Chip with 12–Core CPU',
    price: 'Rs. 2,50,000',
    oldPrice: 'Rs. 2,80,000',
    rating: 4.5,
    reviews: 25,
    style: ['Apple M1 Max Chip'],
    capacity: ['512 GB', '1 TB'],
    colors: ['#f87171', '#fbbf24'],
    images: [ProductImage, ProductImage2, ProductImage3, ProductImage1],
    outOfStock: true
  },
  {
    id: '2',
    name: 'Xiaomi Gaming Phone',
    description: 'High performance gaming phone with AMOLED Display',
    price: 'Rs. 60,000',
    oldPrice: 'Rs. 70,000',
    rating: 4.3,
    reviews: 95,
    style: ['Standard', 'Pro'],
    capacity: ['128 GB', '256 GB'],
    colors: ['#000000', '#00ff00'],
    images: [Xaomi, ProductImage1, ProductImage2, ProductImage3],
    outOfStock: false
  },
  {
    id: '3',
    name: 'Samsung Galaxy S23',
    description: 'Sleek design, powerful camera, and fast performance',
    price: 'Rs. 80,000',
    oldPrice: 'Rs. 90,000',
    rating: 4.7,
    reviews: 120,
    style: ['Base', 'Plus', 'Ultra'],
    capacity: ['128 GB', '256 GB', '512 GB'],
    colors: ['#000000', '#ffffff', '#ff0000'],
    images: [Samsung, ProductImage1, ProductImage3, ProductImage2],
    outOfStock: false
  },
  {
    id: '4',
    name: 'Honor Magic 5',
    description: 'Premium smartphone with advanced AI features',
    price: 'Rs. 50,000',
    oldPrice: 'Rs. 55,000',
    rating: 4.2,
    reviews: 60,
    style: ['Standard', 'Pro'],
    capacity: ['128 GB', '256 GB'],
    colors: ['#fbbf24', '#3b82f6'],
    images: [Honor, ProductImage1, ProductImage2, ProductImage3],
    outOfStock: false
  }
];

export default mockProducts;
