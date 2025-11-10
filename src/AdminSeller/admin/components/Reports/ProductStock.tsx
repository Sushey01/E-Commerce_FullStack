import React from "react";

// Define the data type for the table
interface ProductStockData {
  name: string;
  stock: number;
}

// Mock data to render the table (matching your design structure)
const stockData: ProductStockData[] = [
  { name: "Lenovo V30a Business All-in-One Desktop", stock: 0 },
  { name: "Acer Chromebook Spin 314 Convertible Laptop", stock: 0 },
  { name: "StarTech.com USB 3.0 to Dual HDMI Adapter", stock: 0 },
  { name: "Razer Naga Pro Wireless Gaming Mouse", stock: 197 },
  { name: "Redragon S101 Wired RGB Backlit Gaming Keyboard", stock: 0 },
  { name: "SteelSeries QcK Gaming Mouse Pad", stock: 0 },
];

const ProductStock = () => {
  return (
    // Outer container matching the card design
    <div className="rounded-xl bg-white p-6 shadow-lg w-full max-w-7xl mx-auto">
      {/* Report Title */}
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Product wise stock report
      </h2>

      {/* Filter and Category Section */}
      <div className="flex items-center space-x-4 mb-8">
        <label className="text-sm font-medium text-gray-700">
          Sort by Category :
        </label>

        {/* Dropdown Input */}
        <select
          className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700"
          defaultValue=""
          style={{ width: "200px" }} // Custom width to match the design length
        >
          <option value="" disabled>
            Choose Category
          </option>
          <option value="laptops">Laptops</option>
          <option value="accessories">Accessories</option>
        </select>

        {/* Filter Button */}
        <button className="bg-blue-500 text-white font-medium py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition">
          Filter
        </button>
      </div>

      {/* Report Table */}
      <div className="overflow-x-auto border-t border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              {/* Product Name Column */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-3/4">
                Product Name
              </th>
              {/* Stock Column */}
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                Stock
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {stockData.map((product, index) => (
              <tr
                key={index}
                // Highlight row background slightly if stock is 0 (optional styling)
                className={
                  product.stock === 0 ? "bg-red-50" : "hover:bg-gray-50"
                }
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {product.name}
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold"
                  // Set text color based on stock count (red for 0, green for > 0)
                  style={{ color: product.stock === 0 ? "#ef4444" : "#10b981" }}
                >
                  {product.stock.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductStock;
