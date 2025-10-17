import React, { useState } from "react";

const initReviews = [
  {
    id: "r1",
    product: "Laptop Pro 15",
    rating: 5,
    date: "2025-10-02",
    text: "Amazing performance!",
  },
  {
    id: "r2",
    product: "Wireless Mouse",
    rating: 4,
    date: "2025-09-28",
    text: "Comfortable and responsive.",
  },
];

const Star = ({ filled }) => (
  <span className={filled ? "text-yellow-500" : "text-gray-300"}>★</span>
);

const MyReviews = () => {
  const [reviews, setReviews] = useState(initReviews);

  const remove = (id) => setReviews((prev) => prev.filter((r) => r.id !== id));

  return (
    <div className="p-2 space-y-3">
      <h2 className="text-xl font-semibold">My Reviews</h2>
      {reviews.length === 0 ? (
        <p className="text-gray-600 text-sm">
          You haven't posted any reviews yet.
        </p>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="border rounded p-3">
              <div className="flex justify-between">
                <p className="font-medium">{r.product}</p>
                <span className="text-xs text-gray-500">{r.date}</span>
              </div>
              <div className="text-yellow-500">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star key={n} filled={n <= r.rating} />
                ))}
              </div>
              <p className="text-sm text-gray-700 mt-1">{r.text}</p>
              <div className="text-right">
                <button
                  className="text-sm text-red-600"
                  onClick={() => remove(r.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReviews;
