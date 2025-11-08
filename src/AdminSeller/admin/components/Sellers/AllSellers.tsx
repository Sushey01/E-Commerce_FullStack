import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Eye, Edit, Trash2, MoreVertical } from "lucide-react";
import useSellers from "../../hooks/useSellers";
import Pagination from "../Pagination";
import supabase from "../../../../supabase";
// Using an inline dropdown like SalesOverallList for reliable rendering over tables

interface AllSellersProps {
  filter?: string;
}

const AllSellers: React.FC<AllSellersProps> = ({ filter }) => {
  const { sellers, loading, error, totalCount, fetchSellers } = useSellers();
  const [page, setPage] = useState<number>(1);
  const PAGE_SIZE = 10;
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchSellers(page, PAGE_SIZE);
  }, [fetchSellers, page]);

  const handleSetStatus = async (
    sellerId: string,
    status: "active" | "inactive"
  ) => {
    try {
      setUpdatingId(sellerId);
      const { error: updErr } = await supabase
        .from("sellers")
        .update({ status })
        .eq("seller_id", sellerId);
      if (updErr) throw updErr;
      await fetchSellers(page, PAGE_SIZE);
    } catch (e) {
      console.error("Failed to update seller status:", e);
    } finally {
      setUpdatingId(null);
      setOpenMenuId(null);
    }
  };

  return (
    <div>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border">
                <tr>
                  <th className="text-left p-4 font-medium text-card-foreground">
                    Name
                  </th>
                  <th className="text-left p-4 font-medium text-card-foreground">
                    Company
                  </th>
                  <th className="text-left p-4 font-medium text-card-foreground">
                    Email
                  </th>
                  <th className="text-left p-4 font-medium text-card-foreground">
                    Products
                  </th>
                  <th className="text-left p-4 font-medium text-card-foreground">
                    Sales
                  </th>
                  <th className="text-left p-4 font-medium text-card-foreground">
                    Status
                  </th>
                  <th className="text-left p-4 font-medium text-card-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td
                      colSpan={7}
                      className="p-4 text-center text-muted-foreground"
                    >
                      Loading sellers…
                    </td>
                  </tr>
                )}
                {!loading && error && (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-red-600">
                      {error}
                    </td>
                  </tr>
                )}
                {!loading && !error && sellers.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="p-4 text-center text-muted-foreground"
                    >
                      No sellers found
                    </td>
                  </tr>
                )}
                {!loading &&
                  !error &&
                  sellers.map((seller) => (
                    <tr key={seller.id} className="border-b border-border">
                      <td className="p-4 text-card-foreground">
                        {seller.name}
                      </td>
                      <td className="p-4 text-card-foreground">
                        {seller.company || "-"}
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {seller.email || "-"}
                      </td>
                      <td className="p-4 text-card-foreground">
                        {seller.products ?? 0}
                      </td>
                      <td className="p-4 text-card-foreground">
                        ${seller.sales ?? 0}
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={
                            seller.status === "active" ? "default" : "inactive"
                          }
                        >
                          {seller.status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="relative inline-block text-left">
                          <Button
                            variant="outline"
                            size="icon"
                            aria-label="Actions"
                            onClick={() =>
                              setOpenMenuId((prev) =>
                                prev === seller.id ? null : seller.id
                              )
                            }
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                          {openMenuId === seller.id && (
                            <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                              <div className="py-1 text-sm">
                                <button
                                  onClick={() => {
                                    console.log("View", seller);
                                    setOpenMenuId(null);
                                  }}
                                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 flex items-center gap-2"
                                >
                                  <Eye className="h-4 w-4 text-indigo-600" />
                                  View
                                </button>
                                <button
                                  onClick={() => {
                                    console.log("Edit", seller);
                                    setOpenMenuId(null);
                                  }}
                                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 flex items-center gap-2"
                                >
                                  <Edit className="h-4 w-4 text-blue-600" />
                                  Edit
                                </button>
                                {seller.status === "active" ? (
                                  <button
                                    onClick={() =>
                                      handleSetStatus(seller.id, "inactive")
                                    }
                                    disabled={updatingId === seller.id}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 flex items-center gap-2 disabled:opacity-60"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    Deactivate
                                  </button>
                                ) : (
                                  <button
                                    onClick={() =>
                                      handleSetStatus(seller.id, "active")
                                    }
                                    disabled={updatingId === seller.id}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-green-600 flex items-center gap-2 disabled:opacity-60"
                                  >
                                    <Eye className="h-4 w-4" />
                                    Activate
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      <div className="p-4">
        <Pagination
          currentPage={page}
          pageSize={PAGE_SIZE}
          totalCount={totalCount}
          label="sellers"
          onPageChange={(p) => setPage(Math.max(1, p))}
        />
      </div>
    </div>
  );
};

export default AllSellers;
