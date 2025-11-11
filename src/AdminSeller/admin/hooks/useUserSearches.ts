import { useState } from "react";
// @ts-ignore - supabase is a JS file
import supabase from "../../../supabase";

interface UserSearchItem {
  id: number;
  query: string;
  search_count: number;
}

interface UseUserSearchesResult {
  searches: UserSearchItem[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  totalPages: number;
  fetchSearches: (page: number) => Promise<void>;
}

export const useUserSearches = (itemsPerPage: number = 10): UseUserSearchesResult => {
  const [searches, setSearches] = useState<UserSearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchSearches = async (page: number) => {
    setLoading(true);
    setError(null);
    console.log("🔍 [useUserSearches] Fetching - Page:", page);

    try {
      const from = (page - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      const { data, error: searchError, count } = await supabase
        .from("user_searches")
        .select("*", { count: "exact" })
        .order("search_count", { ascending: false })
        .range(from, to);

      if (searchError) {
        // If table doesn't exist, handle gracefully
        if (searchError.code === "42P01") {
          console.warn("🔍 [useUserSearches] Table 'user_searches' does not exist");
          setSearches([]);
          setTotalCount(0);
          setTotalPages(1);
          setLoading(false);
          return;
        }
        throw searchError;
      }

      console.log("🔍 [useUserSearches] Fetched:", data?.length, "searches");

      setSearches(data || []);
      setTotalCount(count || 0);
      setTotalPages(Math.ceil((count || 0) / itemsPerPage));
    } catch (err: any) {
      console.error("❌ [useUserSearches] Error:", err);
      setError(err.message || "Failed to fetch user searches");
      setSearches([]);
      setTotalCount(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  return {
    searches,
    loading,
    error,
    totalCount,
    totalPages,
    fetchSearches,
  };
};
