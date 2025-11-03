import React, { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import CategoryForm from "./CategoryForm";
import useCategories, {
  Category as CategoryType,
} from "../hooks/useCategories";

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
    setCategories,
    setCurrentPage,
  } = useCategories();

  const [searchTerm, setSearchTerm] = useState("");
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const itemsPerPage = pageSize;

  // Filter and paginate
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalItems = filteredCategories.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCategories.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Delete category
  const handleDelete = (id: number) => {
    setCategories(categories.filter((cat) => cat.id !== id));
    setOpenMenu(null);
  };

  // Enable edit
  const handleEdit = (id: number, name: string) => {
    setEditingId(id);
    setEditingName(name);
    setOpenMenu(null);
  };

  // Save edit
  const handleSaveEdit = (id: number) => {
    setCategories(
      categories.map((cat) =>
        cat.id === id ? { ...cat, name: editingName } : cat
      )
    );
    setEditingId(null);
  };

  // Page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Handle new category save from CategoryForm
  const handleAddCategory = (newCategory: Omit<CategoryType, "id">) => {
    const nextId =
      categories.length > 0
        ? Math.max(...categories.map((cat) => cat.id)) + 1
        : 1;
    setCategories([...categories, { id: nextId, name: newCategory.name }]);
    setShowAddForm(false);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl text-gray-500">All Categories</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex border rounded-3xl p-3 bg-blue-500 text-white hover:bg-blue-600"
        >
          Add New Category
        </button>
      </div>

      {/* Show Add Category Form */}
      {showAddForm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center overflow-y-auto"
          onClick={() => setShowAddForm(false)} // closes when clicking background
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-4xl p-8 relative animate-slide-up"
            onClick={(e) => e.stopPropagation()} // prevent close when clicking inside
          >
            <button
              onClick={() => setShowAddForm(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl"
            >
              ✕
            </button>
            <CategoryForm onSave={handleAddCategory} />
          </div>
        </div>
      )}

      {/* Search Input */}
      <div>
        <div className="flex justify-between items-center px-2 py-6 border rounded-b-none rounded-xl">
          <p>Categories</p>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded-sm text-center px-2 py-1"
            placeholder="Type name & Enter"
          />
        </div>

        {/* Category List */}
        <div className="p-6 flex flex-col border">
          <div className="flex justify-between border-b py-3">
            <p>Name</p>
            <p>Options</p>
          </div>

          {currentItems.length > 0 ? (
            currentItems.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between border-b relative group"
              >
                <div className="flex items-center gap-3 p-3">
                  <button className="border px-1 bg-blue-50 rounded-sm text-blue-200">
                    +
                  </button>

                  {editingId === cat.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="border rounded-sm px-2 py-1 text-sm"
                      />
                      <button
                        onClick={() => handleSaveEdit(cat.id)}
                        className="text-green-600 text-sm hover:underline"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-gray-500 text-sm hover:underline"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <p>{cat.name}</p>
                  )}
                </div>

                <div className="relative">
                  <BsThreeDotsVertical
                    className="cursor-pointer text-gray-600 hover:text-gray-800"
                    onClick={() =>
                      setOpenMenu(openMenu === cat.id ? null : cat.id)
                    }
                  />

                  {openMenu === cat.id && (
                    <div className="absolute right-0 top-6 bg-white border rounded shadow-lg w-28 z-10">
                      <button
                        onClick={() => handleEdit(cat.id, cat.name)}
                        className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm text-center mt-4">
              No categories found.
            </p>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <span className="px-3 py-1 text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryList;
