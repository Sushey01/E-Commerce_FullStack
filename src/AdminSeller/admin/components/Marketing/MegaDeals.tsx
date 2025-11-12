import React, { useState, useRef, useEffect, useCallback } from "react";
import { Plus, Minus, Pencil, Trash2, MoreVertical } from "lucide-react";
import Pagination from "../Pagination";
import NewMegaDealForm from "./NewMegaDealForm";

// ===================================================================
// 1. DATA AND INTERFACES
// ===================================================================

interface MegaDealItem {
  id: number;
  title: string;
  bannerUrl: string;
  startDate: string; // Format: DD-MM-YYYY HH:mm:ss
  endDate: string; // Format: DD-MM-YYYY HH:mm:ss
  status: boolean;
  featured: boolean;
  pageLink: string;
}

const initialMegaDealsData: MegaDealItem[] = [
  {
    id: 1,
    title: "Mega Sale",
    bannerUrl: "Banner for Flash Sale",
    startDate: "01-11-2023 00:00:00",
    endDate: "06-01-2024 23:59:59",
    status: true,
    featured: false,
    pageLink:
      "https://demo.activeitzone.com/ecommerce/flash-deal/end-of-season-sale-qd2y1",
  },
  {
    id: 2,
    title: "Mega Deal",
    bannerUrl: "Banner for Flash Deal",
    startDate: "27-04-2022 00:00:00",
    endDate: "27-04-2025 23:59:59",
    status: true,
    featured: false,
    pageLink:
      "https://demo.activeitzone.com/ecommerce/flash-deal/flash-deal-1wfsn",
  },
  {
    id: 3,
    title: "Electronic",
    bannerUrl: "Banner for Electronic Deal",
    startDate: "27-04-2022 00:00:00",
    endDate: "27-04-2025 23:59:59",
    status: false,
    featured: true,
    pageLink:
      "https://demo.activeitzone.com/ecommerce/flash-deal/electronic-7dgml",
  },
  {
    id: 4,
    title: "Winter Sale",
    bannerUrl: "Banner for Winter Sale",
    startDate: "01-01-2021 00:00:00",
    endDate: "01-12-2025 23:59:59",
    status: true,
    featured: true,
    pageLink:
      "https://demo.activeitzone.com/ecommerce/flash-deal/winter-sale-abcd",
  },
];

// ===================================================================
// 2. CHILD COMPONENTS (ActionMenu only)
// ===================================================================

interface ActionMenuProps {
  id: number;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const ActionMenu: React.FC<ActionMenuProps> = ({
  id,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20 origin-top-right"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="py-1">
        <button
          onClick={() => {
            onEdit(id);
            onClose();
          }}
          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
        >
          <Pencil className="h-4 w-4 mr-2" /> Edit
        </button>
        <button
          onClick={() => {
            onDelete(id);
            onClose();
          }}
          className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
        >
          <Trash2 className="h-4 w-4 mr-2" /> Delete
        </button>
      </div>
    </div>
  );
};

// ===================================================================
// 3. MAIN COMPONENT (FlashDeals)
// ===================================================================

const MegaDeals: React.FC = () => {
  const [megaDeals, setMegaDeals] =
    useState<MegaDealItem[]>(initialMegaDealsData);
  const [viewMode, setViewMode] = useState<"list" | "create">("list");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // --- Data Manipulation Handlers ---
  const handleStatusToggle = useCallback(
    (id: number, key: "status" | "featured") => {
      setMegaDeals((prevDeals) =>
        prevDeals.map((deal) =>
          deal.id === id ? { ...deal, [key]: !deal[key] } : deal
        )
      );
    },
    []
  );

  const handleAddNewDeal = (formData: any) => {
    const newId =
      megaDeals.length > 0 ? Math.max(...megaDeals.map((d) => d.id)) + 1 : 1;

    const newDeal: MegaDealItem = {
      id: newId,
      title: formData.title,
      bannerUrl: `Banner for ${formData.title}`,
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: formData.status,
      featured: formData.featured,
      pageLink: `#deal-${newId}`,
    };

    setMegaDeals((prevDeals) => [...prevDeals, newDeal]);
    setViewMode("list");
  };

  const handleEdit = (id: number) => {
    console.log(`Edit deal: ${id}`);
    setOpenMenuId(null);
  };

  const handleDelete = (id: number) => {
    setMegaDeals((prevDeals) => prevDeals.filter((deal) => deal.id !== id));
    setOpenMenuId(null);
    console.log(`Deleted deal: ${id}`);
  };

  const handleCloseMenu = () => setOpenMenuId(null);
  const toggleMenu = (id: number) => {
    setOpenMenuId((prevId) => (prevId === id ? null : id));
  };
  const toggleExpansion = (id: number) => {
    setExpandedId((prevId) => (prevId === id ? null : id));
  };

  const renderToggle = (id: number) => {
    const Icon = expandedId === id ? Minus : Plus;
    return (
      <Icon
        className="h-4 w-4 text-purple-500 cursor-pointer lg:hidden"
        onClick={(e) => {
          e.stopPropagation();
          toggleExpansion(id);
        }}
      />
    );
  };

  const renderStatusToggle = (
    id: number,
    key: "status" | "featured",
    isChecked: boolean
  ) => (
    <div
      className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
        isChecked ? "bg-green-500 justify-end" : "bg-gray-300 justify-start"
      }`}
      onClick={(e) => {
        e.stopPropagation();
        handleStatusToggle(id, key);
      }}
    >
      <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
    </div>
  );

  const getPlaceholderImage = (id: number) =>
    `https://picsum.photos/seed/${id}/60/40`;

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedDeals = megaDeals.slice(startIndex, endIndex);

  if (viewMode === "create") {
    return (
      <NewMegaDealForm
        onCancel={() => setViewMode("list")}
        onSubmit={handleAddNewDeal}
      />
    );
  }

  // --- LIST VIEW ---
  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-4 font-sans bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center py-2">
        <h1 className="text-xl font-bold text-gray-800">All Mega Deals</h1>
        <button
          onClick={() => setViewMode("create")}
          className="hover:bg-purple-600 text-sm bg-purple-500 border rounded-full px-4 py-2 text-white font-medium transition duration-150 shadow-lg shadow-purple-300 transform hover:scale-[1.02]"
        >
          Create New Mega Deal
        </button>
      </div>

      <div className="bg-white border rounded-xl flex flex-col md:flex-row justify-between items-center p-4 shadow-md">
        <h2 className="text-sm font-medium text-gray-800 mb-2 md:mb-0">
          Mega Deals ({megaDeals.length})
        </h2>
        <input
          type="text"
          placeholder="Type name & Enter"
          className="border border-gray-300 p-2 text-sm rounded-lg text-gray-700 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
        />
      </div>

      {/* === TABLE === */}
      <div className="bg-white rounded-xl shadow-2xl overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              <th className="px-6 py-3">#</th>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3 hidden lg:table-cell">Banner</th>
              <th className="px-6 py-3 hidden lg:table-cell">Start Date</th>
              <th className="px-6 py-3 hidden lg:table-cell">End Date</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 hidden lg:table-cell">Featured</th>
              <th className="px-6 py-3 hidden lg:table-cell">Page Link</th>
              <th className="px-6 py-3 text-right">Options</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedDeals.map((item) => (
              <React.Fragment key={item.id}>
                <tr className="hover:bg-purple-50/50 transition  duration-100">
                  <td className="px-6 py-6 text-sm text-gray-500 flex items-center gap-2">
                    <span className="lg:hidden">{renderToggle(item.id)}</span>
                    {item.id}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {item.title}
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <img
                      src={getPlaceholderImage(item.id)}
                      alt={item.bannerUrl}
                      className="w-12 h-8 object-cover rounded shadow-sm ring-1 ring-gray-200"
                    />
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell text-sm text-gray-700">
                    {item.startDate.split(" ")[0]}
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell text-sm text-gray-700">
                    {item.endDate.split(" ")[0]}
                  </td>
                  <td className="px-6 py-4">
                    {renderStatusToggle(item.id, "status", item.status)}
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    {renderStatusToggle(item.id, "featured", item.featured)}
                  </td>
                  <td className="px-6 py-4 text-xs text-blue-600 truncate hidden lg:table-cell">
                    <a
                      href={item.pageLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {item.pageLink.substring(0, 40)}...
                    </a>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="relative inline-block">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMenu(item.id);
                        }}
                        className="text-gray-500 hover:text-purple-700 p-1 rounded-full hover:bg-gray-100 transition"
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>
                      <ActionMenu
                        id={item.id}
                        isOpen={openMenuId === item.id}
                        onClose={handleCloseMenu}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    </div>
                  </td>
                </tr>

                {/* MOBILE EXPANSION */}
                {expandedId === item.id && (
                  <tr className="bg-gray-50 lg:hidden border-t border-gray-200">
                    <td
                      colSpan={5}
                      className="px-6 py-4 text-sm text-gray-700 space-y-2"
                    >
                      <p className="font-bold text-gray-800 mb-2">
                        Deal Details:
                      </p>
                      <div className="flex items-center space-x-4">
                        <strong>Banner:</strong>
                        <img
                          src={getPlaceholderImage(item.id)}
                          alt={item.bannerUrl}
                          className="w-20 h-10 object-cover rounded shadow-md ring-1 ring-gray-200"
                        />
                      </div>
                      <p>
                        <strong>Start Date:</strong> {item.startDate}
                      </p>
                      <p>
                        <strong>End Date:</strong> {item.endDate}
                      </p>
                      <p>
                        <strong>Featured:</strong>{" "}
                        {item.featured ? "Yes" : "No"}
                      </p>
                      <p>
                        <strong>Page Link:</strong>
                        <a
                          href={item.pageLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline break-all text-xs block mt-1"
                        >
                          {item.pageLink}
                        </a>
                      </p>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {megaDeals.length > 0 && (
        <div className="pt-4">
          <Pagination
            currentPage={currentPage}
            pageSize={itemsPerPage}
            totalCount={megaDeals.length}
            onPageChange={setCurrentPage}
            label="mega deals"
          />
        </div>
      )}
    </div>
  );
};

export default MegaDeals;
