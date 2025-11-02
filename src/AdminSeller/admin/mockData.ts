export const mockSellers = [
  {
    id: 1,
    name: "John Smith",
    email: "john@example.com",
    products: 12,
    sales: 2450,
    status: "active",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    products: 8,
    sales: 1890,
    status: "active",
  },
  {
    id: 3,
    name: "Mike Wilson",
    email: "mike@example.com",
    products: 15,
    sales: 3200,
    status: "inactive",
  },
  {
    id: 4,
    name: "Emma Davis",
    email: "emma@example.com",
    products: 6,
    sales: 1200,
    status: "active",
  },
];

export const mockProducts = [
  {
    id: 1,
    name: "Wireless Headphones",
    seller: "John Smith",
    price: 99.99,
    stock: 45,
    category: "Electronics",
  },
  {
    id: 2,
    name: "Coffee Mug",
    seller: "Sarah Johnson",
    price: 15.99,
    stock: 120,
    category: "Home & Garden",
  },
  {
    id: 3,
    name: "Laptop Stand",
    seller: "Mike Wilson",
    price: 49.99,
    stock: 0,
    category: "Electronics",
  },
  {
    id: 4,
    name: "Yoga Mat",
    seller: "Emma Davis",
    price: 29.99,
    stock: 78,
    category: "Sports",
  },
];

import { Users, Package, DollarSign, TrendingUp } from "lucide-react";

export const statsCards = [
  {
    title: "Total Sellers",
    value: "24",
    change: "+12%",
    icon: Users,
    color: "text-blue-600",
  },
  {
    title: "Total Products",
    value: "156",
    change: "+8%",
    icon: Package,
    color: "text-green-600",
  },
  {
    title: "Total Revenue",
    value: "$12,450",
    change: "+23%",
    icon: DollarSign,
    color: "text-purple-600",
  },
  {
    title: "Growth Rate",
    value: "18.2%",
    change: "+5%",
    icon: TrendingUp,
    color: "text-orange-600",
  },
];
