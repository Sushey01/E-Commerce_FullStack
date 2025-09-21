import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  description: string;
  sellerId: string;
  sellerName: string;
  createdAt: string;
  updatedAt: string;
}

interface ProductContextType {
  products: Product[];
  addProduct: (
    product: Omit<Product, "id" | "createdAt" | "updatedAt">
  ) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductsBySeller: (sellerId: string) => Product[];
  isLoading: boolean;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Mock initial products data
const initialProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    price: 99.99,
    stock: 45,
    category: "Electronics",
    description: "High-quality wireless headphones with noise cancellation",
    sellerId: "seller1",
    sellerName: "John Smith",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "2",
    name: "Coffee Mug",
    price: 15.99,
    stock: 120,
    category: "Home & Garden",
    description: "Ceramic coffee mug with ergonomic handle",
    sellerId: "seller2",
    sellerName: "Sarah Johnson",
    createdAt: "2024-01-02",
    updatedAt: "2024-01-02",
  },
  {
    id: "3",
    name: "Laptop Stand",
    price: 49.99,
    stock: 0,
    category: "Electronics",
    description: "Adjustable aluminum laptop stand for better ergonomics",
    sellerId: "seller3",
    sellerName: "Mike Wilson",
    createdAt: "2024-01-03",
    updatedAt: "2024-01-03",
  },
  {
    id: "4",
    name: "Yoga Mat",
    price: 29.99,
    stock: 78,
    category: "Sports",
    description: "Non-slip yoga mat with carrying strap",
    sellerId: "seller4",
    sellerName: "Emma Davis",
    createdAt: "2024-01-04",
    updatedAt: "2024-01-04",
  },
];

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading from API
    setTimeout(() => {
      setProducts(initialProducts);
      setIsLoading(false);
    }, 1000);
  }, []);

  const addProduct = (
    productData: Omit<Product, "id" | "createdAt" | "updatedAt">
  ) => {
    const newProduct: Product = {
      ...productData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProducts((prev) => [...prev, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id
          ? { ...product, ...updates, updatedAt: new Date().toISOString() }
          : product
      )
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
  };

  const getProductsBySeller = (sellerId: string) => {
    return products.filter((product) => product.sellerId === sellerId);
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductsBySeller,
        isLoading,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
}
