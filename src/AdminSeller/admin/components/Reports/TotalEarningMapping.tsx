import { DollarSign, Users, Tag, CreditCard } from "lucide-react";
import React, { useState, useMemo } from "react";
import TotalEarnings from "./TotalEarnings";
import useReportsSummary, { BarDatum } from "../../hooks/useReportsSummary";
import HorizontalBarChartCard from "./ChartCard";
import LineChartCard, { LineChartDataItem } from "./LineChartCard";
import ChartCard, { TimeFilter } from "./ChartCard";
// import DownloadReport from "./DownloadReport";

type CardConfig = {
  id: number;
  price: number;
  label: string;
  icon: React.ReactNode;
  details: string;
  detailPrice?: number;
  color: string;
  barData?: BarDatum[];
  showXAxisLabels?: boolean;
  barFill?: string;
  barColors?: string[];
  highlightText?: string;
  highlightList?: string[];
};

const TotalEarningMapping = () => {
  const {
    totalSalesAlltime,
    payoutsTotal,
    totalCategories,
    totalBrands,
    monthlySales,
    monthlyBars,
    payoutBars,
    categoryBars,
    brandBars,
    loading,
  } = useReportsSummary();

  // Time filter states for each chart
  const [categoryFilter, setCategoryFilter] = useState<TimeFilter>("all");
  const [brandFilter, setBrandFilter] = useState<TimeFilter>("all");
  const [salesFilter, setSalesFilter] = useState<TimeFilter>("all");
  const [payoutFilter, setPayoutFilter] = useState<TimeFilter>("all");

  // Helper function to filter data based on time period
  const filterDataByTime = (data: BarDatum[], filter: TimeFilter): BarDatum[] => {
    if (filter === "all") return data;
    
    const now = new Date();
    const today = now.getDate();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // For demo purposes, return top items based on filter
    // In production, you'd filter based on actual timestamps
    switch (filter) {
      case "today":
        return data.slice(0, 3); // Show top 3 for today
      case "week":
        return data.slice(0, 5); // Show top 5 for week
      case "month":
        return data.slice(0, 8); // Show top 8 for month
      default:
        return data;
    }
  };

  // Filtered data based on selected time filters
  const filteredCategoryData = useMemo(
    () => filterDataByTime(categoryBars, categoryFilter),
    [categoryBars, categoryFilter]
  );

  const filteredBrandData = useMemo(
    () => filterDataByTime(brandBars, brandFilter),
    [brandBars, brandFilter]
  );

  const data: CardConfig[] = [
    {
      id: 1,
      price: totalSalesAlltime,
      label: "Total Sales Alltime",
      icon: <Users className="h-5 w-5" />,
      details: "Sales this month",
      detailPrice: monthlyBars.length
        ? monthlyBars[monthlyBars.length - 1].value
        : 0,
      color: "bg-blue-500",
      barData: monthlyBars,
      showXAxisLabels: true,
      barFill: "#2563eb",
    },
    {
      id: 2,
      price: payoutsTotal,
      label: "Payouts",
      icon: <CreditCard className="h-5 w-5" />,
      details: "Payouts this month",
      detailPrice: payoutBars.length
        ? payoutBars[payoutBars.length - 1].value
        : 0,
      color: "bg-rose-500",
      barData: payoutBars,
      showXAxisLabels: true,
      barFill: "#e11d48",
    },
    {
      id: 3,
      price: totalCategories,
      label: "Total Category",
      icon: <Tag className="h-5 w-5" />,
      details: "Top Categories",
      color: "bg-amber-500",
      highlightList: categoryBars.length
        ? categoryBars.slice(0, 3).map((c) => c.name)
        : ["No data"],
    },
    {
      id: 4,
      price: totalBrands,
      label: "Total Brands",
      icon: <Tag className="h-5 w-5" />,
      details: "Top Brands",
      color: "bg-violet-500",
      highlightList: brandBars.length
        ? brandBars.slice(0, 3).map((b) => b.name)
        : ["No data"],
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.map((item) => (
          <TotalEarnings
            key={item.id}
            price={item.price}
            label={item.label}
            icon={item.icon}
            details={item.details}
            detailPrice={item.detailPrice}
            color={item.color}
            barData={item.barData}
            showXAxisLabels={item.showXAxisLabels}
            barFill={item.barFill}
            barColors={item.barColors}
            highlightText={item.highlightText}
            highlightList={item.highlightList}
          />
        ))}
        {/* Horizontal bar charts below the summary cards */}
        <div className="md:col-span-2 lg:col-span-4 flex flex-wrap gap-4 mt-4">
          <ChartCard
            title="Top Categories"
            subtitle="Distribution by product count"
            barData={filteredCategoryData.map((c, idx) => ({
              category: c.name,
              value: c.value,
              color: [
                "#ef4444",
                "#f59e0b",
                "#10b981",
                "#3b82f6",
                "#8b5cf6",
                "#06b6d4",
                "#22c55e",
                "#e11d48",
              ][idx % 8],
            }))}
            maxDomainX={Math.max(
              1,
              ...filteredCategoryData.map((c) => c.value)
            )}
            currentFilter={categoryFilter}
            onFilterChange={setCategoryFilter}
          />
          <ChartCard
            title="Top Brands"
            subtitle="Distribution by product count"
            barData={filteredBrandData.map((b, idx) => ({
              category: b.name,
              value: b.value,
              color: [
                "#22c55e",
                "#f97316",
                "#06b6d4",
                "#a855f7",
                "#e11d48",
                "#3b82f6",
                "#10b981",
                "#f59e0b",
              ][idx % 8],
            }))}
            maxDomainX={Math.max(1, ...filteredBrandData.map((b) => b.value))}
            currentFilter={brandFilter}
            onFilterChange={setBrandFilter}
          />
        </div>

        {/* Line charts below horizontal bar charts */}
        <div className="md:col-span-2 lg:col-span-4 flex flex-wrap gap-4 mt-4">
          <LineChartCard
            title="Sales Trend"
            data={monthlyBars.map((m) => ({
              name: m.name,
              value: m.value,
            }))}
            maxDomainY={Math.max(1, ...monthlyBars.map((m) => m.value))}
            lineColor="#2563eb"
          />
          <LineChartCard
            title="Payout Trend"
            data={payoutBars.map((p) => ({
              name: p.name,
              value: p.value,
            }))}
            maxDomainY={Math.max(1, ...payoutBars.map((p) => p.value))}
            lineColor="#e11d48"
          />
        </div>
      </div>
        {/* <DownloadReport /> */}
    </>
  );
};

export default TotalEarningMapping;
