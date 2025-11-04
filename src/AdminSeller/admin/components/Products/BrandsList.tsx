import React, { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import useBrands, { Brand as BrandType } from "../../hooks/useBrands";

const BrandsList: React.FC = () => {
  const {
    brands,
    loading,
    error,
    totalCount,
    currentPage,
    pageSize,
    fetchBrands,
    createBrand,
    updateBrand,
    deleteBrand,
  } = useBrands();

  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [newBrandName, setNewBrandName] = useState("");
  const [newBrandLogo, setNewBrandLogo] = useState<File | null>(null);
  const [editingBrand, setEditingBrand] = useState<BrandType | null>(null);

  const totalPages = Math.ceil(totalCount / pageSize);

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => setOpenMenu(null);
    if (openMenu !== null) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [openMenu]);

  const handleEdit = (brand: BrandType) => {
    setEditingBrand(brand);
    setNewBrandName(brand.brand_name || "");
    setNewBrandLogo(null);
    setOpenMenu(null);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteBrand(id);
    } catch (e) {
      console.error("Delete brand failed:", e);
    } finally {
      setOpenMenu(null);
    }
  };

  const handleSaveBrand = async () => {
    if (!newBrandName) return;
    try {
      if (editingBrand) {
        // Note: updateBrand internally maps 'name' to 'brand_name'
        await updateBrand(editingBrand.brand_id, {
          name: newBrandName,
          logoFile: newBrandLogo || undefined,
        } as any);
        setEditingBrand(null);
      } else {
        await createBrand({
          name: newBrandName,
          logoFile: newBrandLogo || undefined,
        });
      }
      setNewBrandName("");
      setNewBrandLogo(null);
    } catch (e) {
      console.error("Save brand failed:", e);
      alert(`Failed to save brand: ${(e as Error).message}`);
    }
  };

  return (
    <div className="space-y-6 flex flex-col md:flex-row gap-4 w-full">
      <div className="w-full md:w-1/2 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Brands</h2>
          <input
            type="search"
            placeholder="Type name & Enter"
            className="border border-gray-300 text-center rounded-md px-3 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="overflow-x-auto">
          {(() => {
            if (loading)
              return (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Loading brands...
                </div>
              );
            if (error)
              return (
                <div className="p-4 text-center text-sm text-red-600">
                  Error loading brands: {error}
                </div>
              );
            if (!brands || brands.length === 0)
              return (
                <div className="p-6 text-center text-muted-foreground">
                  No brands found. Add one using the form on the right.
                </div>
              );

            return (
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-gray-100 text-gray-700 uppercase">
                  <tr>
                    <th className="px-4 py-2 border-b">#</th>
                    <th className="px-4 py-2 border-b">Name</th>
                    <th className="px-4 py-2 border-b">Logo</th>
                    <th className="px-4 py-2 border-b">Options</th>
                  </tr>
                </thead>
                <tbody>
                  {brands.map((brand, index) => (
                    <tr
                      key={brand.brand_id}
                      className="hover:bg-gray-50 transition duration-200"
                    >
                      <td className="px-4 py-2 border-b">
                        {(currentPage - 1) * pageSize + index + 1}
                      </td>
                      <td className="px-4 py-2 border-b">{brand.brand_name}</td>
                      <td className="px-4 py-2 border-b">
                        <img
                          src={
                            brand.logo_url ||
                            "https://via.placeholder.com/100x40?text=Logo"
                          }
                          alt={brand.brand_name}
                          className="w-16 h-10 object-contain bg-white p-1"
                        />
                      </td>
                      <td className="px-4 py-2 border-b">
                        <div className="relative inline-block">
                          <button
                            className="text-gray-600 hover:text-gray-800"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenu(
                                openMenu === brand.brand_id
                                  ? null
                                  : brand.brand_id
                              );
                            }}
                          >
                            <BsThreeDotsVertical size={18} />
                          </button>
                          {openMenu === brand.brand_id && (
                            <div
                              className="absolute right-0 top-full mt-1 bg-white border rounded shadow-lg w-28 z-50"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(brand);
                                }}
                                className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                              >
                                Edit
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(brand.brand_id);
                                }}
                                className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            );
          })()}
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-medium">
              {brands.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(currentPage * pageSize, totalCount)}
            </span>{" "}
            of <span className="font-medium">{totalCount}</span> brands
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchBrands(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => {
                  // Show first page, last page, current page, and pages around current
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => fetchBrands(page)}
                        className={`px-3 py-1 text-sm border rounded ${
                          currentPage === page
                            ? "bg-blue-600 text-white border-blue-600"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                    return (
                      <span key={page} className="px-2">
                        ...
                      </span>
                    );
                  }
                  return null;
                }
              )}
            </div>
            <button
              onClick={() => fetchBrands(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <div className="border rounded-lg py-2 w-full md:w-1/2 px-4 flex flex-col">
        <h2 className="text-[18px] font-semibold mb-4">
          {editingBrand ? "Edit Brand" : "Add New Brand"}
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveBrand();
          }}
          className="flex flex-col gap-5 p-6 bg-white border rounded-xl shadow-sm w-full max-w-2xl mx-auto"
        >
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-gray-700 font-medium">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={newBrandName}
              onChange={(e) => setNewBrandName(e.target.value)}
              placeholder="Enter brand name"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="logo" className="text-gray-700 font-medium">
              Logo
            </label>
            <input
              id="logo"
              type="file"
              accept="image/*"
              onChange={(e) =>
                e.target.files && setNewBrandLogo(e.target.files[0])
              }
              className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400">
              Supported formats: JPG, PNG, SVG
            </p>
          </div>

          <div className="flex justify-end mt-4 gap-2">
            {editingBrand && (
              <button
                type="button"
                onClick={() => {
                  setEditingBrand(null);
                  setNewBrandName("");
                  setNewBrandLogo(null);
                }}
                className="w-1/3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md py-2 px-4 transition"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="w-full sm:w-1/3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md py-2 px-4 transition"
            >
              {editingBrand ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BrandsList;
