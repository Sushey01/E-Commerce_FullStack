import React, { useEffect, useState } from "react";
// @ts-ignore
import Iphone from "../../../../assets/images/iphone.webp";
// @ts-ignore
import Laptop from "../../../../assets/images/laptop.png";
// @ts-ignore
import HeadPhone from "../../../../assets/images/headphone.png";

interface Order {
  id: number;
  productName: string;
  productImage: string;
}

const fakeOrders: Order[] = [
  {
    id: 1,
    productName: "SteelSeries Apex 3 RGB Gaming Keyboard",
    productImage: HeadPhone,
  },
  {
    id: 2,
    productName: "Logitech G502 Hero Mouse",
    productImage: Iphone,
  },
  {
    id: 3,
    productName: "Apple iPhone 14 Pro",
    productImage: Iphone,
  },
  {
    id: 4,
    productName: "Dell XPS 15 Laptop",
    productImage: Laptop,
  },
];

const LiveOrderPopups = () => {
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  const handleClose = () => {
    setCurrentOrder(null);
  };

  useEffect(() => {
    const showRandomOrder = () => {
      const randomIndex = Math.floor(Math.random() * fakeOrders.length);
      setCurrentOrder(fakeOrders[randomIndex]);

      // Hide after 3 seconds
      setTimeout(() => setCurrentOrder(null), 4000);
    };

    // Initial popup after 3s
    const initialTimeout = setTimeout(showRandomOrder, 3000);

    // Loop every 10 seconds
    const interval = setInterval(showRandomOrder, 15000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  if (!currentOrder) return null;

  return (
    <div className="fixed bottom-2 left-3 lg:w-[320px] w-full md:w-1/3 z-40 bg-white shadow-lg rounded-lg p-4 flex items-center gap-4 animate-slideIn">
      {currentOrder.productImage && (
        <img
          src={currentOrder.productImage}
          alt={currentOrder.productName}
          className="w-12 h-12 object-cover rounded"
        />
      )}
      <div className="flex-1">
        <p className="text-sm font-bold">
          {currentOrder.productName} — ordered just now!
        </p>
      </div>
      <button
        onClick={handleClose}
        className="text-gray-400 top-1 fixed right-2 hover:text-gray-600 transition-colors"
        aria-label="Close notification"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};

export default LiveOrderPopups;
