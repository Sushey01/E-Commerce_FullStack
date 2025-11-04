import { useCallback, useEffect, useState } from "react";
import supabase from "../../../supabase";

// Schema: table "categories"
// id (uuid PK), name (text unique), image_url (text, optional), created_at (timestamp)
export type Category = {
  id: string; // uuid
  name: string;
  image_url?: string | null;
  created_at?: string | null;
};

export default function useCategories() {
  const CATEGORY_BUCKET = (import.meta as any).env?.VITE_CATEGORY_BUCKET || "categories_images";
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const fetchCategories = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
    setCurrentPage(page);
    try {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await supabase
        .from("categories")
        .select("*", { count: "exact" })
        .order("name", { ascending: true })
        .range(from, to);

      if (error) throw error;
      setCategories((data as Category[]) || []);
      setTotalCount(count || 0);
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }, [pageSize]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Optional image upload support using configurable bucket (default: categories_images)
  const uploadImage = async (file: File) => {
    if (!file) return null;
    try {
      const filePath = `categories/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from(CATEGORY_BUCKET)
        .upload(filePath, file, { cacheControl: "3600", upsert: false });

      if (uploadError) {
        console.error("Supabase upload error details:", uploadError);
        throw new Error(
          `Upload failed: ${uploadError.message}. Please ensure the '${CATEGORY_BUCKET}' bucket exists and has proper Storage policies.`
        );
      }

      const { data } = supabase.storage
        .from(CATEGORY_BUCKET)
        .getPublicUrl(filePath) as any;
      return data?.publicUrl || null;
    } catch (err: any) {
      console.error("Image upload failed:", err);
      throw err;
    }
  };

  const createCategory = async ({
    name,
    imageFile,
  }: {
    name: string;
    imageFile?: File;
  }) => {
    try {
      let image_url: string | null = null;
      if (imageFile) image_url = await uploadImage(imageFile);

      const { data, error } = await supabase
        .from("categories")
        .insert([{ name, image_url }])
        .select();

      if (error) throw error;
      await fetchCategories(currentPage);
      return data as Category[];
    } catch (err: any) {
      console.error("Create category failed:", err);
      throw err;
    }
  };

  const updateCategory = async (
    id: string,
    {
      name,
      imageFile,
    }: {
      name: string;
      imageFile?: File;
    }
  ) => {
    try {
      const updates: Record<string, any> = { name };
      if (imageFile) updates.image_url = await uploadImage(imageFile);

      const { error } = await supabase
        .from("categories")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
      await fetchCategories(currentPage);
    } catch (err: any) {
      console.error("Update category failed:", err);
      throw err;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setCategories((prev) => prev.filter((c) => c.id !== id));
      setTotalCount((prev) => Math.max(0, prev - 1));
    } catch (err: any) {
      console.error("Delete category failed:", err);
      throw err;
    }
  };

  return {
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
  };
}
