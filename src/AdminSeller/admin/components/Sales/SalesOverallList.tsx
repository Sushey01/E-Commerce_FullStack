// // src/components/SalesOverallList.tsx
// import React, { useState } from "react";

// // --- Type Definition (Normally in src/types/Order.ts) ---
// interface Order {
//   id: string;
//   order_code: string;
//   num_products: number;
//   customer_name: string;
//   seller_name: string;
//   amount: number;
//   delivery_status: "Delivered" | "Pending" | "Canceled";
//   payment_status: "Paid" | "Unpaid" | "Refunded";
//   refund_status: "No Refund" | "Requested" | "Processed";
//   is_new?: boolean;
// }

// // --- Helper Component: OrderStatusBadge ---
// interface OrderStatusBadgeProps {
//   status:
//     | Order["payment_status"]
//     | Order["delivery_status"]
//     | Order["refund_status"];
// }

// const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
//   let badgeClasses =
//     "py-1 px-3 text-xs font-semibold rounded-full whitespace-nowrap";

//   switch (status) {
//     case "Paid":
//     case "Delivered":
//     case "Processed":
//       badgeClasses += " bg-green-100 text-green-700";
//       break;
//     case "Unpaid":
//     case "Pending":
//     case "Requested":
//       badgeClasses += " bg-red-100 text-red-700";
//       break;
//     case "Canceled":
//     case "Refunded":
//     case "No Refund":
//     default:
//       badgeClasses += " bg-gray-100 text-gray-700";
//       break;
//   }

//   return <span className={badgeClasses}>{status}</span>;
// };

// // --- Helper Component: OrderRow ---
// interface OrderRowProps {
//   order: Order;
//   onView: (id: string) => void;
//   onDownload: (id: string) => void;
//   onCancel: (id: string) => void;
//   onSelect: (id: string, isChecked: boolean) => void;
//   isSelected: boolean;
// }

// const OrderRow: React.FC<OrderRowProps> = ({
//   order,
//   onView,
//   onDownload,
//   onCancel,
//   onSelect,
//   isSelected,
// }) => {
//   return (
//     <tr className="border-b hover:bg-gray-50">
//       {/* Checkbox Column */}
//       <td className="p-4 text-center">
//         <input
//           type="checkbox"
//           checked={isSelected}
//           onChange={(e) => onSelect(order.id, e.target.checked)}
//           className="form-checkbox h-4 w-4 text-indigo-600 rounded"
//         />
//       </td>

//       {/* Order Code */}
//       <td className="p-4 text-gray-800 font-medium whitespace-nowrap">
//         {order.order_code}
//         {order.is_new && (
//           <span className="ml-2 py-0.5 px-2 text-xs font-semibold rounded-full bg-purple-100 text-purple-700">
//             new
//           </span>
//         )}
//       </td>

//       {/* Num. of Products */}
//       <td className="p-4 text-center text-gray-700">{order.num_products}</td>

//       {/* Customer */}
//       <td className="p-4 text-gray-700 whitespace-nowrap">
//         {order.customer_name}
//       </td>

//       {/* Seller */}
//       <td className="p-4 text-gray-700 whitespace-nowrap">
//         {order.seller_name}
//       </td>

//       {/* Amount */}
//       <td className="p-4 text-gray-800 font-medium whitespace-nowrap">
//         ${order.amount.toFixed(3)}
//       </td>

//       {/* Delivery Status */}
//       <td className="p-4">
//         <OrderStatusBadge status={order.delivery_status} />
//       </td>

//       {/* Payment Method */}
//       <td className="p-4 text-gray-700 whitespace-nowrap">
//         {order.payment_method}
//       </td>

//       {/* Payment Status */}
//       <td className="p-4">
//         <OrderStatusBadge status={order.payment_status} />
//       </td>

//       {/* Refund */}
//       <td className="p-4 text-gray-700 whitespace-nowrap">
//         {order.refund_status}
//       </td>

//       {/* Options (Action Icons) */}
//       <td className="p-4 space-x-2 whitespace-nowrap flex">
//         {/* View Icon (Eye) */}
//         <button
//           onClick={() => onView(order.id)}
//           className="p-1 rounded-full text-indigo-600 hover:bg-indigo-50"
//           title="View Order"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-5 w-5"
//             viewBox="0 0 20 20"
//             fill="currentColor"
//           >
//             <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
//             <path
//               fillRule="evenodd"
//               d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
//               clipRule="evenodd"
//             />
//           </svg>
//         </button>
//         {/* Download Icon */}
//         <button
//           onClick={() => onDownload(order.id)}
//           className="p-1 rounded-full text-blue-600 hover:bg-blue-50"
//           title="Download Invoice"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-5 w-5"
//             viewBox="0 0 20 20"
//             fill="currentColor"
//           >
//             <path
//               fillRule="evenodd"
//               d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
//               clipRule="evenodd"
//             />
//           </svg>
//         </button>
//         {/* Cancel/Trash Icon */}
//         <button
//           onClick={() => onCancel(order.id)}
//           className="p-1 rounded-full text-red-600 hover:bg-red-50"
//           title="Cancel Order"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-5 w-5"
//             viewBox="0 0 20 20"
//             fill="currentColor"
//           >
//             <path
//               fillRule="evenodd"
//               d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 01-2 0v6a1 1 0 112 0V8z"
//               clipRule="evenodd"
//             />
//           </svg>
//         </button>
//       </td>
//     </tr>
//   );
// };

// // --- DUMMY DATA ---
// const DUMMY_ORDERS: Order[] = [
//   {
//     id: "o1",
//     order_code: "20251022-1200358",
//     num_products: 1,
//     customer_name: "Paul K. Jensen",
//     seller_name: "Inhouse Order",
//     amount: 10.39,
//     delivery_status: "Delivered",
//     payment_method: "Cash On Delivery",
//     payment_status: "Paid",
//     refund_status: "No Refund",
//     is_new: false,
//   },
//   {
//     id: "o2",
//     order_code: "20251019-14112053",
//     num_products: 1,
//     customer_name: "Sarah M. Lee",
//     seller_name: "Filon Asset Store",
//     amount: 59.0,
//     delivery_status: "Pending",
//     payment_method: "DBBL",
//     payment_status: "Unpaid",
//     refund_status: "No Refund",
//     is_new: false,
//   },
//   {
//     id: "o3",
//     order_code: "20251019-14112084",
//     num_products: 3,
//     customer_name: "Adam R. Smith",
//     seller_name: "Inhouse Order",
//     amount: 521.1,
//     delivery_status: "Pending",
//     payment_method: "DBBL",
//     payment_status: "Unpaid",
//     refund_status: "No Refund",
//     is_new: true,
//   },
//   {
//     id: "o4",
//     order_code: "20251018-9005512",
//     num_products: 2,
//     customer_name: "Jane A. Doe",
//     seller_name: "Tech Gadgets Inc.",
//     amount: 150.75,
//     delivery_status: "Delivered",
//     payment_method: "Credit Card",
//     payment_status: "Paid",
//     refund_status: "Requested",
//     is_new: false,
//   },
// ];

// // --- Main Component: SalesOverallList ---
// const SalesOverallList: React.FC = () => {
//   const [orders, setOrders] = useState<Order[]>(DUMMY_ORDERS);
//   const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());

//   // --- Bulk Selection Handlers ---
//   const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.checked) {
//       const allOrderIds = new Set(orders.map((order) => order.id));
//       setSelectedOrders(allOrderIds);
//     } else {
//       setSelectedOrders(new Set());
//     }
//   };

//   const handleSelectOrder = (orderId: string, isChecked: boolean) => {
//     const newSelection = new Set(selectedOrders);
//     if (isChecked) {
//       newSelection.add(orderId);
//     } else {
//       newSelection.delete(orderId);
//     }
//     setSelectedOrders(newSelection);
//   };

//   // --- Action Handlers ---
//   const handleView = (id: string) => {
//     console.log(`Viewing order: ${id}`);
//   };
//   const handleDownload = (id: string) => {
//     console.log(`Downloading invoice for order: ${id}`);
//   };
//   const handleCancel = (id: string) => {
//     if (window.confirm(`Are you sure you want to cancel order ${id}?`)) {
//       setOrders(orders.filter((order) => order.id !== id));
//       setSelectedOrders((prev) => {
//         prev.delete(id);
//         return new Set(prev);
//       });
//     }
//   };
//   const handleBulkAction = (action: string) => {
//     if (action && selectedOrders.size > 0) {
//       alert(
//         `Performing bulk action "${action}" on ${
//           selectedOrders.size
//         } orders. IDs: ${Array.from(selectedOrders).join(", ")}`
//       );
//       // Add your actual bulk processing logic here
//     }
//   };

//   const isAllSelected =
//     orders.length > 0 && selectedOrders.size === orders.length;

//   return (
//     <div className="p-4 bg-white shadow-lg rounded-xl">
//       <div className="space-y-4">
//         {/* Title and Description */}
//         <h3 className="text-xl font-bold text-gray-900">All Orders</h3>
//         <div className="text-sm text-gray-500">
//           Hook up to Supabase orders to list recent orders and totals. (
//           {orders.length} Total Orders)
//         </div>
//       </div>

//       <div className="mt-4">
//         {/* --- Top Toolbar: Filters and Actions --- */}
//         <div className="p-4 border-y border-gray-200 flex flex-wrap items-center gap-4 bg-gray-50">
//           {/* Bulk Action Dropdown */}
//           <div className="relative">
//             <select
//               onChange={(e) => handleBulkAction(e.target.value)}
//               className="appearance-none border border-gray-300 rounded-lg py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-8 text-sm"
//               disabled={selectedOrders.size === 0}
//             >
//               <option value="">Bulk Action ({selectedOrders.size})</option>
//               <option value="delete">Delete Selected</option>
//               <option value="mark_paid">Mark Paid</option>
//             </select>
//           </div>

//           {/* Filter Dropdowns and Search (Simplified) */}
//           <div className="flex gap-2 ml-auto">
//             <select className="border border-gray-300 rounded-lg py-2 px-3 text-gray-700 text-sm">
//               <option value="">Filter by Date</option>
//               {/* Date options */}
//             </select>

//             <select className="border border-gray-300 rounded-lg py-2 px-3 text-gray-700 text-sm">
//               <option value="">Filter by Payment</option>
//               {/* Payment status options */}
//             </select>

//             <input
//               type="text"
//               placeholder="Type Order code"
//               className="border border-gray-300 rounded-lg py-2 px-3 text-gray-700 text-sm w-48"
//             />

//             <button className="bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
//               Filter
//             </button>
//           </div>
//         </div>

//         {/* --- Table Container --- */}
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             {/* Table Head */}
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-4 py-3 text-center w-12">
//                   <input
//                     type="checkbox"
//                     className="form-checkbox h-4 w-4 text-indigo-600 rounded"
//                     onChange={handleSelectAll}
//                     checked={isAllSelected}
//                     // Indeterminate state for partial selection is not handled here
//                   />
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Order Code
//                 </th>
//                 <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Products
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Customer
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Seller
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Amount
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Delivery Status
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Payment Method
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Payment Status
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Refund
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Options
//                 </th>
//               </tr>
//             </thead>

//             {/* Table Body */}
//             <tbody className="bg-white divide-y divide-gray-200">
//               {orders.map((order) => (
//                 <OrderRow
//                   key={order.id}
//                   order={order}
//                   onView={handleView}
//                   onDownload={handleDownload}
//                   onCancel={handleCancel}
//                   onSelect={handleSelectOrder}
//                   isSelected={selectedOrders.has(order.id)}
//                 />
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SalesOverallList;
