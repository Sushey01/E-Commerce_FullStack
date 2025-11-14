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
    <div className="fixed bottom-4 w-[300px] left-4 z-50 bg-blue-100 shadow-lg rounded-lg p-4 flex items-center gap-4 animate-slideIn">
      {currentOrder.productImage && (
        <img
          src={currentOrder.productImage}
          alt={currentOrder.productName}
          className="w-12 h-12 object-cover rounded"
        />
      )}
      <div>
        <p className="text-sm font-bold">
          {currentOrder.productName} — ordered just now!
        </p>
      </div>
    </div>
  );
};

export default LiveOrderPopups;
