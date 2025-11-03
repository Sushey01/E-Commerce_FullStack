import React, { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";

type Category = {
  id: number;
  name: string;
};

const CategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: "Women Clothing & Fashion" },
    { id: 2, name: "Men Clothing & Fashion" },
    { id: 3, name: "Electronics" },
    { id: 4, name: "Home & Living" },
    { id: 5, name: "Beauty & Personal Care" },
    { id: 6, name: "Health & Wellness" },
    { id: 7, name: "Sports & Outdoor" },
    { id: 8, name: "Baby & Kids" },
    { id: 9, name: "Groceries & Essentials" },
    { id: 10, name: "Books & Stationery" },
    { id: 11, name: "Automotive" },
    { id: 12, name: "Jewelry & Accessories" },
    { id: 13, name: "Pet Supplies" },
    { id: 14, name: "Gaming" },
    { id: 15, name: "Furniture" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState<string>("");

  // Delete a category
  const handleDelete = (id: number) => {
    setCategories(categories.filter((cat) => cat.id !== id));
    setOpenMenu(null);
  };

  // Enable edit mode
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

  // Filter categories based on search
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl text-gray-500">All Categories</h1>
        <button className="flex border rounded-3xl p-3 bg-blue-500 text-white hover:bg-blue-600">
          Add New Category
        </button>
      </div>

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

          {filteredCategories.length > 0 ? (
            filteredCategories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between relative group"
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
      </div>
    </div>
  );
};

export default CategoryList;
