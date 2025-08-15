import React, { useState } from "react";

const FilterByPrice = () => {

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice]=useState(100000);


  function handleApply(){
    if (minPrice<=maxPrice){
      onFilter?.({min:minPrice, max:maxPrice});
    }else{
      alert("Min price should be less than or equal to Max price")
    }
  }

  return (
    <div className="flex flex-col gap-3 py-3">
      <h2 className="py-2 text-lg text-black">Filter By Price</h2>

      {/* Input Section */}
      <div className="flex flex-col w-full sm:flex-row gap-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700">Min Price</p>
          <input
            type="number"
            placeholder="0.00"
            className="w-full  px-3 border border-gray-300 rounded bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700">Max Price</p>
          <input
            type="number"
            max={1000000}
            placeholder="10,00,000"
            className="w-full  px-3 border border-gray-300 rounded bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Range bar (visual) */}
      <div className="flex items-center w-full">
        <button className="border rounded-full w-5 h-5 bg-teal-500"></button>
        <div className="flex-grow border-t-4 border-teal-500 mx-2" />
        <button className="border rounded-full w-5 h-5 bg-teal-500"></button>
      </div>
    </div>
  );
};

export default FilterByPrice;


// import React, { useState } from "react";

// const FilterByPrice = ({ onFilter }) => {
//   const [minPrice, setMinPrice] = useState(0);
//   const [maxPrice, setMaxPrice] = useState(100000);

//   const handleApply = () => {
//     if (minPrice <= maxPrice) {
//       onFilter?.({ min: minPrice, max: maxPrice });
//     } else {
//       alert("⚠️ Min price should be less than or equal to Max price");
//     }
//   };

//   return (
//     <div className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow-md">
//       <h2 className="text-lg font-semibold text-gray-800">Filter By Price</h2>

//       {/* Inputs */}
//       <div className="flex flex-col sm:flex-row gap-4">
//         <div className="flex-1">
//           <label className="text-sm font-medium text-gray-700">Min Price</label>
//           <input
//             type="number"
//             value={minPrice}
//             min={0}
//             onChange={(e) => setMinPrice(Number(e.target.value))}
//             placeholder="0"
//             className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
//           />
//         </div>

//         <div className="flex-1">
//           <label className="text-sm font-medium text-gray-700">Max Price</label>
//           <input
//             type="number"
//             value={maxPrice}
//             max={1000000}
//             onChange={(e) => setMaxPrice(Number(e.target.value))}
//             placeholder="1,000,000"
//             className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
//           />
//         </div>
//       </div>

//       {/* Range Slider */}
//       <div className="flex flex-col gap-2">
//         <input
//           type="range"
//           min="0"
//           max="1000000"
//           step="1000"
//           value={minPrice}
//           onChange={(e) => setMinPrice(Number(e.target.value))}
//           className="w-full accent-teal-500"
//         />
//         <input
//           type="range"
//           min="0"
//           max="1000000"
//           step="1000"
//           value={maxPrice}
//           onChange={(e) => setMaxPrice(Number(e.target.value))}
//           className="w-full accent-teal-500"
//         />

//         <div className="flex justify-between text-sm text-gray-600">
//           <span>₹{minPrice.toLocaleString()}</span>
//           <span>₹{maxPrice.toLocaleString()}</span>
//         </div>
//       </div>

//       {/* Apply Button */}
//       <button
//         onClick={handleApply}
//         className="mt-2 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition"
//       >
//         Apply
//       </button>
//     </div>
//   );
// };

// export default FilterByPrice;

