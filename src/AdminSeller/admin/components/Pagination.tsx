// import React from 'react'

// const Pagination = () => {
//   return (
//   {/* Pagination */}
//         <div className="px-4 py-3 border-t flex items-center justify-between">
//           <div className="text-sm text-gray-700">
//             Showing{" "}
//             <span className="font-medium">
//               {filteredCategories.length > 0
//                 ? (currentPage - 1) * pageSize + 1
//                 : 0}
//             </span>{" "}
//             to{" "}
//             <span className="font-medium">
//               {Math.min(currentPage * pageSize, totalCount)}
//             </span>{" "}
//             of <span className="font-medium">{totalCount}</span> categories
//           </div>
//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => handlePageChange(currentPage - 1)}
//               disabled={currentPage === 1}
//               className="px-3 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Previous
//             </button>
//             <div className="flex items-center gap-1">
//               {Array.from({ length: totalPages }, (_, i) => i + 1).map(
//                 (page) => (
//                   <button
//                     key={page}
//                     onClick={() => handlePageChange(page)}
//                     className={`px-3 py-1 text-sm border rounded ${
//                       currentPage === page
//                         ? "bg-blue-600 text-white border-blue-600"
//                         : "hover:bg-gray-100"
//                     }`}
//                   >
//                     {page}
//                   </button>
//                 )
//               )}
//             </div>
//             <button
//               onClick={() => handlePageChange(currentPage + 1)}
//               disabled={totalPages === 0 || currentPage === totalPages}
//               className="px-3 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//   )
// }

// export default Pagination
