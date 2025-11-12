import { useState, useEffect } from "react";
// @ts-ignore - supabase is a JS file
import supabase from "../../../supabase";

interface NewsletterSubscriber {
  id: number;
  email: string;
  subscribed_at: string;
  is_verified: boolean;
  source: string;
  user_id: string | null;
  unsubscribed_at: string | null;
  is_active: boolean;
}

interface SubscriberStats {
  total: number;
  active: number;
  verified: number;
  unsubscribed: number;
  sources: { source: string; count: number }[];
}

interface UseNewsletterSubscribersResult {
  subscribers: NewsletterSubscriber[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  stats: SubscriberStats | null;
  fetchSubscribers: (
    page: number,
    status: "all" | "active" | "unsubscribed" | "verified",
    searchEmail: string
  ) => Promise<void>;
  fetchStats: () => Promise<void>;
  updateSubscriber: (id: number, updates: Partial<NewsletterSubscriber>) => Promise<boolean>;
  deleteSubscriber: (id: number) => Promise<boolean>;
  exportSubscribers: (status: "all" | "active") => Promise<NewsletterSubscriber[]>;
}

export const useNewsletterSubscribers = (
  itemsPerPage: number = 10
): UseNewsletterSubscribersResult => {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [stats, setStats] = useState<SubscriberStats | null>(null);

  // Fetch subscriber statistics
  const fetchStats = async () => {
    try {
      console.log("📊 [Newsletter] Fetching stats...");

      // Get total counts
      const { count: total } = await supabase
        .from("newsletter_subscribers")
        .select("*", { count: "exact", head: true });

      const { count: active } = await supabase
        .from("newsletter_subscribers")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true);

      const { count: verified } = await supabase
        .from("newsletter_subscribers")
        .select("*", { count: "exact", head: true })
        .eq("is_verified", true);

      const { count: unsubscribed } = await supabase
        .from("newsletter_subscribers")
        .select("*", { count: "exact", head: true })
        .eq("is_active", false);

      // Get source breakdown
      const { data: sourceData } = await supabase
        .from("newsletter_subscribers")
        .select("source")
        .eq("is_active", true);

      const sourceCounts: { [key: string]: number } = {};
      sourceData?.forEach((item: any) => {
        const source = item.source || "unknown";
        sourceCounts[source] = (sourceCounts[source] || 0) + 1;
      });

      const sources = Object.entries(sourceCounts).map(([source, count]) => ({
        source,
        count: count as number,
      }));

      setStats({
        total: total || 0,
        active: active || 0,
        verified: verified || 0,
        unsubscribed: unsubscribed || 0,
        sources,
      });

      console.log("📊 [Newsletter] Stats loaded:", {
        total,
        active,
        verified,
        unsubscribed,
      });
    } catch (err: any) {
      console.error("❌ [Newsletter] Error fetching stats:", err);
    }
  };

  // Fetch subscribers with filters
  const fetchSubscribers = async (
    page: number,
    status: "all" | "active" | "unsubscribed" | "verified" = "all",
    searchEmail: string = ""
  ) => {
    setLoading(true);
    setError(null);
    console.log("📧 [Newsletter] Fetching - Page:", page, "Status:", status, "Search:", searchEmail);

    try {
      const from = (page - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      let query = supabase
        .from("newsletter_subscribers")
        .select("*", { count: "exact" })
        .order("subscribed_at", { ascending: false })
        .range(from, to);

      // Apply status filter
      if (status === "active") {
        query = query.eq("is_active", true);
      } else if (status === "unsubscribed") {
        query = query.eq("is_active", false);
      } else if (status === "verified") {
        query = query.eq("is_verified", true);
      }

      // Apply email search
      if (searchEmail.trim()) {
        query = query.ilike("email", `%${searchEmail.trim()}%`);
      }

      const { data, error: fetchError, count } = await query;

      if (fetchError) throw fetchError;

      console.log("📧 [Newsletter] Fetched:", data?.length, "subscribers");

      setSubscribers(data || []);
      setTotalCount(count || 0);
    } catch (err: any) {
      console.error("❌ [Newsletter] Error:", err);
      setError(err.message || "Failed to fetch subscribers");
      setSubscribers([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Update subscriber (verify, unsubscribe, etc.)
  const updateSubscriber = async (
    id: number,
    updates: Partial<NewsletterSubscriber>
  ): Promise<boolean> => {
    try {
      console.log(`✏️ [Newsletter] Updating subscriber ${id}:`, updates);

      const { error: updateError } = await supabase
        .from("newsletter_subscribers")
        .update(updates)
        .eq("id", id);

      if (updateError) throw updateError;

      // Update local state
      setSubscribers((prev) =>
        prev.map((sub) => (sub.id === id ? { ...sub, ...updates } : sub))
      );

      console.log(`✅ [Newsletter] Subscriber ${id} updated`);
      return true;
    } catch (err: any) {
      console.error("❌ [Newsletter] Update error:", err);
      setError(err.message || "Failed to update subscriber");
      return false;
    }
  };

  // Delete subscriber
  const deleteSubscriber = async (id: number): Promise<boolean> => {
    try {
      console.log(`🗑️ [Newsletter] Deleting subscriber ${id}`);

      const { error: deleteError } = await supabase
        .from("newsletter_subscribers")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      // Update local state
      setSubscribers((prev) => prev.filter((sub) => sub.id !== id));
      setTotalCount((prev) => prev - 1);

      console.log(`✅ [Newsletter] Subscriber ${id} deleted`);
      return true;
    } catch (err: any) {
      console.error("❌ [Newsletter] Delete error:", err);
      setError(err.message || "Failed to delete subscriber");
      return false;
    }
  };

  // Export subscribers (for email campaigns)
  const exportSubscribers = async (
    status: "all" | "active" = "active"
  ): Promise<NewsletterSubscriber[]> => {
    try {
      console.log(`📥 [Newsletter] Exporting ${status} subscribers...`);

      let query = supabase
        .from("newsletter_subscribers")
        .select("*")
        .order("subscribed_at", { ascending: false });

      if (status === "active") {
        query = query.eq("is_active", true);
      }

      const { data, error: exportError } = await query;

      if (exportError) throw exportError;

      console.log(`✅ [Newsletter] Exported ${data?.length || 0} subscribers`);
      return data || [];
    } catch (err: any) {
      console.error("❌ [Newsletter] Export error:", err);
      return [];
    }
  };

  // Load stats on mount
  useEffect(() => {
    fetchStats();
  }, []);

  return {
    subscribers,
    loading,
    error,
    totalCount,
    stats,
    fetchSubscribers,
    fetchStats,
    updateSubscriber,
    deleteSubscriber,
    exportSubscribers,
  };
};
