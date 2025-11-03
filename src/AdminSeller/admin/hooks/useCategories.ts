import { useState } from "react";

// Define your Category type
export type Category = {
  id: number;
  name: string;
};

// Custom hook for managing categories
const useCategories = () => {
  // Local state
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: "Electronics" },
    { id: 2, name: "Clothing" },
    { id: 3, name: "Books" },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const totalCount = categories.length;

  // Placeholder async functions (for future API calls)
  const fetchCategories = async () => {
    try {
      setLoading(true);
      // In real use: fetch data from API here
    } catch (err) {
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (newCategory: Omit<Category, "id">) => {
    const nextId =
      categories.length > 0
        ? Math.max(...categories.map((cat) => cat.id)) + 1
        : 1;
    setCategories([...categories, { id: nextId, ...newCategory }]);
  };

  const updateCategory = async (id: number, updated: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, ...updated } : cat))
    );
  };

  const deleteCategory = async (id: number) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  return {
    categories,
    setCategories,
    loading,
    error,
    totalCount,
    currentPage,
    setCurrentPage,
    pageSize,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};

export default useCategories;
