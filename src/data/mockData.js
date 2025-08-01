import Laptop from "../assets/images/laptop.webp"
import ProductImage from "../assets/images/laptop.webp"
import ProductImage1 from "../assets/images/laptop1.webp"
import ProductImage2 from "../assets/images/laptop2.webp"
import ProductImage3 from "../assets/images/laptop3.webp"


const mockProduct = {
  id: '1',
  name: 'Apple MacBook Pro 16.2"',
  description: 'With Liquid Retina XDR Display, M2 Max Chip with 12–Core CPU',
  price: 'Rs. 2,50,000',
  oldPrice: 'Rs. 2,80,000',
  rating: 4.5,
  reviews: 25,
  style: 'Apple M1 Max Chip',
  capacity: ['512 GB', '1 TB'],
  colors: ['#f87171', '#fbbf24'], // red and orange
  images: [
  ProductImage,
  ProductImage1,
  ProductImage2,
  ProductImage3,
  ],
  outOfStock: true
};

export default mockProduct;
