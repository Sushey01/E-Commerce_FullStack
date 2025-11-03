import { useCallback, useEffect, useState } from "react";
import supabase from "../../../supabase";

export type Brand = {
  brand_id: number;
  brand_name: string;
  logo_url?: string | null;
};

export default function useBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const fetchBrands = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
    setCurrentPage(page);
    try {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      
      const { data, error, count } = await supabase
        .from("brands")
        .select("*", { count: "exact" })
        .order("brand_name", { ascending: true })
        .range(from, to);
      
      if (error) throw error;
      setBrands((data as Brand[]) || []);
      setTotalCount(count || 0);
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }, [pageSize]);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  const uploadLogo = async (file: File) => {
    if (!file) return null;
    try {
      const filePath = `brands/${Date.now()}_${file.name}`;
      const { error: uploadError, data: uploadData } = await supabase.storage.from("brand_logos").upload(filePath, file, { cacheControl: "3600", upsert: false });
      
      if (uploadError) {
        console.error("Supabase upload error details:", uploadError);
        throw new Error(`Upload failed: ${uploadError.message}. Please check bucket policies in Supabase Storage.`);
      }
      
      // get public URL
      const { data } = supabase.storage.from("brand_logos").getPublicUrl(filePath) as any;
      return data?.publicUrl || null;
    } catch (err: any) {
      console.error("Logo upload failed:", err);
      throw err;
    }
  };

  const createBrand = async ({ name, logoFile }: { name: string; logoFile?: File | null }) => {
    setLoading(true);
    setError(null);
    try {
      let logo_url: string | null = null;
      if (logoFile) logo_url = await uploadLogo(logoFile);
      const payload: any = { brand_name: name, logo_url };
      const { data, error } = await supabase.from("brands").insert([payload]).select().single();
      if (error) throw error;
      setBrands((s) => [...s, data]);
      return data;
    } catch (err: any) {
      setError(err.message || String(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateBrand = async (id: any, patch: Partial<{ brand_name: string; logo_url?: string | null }> & { logoFile?: File | null }) => {
    setLoading(true);
    setError(null);
    try {
      const body: any = {};
      if ((patch as any).name) body.brand_name = (patch as any).name; // Map 'name' to 'brand_name'
      if ((patch as any).logoFile) {
        body.logo_url = await uploadLogo((patch as any).logoFile);
      } else if (patch.logo_url !== undefined) {
        body.logo_url = patch.logo_url;
      }
      const { data, error } = await supabase.from("brands").update(body).eq("brand_id", id).select().single();
      if (error) throw error;
      setBrands((s) => s.map((b) => (b.brand_id === id ? data : b)));
      return data;
    } catch (err: any) {
      setError(err.message || String(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteBrand = async (id: any) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.from("brands").delete().eq("brand_id", id);
      if (error) throw error;
      setBrands((s) => s.filter((b) => b.brand_id !== id));
    } catch (err: any) {
      setError(err.message || String(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { brands, loading, error, totalCount, currentPage, pageSize, fetchBrands, createBrand, updateBrand, deleteBrand };
}
