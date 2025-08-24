import Iphone from "../assets/images/iphone.webp";
import Samsung from "../assets/images/samsung.png";
import Xaomi from "../assets/images/xaomi.png";
import Honor from "../assets/images/honor.png";

const featureProducts = [
  {
    id: '1',
    title1: 'iPad',
    title2: '& Tablets',
    subtitle: 'Up to 20% off today!',
    label: 'Shop Now',
    variant: {
      color: ['red', 'black', 'blue'],
      size: ['small', 'medium', 'large']
    },
    link: '/products/1',
    image: Iphone,
  },
  {
    id: '2',
    title1: 'Samsung',
    title2: 'Galaxy',
    subtitle: 'Save 10% this week!',
    label: 'Shop Now',
    link: '/products/2',
    image: Samsung,
  },
  {
    id: '3',
    title1: 'Xiaomi',
    title2: 'Gaming',
    subtitle: 'Flat 20% off',
    label: 'Shop Now',
    link: '/products/3',
    image: Xaomi,
  },
  {
    id: '4',
    title1: 'Xiaomi',
    title2: 'Gaming',
    subtitle: 'Flat 20% off',
    label: 'Shop Now',
    variant: {
      color: ['red', 'black', 'white']
    },
    link: '/products/4',
    image: Honor,
  },
  {
    id: '5',
    title1: 'Iphone',
    title2: 'Gaming',
    subtitle: 'Flat 20% off',
    label: 'Shop Now',
    link: '/products/5',
    image: Iphone,
  },
  {
    id: '6',
    title1: 'Xiaomi',
    title2: 'Gaming',
    subtitle: 'Flat 20% off',
    label: 'Shop Now',
    variant: {
      color: ['red', 'black', 'white']
    },
    link: '/products/6',
    image: Xaomi,
  },
  {
    id: '7',
    title1: 'Samsung',
    title2: 'Gaming',
    subtitle: 'Flat 20% off',
    label: 'Shop Now',
    link: '/products/7',
    image: Samsung,
  },
  {
    id: '8',
    title1: 'Xiaomi',
    title2: 'Gaming',
    subtitle: 'Flat 20% off',
    label: 'Shop Now',
    variant: {
      color: ['red', 'black', 'white']
    },
    link: '/products/8',
    image: Iphone,
  },
];

export default featureProducts;
