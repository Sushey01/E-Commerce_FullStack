// src/components/SalesOverallList.tsx
import React, { useState } from "react";
import Pagination from "../Pagination";
import useOrders, { OrderItemRow } from "../../hooks/useOrders";

// --- Helper Row for order_items ---
interface OrderRowProps {
  item: OrderItemRow;
  onView: (orderId: string) => void;
  onDownload: (orderId: string) => void;
  onCancel: (orderId: string) => void;
  onSelect: (orderId: string, isChecked: boolean) => void;
  isSelected: boolean;
}

const OrderRow: React.FC<OrderRowProps> = ({
  item,
  onView,
  onDownload,
  onCancel,
  onSelect,
  isSelected,
}) => {
  const [open, setOpen] = useState(false);
  const toggleMenu = () => setOpen((v) => !v);
  const closeMenu = () => setOpen(false);
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="p-4 text-center">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(item.order_id, e.target.checked)}
          className="form-checkbox h-4 w-4 text-indigo-600 rounded"
        />
      </td>
      <td className="p-4 text-gray-800 font-medium whitespace-nowrap">
        {item.order_id}
      </td>
      <td className="p-4 text-gray-700 whitespace-nowrap">
        {item.product?.title ?? "Unknown product"}
      </td>
      <td className="p-4 text-center text-gray-700">{item.quantity}</td>
      <td className="p-4 text-gray-800 font-medium whitespace-nowrap">
        ${Number(item.price ?? 0).toFixed(2)}
      </td>
      <td className="p-4 whitespace-nowrap">
        <div className="relative inline-block text-left">
          <button
            onClick={toggleMenu}
            className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-haspopup="true"
            aria-expanded={open}
            title="Actions"
          >
            {/* Kebab icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 5.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
            </svg>
          </button>
          {open && (
            <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1 text-sm">
                <button
                  onClick={() => {
                    onView(item.order_id);
                    closeMenu();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-indigo-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  View
                </button>
                <button
                  onClick={() => {
                    onDownload(item.order_id);
                    closeMenu();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-blue-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Download
                </button>
                <button
                  onClick={() => {
                    onCancel(item.order_id);
                    closeMenu();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 01-2 0v6a1 1 0 112 0V8z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

// (Removed DUMMY_ORDERS; now using Supabase-backed hook)

// --- Main Component: SalesOverallList ---
const SalesOverallList: React.FC = () => {
  const {
    orders,
    loading,
    error,
    totalCount,
    currentPage,
    pageSize,
    fetchOrders,
    deleteOrderItem,
  } = useOrders();
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());

  // --- Bulk Selection Handlers ---
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allOrderIds = new Set(orders.map((o) => o.order_id));
      setSelectedOrders(allOrderIds);
    } else {
      setSelectedOrders(new Set());
    }
  };

  const handleSelectOrder = (orderId: string, isChecked: boolean) => {
    const newSelection = new Set(selectedOrders);
    if (isChecked) {
      newSelection.add(orderId);
    } else {
      newSelection.delete(orderId);
    }
    setSelectedOrders(newSelection);
  };

  // --- Action Handlers ---
  const handleView = (id: string) => {
    console.log(`Viewing order: ${id}`);
  };
  const handleDownload = (id: string) => {
    console.log(`Downloading invoice for order: ${id}`);
  };
  const handleCancel = async (id: string) => {
    if (window.confirm(`Are you sure you want to cancel order ${id}?`)) {
      await deleteOrderItem(id);
      setSelectedOrders((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };
  const handleBulkAction = (action: string) => {
    if (action && selectedOrders.size > 0) {
      alert(
        `Performing bulk action "${action}" on ${
          selectedOrders.size
        } orders. IDs: ${Array.from(selectedOrders).join(", ")}`
      );
      // Add your actual bulk processing logic here
    }
  };

  const isAllSelected =
    orders.length > 0 && selectedOrders.size === orders.length;

  return (
    <div className="p-4 bg-white shadow-lg rounded-xl">
      <div className="space-y-4">
        {/* Title and Description */}
        <h3 className="text-xl font-bold text-gray-900">All Order Items</h3>
        <div className="text-sm text-gray-500">
          Connected to Supabase order_items with pagination. ({totalCount} total
          items)
        </div>
      </div>

      <div className="mt-4">
        {/* --- Top Toolbar: Filters and Actions --- */}
        <div className="p-4 border-y border-gray-200 flex flex-wrap items-center gap-4 bg-gray-50">
          {/* Bulk Action Dropdown */}
          <div className="relative">
            <select
              onChange={(e) => handleBulkAction(e.target.value)}
              className="appearance-none border border-gray-300 rounded-lg py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-8 text-sm"
              disabled={selectedOrders.size === 0}
            >
              <option value="">Bulk Action ({selectedOrders.size})</option>
              <option value="delete">Delete Selected</option>
              <option value="mark_paid">Mark Paid</option>
            </select>
          </div>

          {/* Filter Dropdowns and Search (Simplified) */}
          <div className="flex gap-2 ml-auto">
            <select className="border border-gray-300 rounded-lg py-2 px-3 text-gray-700 text-sm">
              <option value="">Filter by Date</option>
              <option value="">Last 7 days </option>
              <option value="">This Month </option>
              <option value="">Past Three months </option>
              {/* Date options */}
            </select>

            <select className="border border-gray-300 rounded-lg py-2 px-3 text-gray-700 text-sm">
              <option value="">Filter by Status </option>
              <option value="">Pending </option>
              <option value="">Confirmed </option>
              <option value="">On the way </option>
              <option value="">Delivered </option>
              <option value="">Cancelled </option>
            </select>

            <select className="border border-gray-300 rounded-lg py-2 px-3 text-gray-700 text-sm">
              <option value="">Filter by Payment</option>
              <option value="">Paid</option>
              <option value="">UnPaid</option>
              {/* Payment status options */}
            </select>

            <input
              type="text"
              placeholder="Type Order code"
              className="border border-gray-300 rounded-lg py-2 px-3 text-gray-700 text-sm w-48"
            />

            <button className="bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
              Filter
            </button>
          </div>
        </div>

        {/* --- Table Container --- */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            {/* Table Head */}
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-center w-12">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-indigo-600 rounded"
                    onChange={handleSelectAll}
                    checked={isAllSelected}
                    // Indeterminate state for partial selection is not handled here
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Options
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="bg-white divide-y divide-gray-200">
              {loading && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-gray-500">
                    Loading order items...
                  </td>
                </tr>
              )}
              {!loading && error && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-red-600">
                    {error}
                  </td>
                </tr>
              )}
              {!loading && !error && orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-gray-500">
                    No order items found.
                  </td>
                </tr>
              )}
              {!loading &&
                !error &&
                orders.length > 0 &&
                orders.map((item) => (
                  <OrderRow
                    key={`${item.order_id}-${item.product_id}`}
                    item={item}
                    onView={handleView}
                    onDownload={handleDownload}
                    onCancel={handleCancel}
                    onSelect={handleSelectOrder}
                    isSelected={selectedOrders.has(item.order_id)}
                  />
                ))}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalCount={totalCount}
          label="order items"
          onPageChange={(p: number) => fetchOrders(Math.max(1, p))}
        />
      </div>
    </div>
  );
};

export default SalesOverallList;
