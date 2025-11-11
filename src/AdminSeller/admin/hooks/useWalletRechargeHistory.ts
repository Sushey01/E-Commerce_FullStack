import { useState, useEffect } from "react";
import supabase from "../../../supabase";

interface WalletRechargeItem {
  id: string;
  user_name: string;
  amount: number;
  date: string;
  status: string;
}

interface User {
  id: string;
  full_name: string;
  email: string;
}

interface UseWalletRechargeHistoryResult {
  recharges: WalletRechargeItem[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  totalPages: number;
  users: User[];
  fetchRecharges: (page: number, userId: string, startDate: string, endDate: string) => Promise<void>;
}

export const useWalletRechargeHistory = (itemsPerPage: number = 10): UseWalletRechargeHistoryResult => {
  const [recharges, setRecharges] = useState<WalletRechargeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [users, setUsers] = useState<User[]>([]);

  // Fetch users list for dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("id, full_name, email")
          .order("full_name");

        if (error) throw error;

        setUsers(data || []);
        console.log("💳 [useWalletRechargeHistory] Loaded users:", data?.length);
      } catch (err) {
        console.error("❌ [useWalletRechargeHistory] Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);

  const fetchRecharges = async (
    page: number,
    userId: string = "all",
    startDate: string = "",
    endDate: string = ""
  ) => {
    setLoading(true);
    setError(null);
    console.log("💳 [useWalletRechargeHistory] Fetching - Page:", page, "User:", userId, "Dates:", startDate, endDate);

    try {
      const from = (page - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      let query = supabase
        .from("wallet_transactions")
        .select("*", { count: "exact" })
        .eq("type", "recharge")
        .order("created_at", { ascending: false })
        .range(from, to);

      if (userId && userId !== "all") {
        query = query.eq("user_id", userId);
      }

      if (startDate) {
        query = query.gte("created_at", startDate);
      }

      if (endDate) {
        query = query.lte("created_at", endDate);
      }

      const { data, error: rechargeError, count } = await query;

      if (rechargeError) {
        // If table doesn't exist, handle gracefully
        if (rechargeError.code === "42P01") {
          console.warn("💳 [useWalletRechargeHistory] Table 'wallet_transactions' does not exist");
          setRecharges([]);
          setTotalCount(0);
          setTotalPages(1);
          setLoading(false);
          return;
        }
        throw rechargeError;
      }

      console.log("💳 [useWalletRechargeHistory] Fetched:", data?.length, "recharges");

      // Get user names for each transaction
      const processedData: WalletRechargeItem[] = await Promise.all(
        (data || []).map(async (transaction: any) => {
          let userName = "Unknown User";

          if (transaction.user_id) {
            const { data: user } = await supabase
              .from("users")
              .select("full_name, email")
              .eq("id", transaction.user_id)
              .single();

            if (user) {
              userName = user.full_name || user.email || "Unknown";
            }
          }

          return {
            id: transaction.id,
            user_name: userName,
            amount: Number(transaction.amount) || 0,
            date: new Date(transaction.created_at).toLocaleDateString(),
            status: transaction.status || "completed",
          };
        })
      );

      setRecharges(processedData);
      setTotalCount(count || 0);
      setTotalPages(Math.ceil((count || 0) / itemsPerPage));
    } catch (err: any) {
      console.error("❌ [useWalletRechargeHistory] Error:", err);
      setError(err.message || "Failed to fetch wallet recharge history");
      setRecharges([]);
      setTotalCount(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  return {
    recharges,
    loading,
    error,
    totalCount,
    totalPages,
    users,
    fetchRecharges,
  };
};
