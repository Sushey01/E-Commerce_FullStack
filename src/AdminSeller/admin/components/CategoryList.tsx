import React, { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AiOutlinePlus } from "react-icons/ai";
import CategoryForm from "./CategoryForm";
import useCategories, { Category as DbCategory } from "../hooks/useCategories";

const CategoryList = () => {
  const {
    categories,
    loading,
    error,
    totalCount,
    currentPage,
    pageSize,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategories();

  const [searchTerm, setSearchTerm] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editTarget, setEditTarget] = useState<DbCategory | null>(null);

  const totalPages = Math.ceil(totalCount / pageSize);

  // Filter and paginate
  const filteredCategories = categories.filter((cat) =>
    (cat.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Delete category
  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id);
    } catch (e) {
      console.error("Delete category failed:", e);
    } finally {
      setOpenMenu(null);
    }
  };

  // Open edit modal with pre-filled data
  const handleOpenEdit = (cat: DbCategory) => {
    setEditTarget(cat);
    setShowEditForm(true);
    setOpenMenu(null);
  };

  // Page change
  // Pagination via server fetch
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) fetchCategories(page);
  };

  // Handle new category save from CategoryForm
  // no local add; handled by form on the right

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex  items-center justify-between">
        <h1 className="text-xl text-gray-500">All Categories</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex border rounded-3xl p-3  bg-blue-500 text-white hover:bg-blue-600"
        >
          Add New Category
        </button>
      </div>

      {/* Show Add Category Form */}
      {showAddForm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowAddForm(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-3xl md:max-w-4xl p-6 md:p-8 relative animate-slide-up max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowAddForm(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl"
            >
              ✕
            </button>
            <CategoryForm
              onSave={async (newCategory: any) => {
                try {
                  const imageFile =
                    newCategory.banner || newCategory.coverImage || undefined;
                  await createCategory({ name: newCategory.name, imageFile });
                  setShowAddForm(false);
                } catch (e) {
                  console.error("Create category failed:", e);
                  alert(`Failed to add category: ${(e as Error).message}`);
                }
              }}
            />
          </div>
        </div>
      )}

      {/* Show Edit Category Form */}
      {showEditForm && editTarget && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowEditForm(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-3xl md:max-w-4xl p-6 md:p-8 relative animate-slide-up max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowEditForm(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl"
            >
              ✕
            </button>
            <CategoryForm
              category={{
                name: editTarget.name,
                type: "Physical",
              }}
              onSave={async (updated: any) => {
                try {
                  const imageFile =
                    updated.banner || updated.coverImage || undefined;
                  await updateCategory(editTarget.id, {
                    name: updated.name,
                    imageFile,
                  });
                  setShowEditForm(false);
                } catch (e) {
                  console.error("Update category failed:", e);
                  alert(`Failed to update category: ${(e as Error).message}`);
                }
              }}
            />
          </div>
        </div>
      )}

      {/* Card */}
      <div className="w-full bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Categories</h2>
          <input
            type="search"
            placeholder="Type name & Enter"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              handlePageChange(1);
            }}
            className="border border-gray-300 text-center rounded-md px-3 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="overflow-x-auto">
          {(() => {
            if (loading)
              return (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Loading categories...
                </div>
              );
            if (error)
              return (
                <div className="p-4 text-center text-sm text-red-600">
                  Error loading categories: {error}
                </div>
              );
            if (!filteredCategories || filteredCategories.length === 0)
              return (
                <div className="p-6 text-center text-muted-foreground">
                  No categories found. Use the "Add New Category" button.
                </div>
              );

            return (
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-gray-100 text-gray-700 uppercase">
                  <tr>
                    <th className="px-4 py-2 border-b">Name</th>
                    <th className="px-4 py-2 border-b">Banner</th>
                    <th className="px-4 py-2 border-b">Options</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map((cat) => (
                    <tr
                      key={cat.id}
                      className="hover:bg-gray-50 transition duration-200"
                    >
                      <td className="px-4 py-2 border-b">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className="inline-flex items-center justify-center w-6 h-6 rounded bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100"
                            title="Add subcategory"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Placeholder: future functionality to add subcategory under this category
                            }}
                          >
                            <AiOutlinePlus size={14} />
                          </button>
                          <span>{cat.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2 border-b">
                        {cat.image_url && (
                          <img
                            src={cat.image_url}
                            alt={cat.name}
                            className="w-16 h-10 object-contain bg-white p-1"
                          />
                        )}
                      </td>
                      <td className="px-4 py-2 border-b">
                        <div className="relative inline-block">
                          <button
                            className="text-gray-600 hover:text-gray-800"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenu(openMenu === cat.id ? null : cat.id);
                            }}
                          >
                            <BsThreeDotsVertical size={18} />
                          </button>
                          {openMenu === cat.id && (
                            <div
                              className="absolute right-0 top-full mt-1 bg-white border rounded shadow-lg w-28 z-50"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenEdit(cat);
                                }}
                                className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                              >
                                Edit
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(cat.id);
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
              {filteredCategories.length > 0
                ? (currentPage - 1) * pageSize + 1
                : 0}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(currentPage * pageSize, totalCount)}
            </span>{" "}
            of <span className="font-medium">{totalCount}</span> categories
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 text-sm border rounded ${
                      currentPage === page
                        ? "bg-blue-600 text-white border-blue-600"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={totalPages === 0 || currentPage === totalPages}
              className="px-3 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryList;
