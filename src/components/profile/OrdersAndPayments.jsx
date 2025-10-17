import React, { useEffect, useState } from "react";

const sampleOrders = [
  { id: "ORD-10021", date: "2025-10-01", total: 1299, status: "Delivered" },
  { id: "ORD-10022", date: "2025-10-05", total: 499, status: "Shipped" },
  { id: "ORD-10023", date: "2025-10-10", total: 2599, status: "Processing" },
];

const OrdersAndPayments = () => {
  const [cards, setCards] = useState([]);
  const [cardForm, setCardForm] = useState({
    holder: "",
    number: "",
    expiry: "",
    brand: "",
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedCards") || "[]");
    setCards(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("savedCards", JSON.stringify(cards));
  }, [cards]);

  const addCard = (e) => {
    e.preventDefault();
    if (!cardForm.holder || !cardForm.number || !cardForm.expiry) return;
    const id = crypto.randomUUID();
    setCards((prev) => [...prev, { id, ...cardForm }]);
    setCardForm({ holder: "", number: "", expiry: "", brand: "" });
  };

  const removeCard = (id) =>
    setCards((prev) => prev.filter((c) => c.id !== id));

  return (
    <div className="p-2 space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Recent Orders</h2>
        <div className="mt-2 overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border p-2 text-left">Order ID</th>
                <th className="border p-2 text-left">Date</th>
                <th className="border p-2 text-left">Total</th>
                <th className="border p-2 text-left">Status</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {sampleOrders.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50">
                  <td className="border p-2">{o.id}</td>
                  <td className="border p-2">{o.date}</td>
                  <td className="border p-2">Rs. {o.total}</td>
                  <td className="border p-2">{o.status}</td>
                  <td className="border p-2 text-blue-600 hover:underline cursor-pointer">
                    View
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold">Saved Payment Methods</h2>
        <div className="grid md:grid-cols-2 gap-4 mt-2">
          {cards.map((c) => (
            <div key={c.id} className="border rounded p-3">
              <p className="font-medium">
                {c.brand || "Card"} •••• {c.number.slice(-4)}
              </p>
              <p className="text-sm text-gray-600">Holder: {c.holder}</p>
              <p className="text-sm text-gray-600">Expiry: {c.expiry}</p>
              <button
                className="mt-2 text-sm text-red-600"
                onClick={() => removeCard(c.id)}
              >
                Remove
              </button>
            </div>
          ))}
          <form onSubmit={addCard} className="border rounded p-3 space-y-2">
            <p className="font-medium">Add new card</p>
            <input
              className="border rounded w-full p-2 text-sm"
              placeholder="Cardholder Name"
              value={cardForm.holder}
              onChange={(e) =>
                setCardForm({ ...cardForm, holder: e.target.value })
              }
            />
            <input
              className="border rounded w-full p-2 text-sm"
              placeholder="Card Number"
              value={cardForm.number}
              onChange={(e) =>
                setCardForm({ ...cardForm, number: e.target.value })
              }
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                className="border rounded w-full p-2 text-sm"
                placeholder="MM/YY"
                value={cardForm.expiry}
                onChange={(e) =>
                  setCardForm({ ...cardForm, expiry: e.target.value })
                }
              />
              <input
                className="border rounded w-full p-2 text-sm"
                placeholder="Brand (Visa/Mastercard)"
                value={cardForm.brand}
                onChange={(e) =>
                  setCardForm({ ...cardForm, brand: e.target.value })
                }
              />
            </div>
            <button
              type="submit"
              className="px-3 py-1 rounded bg-blue-600 text-white text-sm"
            >
              Save Card
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrdersAndPayments;
