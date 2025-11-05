import React from "react";

type PaginationProps = {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  label?: string; // e.g., "items", "products", "orders"
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  pageSize,
  totalCount,
  onPageChange,
  label = "items",
}) => {
  const totalPages = Math.max(
    1,
    Math.ceil((totalCount || 0) / (pageSize || 1))
  );
  const start = totalCount > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const end = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="px-4 py-3 border-t flex items-center justify-between">
      <div className="text-sm text-gray-700">
        Showing <span className="font-medium">{start}</span> to{" "}
        <span className="font-medium">{end}</span> of{" "}
        <span className="font-medium">{totalCount}</span> {label}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="px-3 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 text-sm border rounded ${
                currentPage === page
                  ? "bg-blue-600 text-white border-blue-600"
                  : "hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="px-3 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
