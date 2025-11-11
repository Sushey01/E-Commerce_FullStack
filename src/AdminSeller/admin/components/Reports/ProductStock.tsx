import React, { useState, useEffect } from "react";
import Pagination from "../Pagination";
import { useProductStock } from "../../hooks/useProductStock";

const ProductStock = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { products, loading, error, totalCount, categories, fetchProducts } =
    useProductStock(itemsPerPage);

  useEffect(() => {
    fetchProducts(currentPage, selectedCategory);
  }, [currentPage]);

  const handleFilter = () => {
    setCurrentPage(1);
    fetchProducts(1, selectedCategory);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{ width: "200px" }}
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Filter Button */}
        <button
          onClick={handleFilter}
          className="bg-blue-500 text-white font-medium py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition"
        >
          Filter
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      )}

      {/* Report Table */}
      {!loading && (
        <>
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
                {products.length === 0 ? (
                  <tr>
                    <td
                      colSpan={2}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No products found
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr
                      key={product.id}
                      className={
                        (product.stock || 0) === 0
                          ? "bg-red-50"
                          : "hover:bg-gray-50"
                      }
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {product.product_name}
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold"
                        style={{
                          color:
                            (product.stock || 0) === 0 ? "#ef4444" : "#10b981",
                        }}
                      >
                        {(product.stock || 0).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalCount > 0 && (
            <Pagination
              currentPage={currentPage}
              pageSize={itemsPerPage}
              totalCount={totalCount}
              onPageChange={handlePageChange}
              label="products"
            />
          )}
        </>
      )}
    </div>
  );
};

export default ProductStock;
