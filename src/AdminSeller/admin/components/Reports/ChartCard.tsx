// src/components/ChartCard.tsx (Updated)

import React, { useState } from "react";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  Cell, // Imported Cell for dynamic bar colors
} from "recharts";

// --- Types and Interfaces ---

// Data for the Horizontal Bar Chart
interface BarChartDataItem {
  category: string;
  value: number;
  color: string;
}

// Data for the Line Chart
interface LineChartDataItem {
  name: string | number; // X-axis label (e.g., day number)
  value: number; // Y-axis value
}

export type TimeFilter = "all" | "today" | "week" | "month";

// Main component props, now supporting two chart types
interface ChartCardProps {
  title: string;
  subtitle?: string; // Subtitle is optional for the line chart design
  // Conditional Data: only ONE of these should be passed
  barData?: BarChartDataItem[];
  lineData?: LineChartDataItem[];

  maxDomainX?: number; // Max value for the horizontal bar chart X-axis
  maxDomainY?: number; // Max value for the line chart Y-axis (optional)

  yAxisWidth?: number;
  tooltipUnit?: string;
  lineColor?: string; // Color for the line chart
  currentFilter?: TimeFilter; // Current selected filter
  onFilterChange?: (filter: TimeFilter) => void; // Callback when filter changes
  onTimeFilterChange?: (filter: TimeFilter) => void; // Legacy callback (keep for compatibility)
}

// Custom Tooltip component for the Horizontal Bar Chart
const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const dataItem = payload[0].payload;
    const value = payload[0].value;
    return (
      <div className="bg-white p-2 border border-gray-200 rounded-lg shadow-md text-sm">
        <p className="font-semibold text-gray-700">{dataItem.category}</p>
        <p className="text-gray-500">{`Value : ${value.toLocaleString()}`}</p>
      </div>
    );
  }
  return null;
};

// Custom Tooltip component for the Line Chart
const CustomLineTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 rounded-lg shadow-md text-sm">
        <p className="font-semibold text-gray-700">{`Day ${label}`}</p>
        <p className="text-gray-500">{`Value : ${payload[0].value.toFixed(
          2
        )}`}</p>
      </div>
    );
  }
  return null;
};

// --- Main Component ---

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  barData,
  lineData,
  maxDomainX = 1,
  maxDomainY = 1,
  yAxisWidth = 120,
  tooltipUnit = "",
  lineColor = "#ef4444", // Default line color
  currentFilter,
  onFilterChange,
  onTimeFilterChange,
}) => {
  const [internalFilter, setInternalFilter] = useState<TimeFilter>("all");
  
  // Use controlled filter if provided, otherwise use internal state
  const activeFilter = currentFilter !== undefined ? currentFilter : internalFilter;

  const handleFilterClick = (filter: TimeFilter) => {
    if (currentFilter === undefined) {
      setInternalFilter(filter);
    }
    if (onFilterChange) {
      onFilterChange(filter);
    }
    if (onTimeFilterChange) {
      onTimeFilterChange(filter);
    }
  };

  const isLineChart = lineData && lineData.length > 0;
  const isBarChart = barData && barData.length > 0;

  // Reusable Time Filter Component
  const TimeFilterButtons = () => (
    <div className="absolute right-0 top-0 flex items-center text-xs font-medium">
      <span
        className={`px-2 py-1 rounded-l-md cursor-pointer ${
          activeFilter === "all"
            ? "bg-red-500 text-white"
            : "text-gray-600 border-y border-l border-gray-200"
        }`}
        onClick={() => handleFilterClick("all")}
      >
        All
      </span>
      <span
        className={`px-2 py-1 border-y border-r border-gray-200 cursor-pointer ${
          activeFilter === "today"
            ? "bg-red-500 text-white"
            : "text-gray-600"
        }`}
        onClick={() => handleFilterClick("today")}
      >
        Today
      </span>
      <span
        className={`px-2 py-1 border-y border-r border-gray-200 cursor-pointer ${
          activeFilter === "week"
            ? "bg-red-500 text-white"
            : "text-gray-600"
        }`}
        onClick={() => handleFilterClick("week")}
      >
        Week
      </span>
      <span
        className={`px-2 py-1 rounded-r-md border-y border-r border-gray-200 cursor-pointer ${
          activeFilter === "month"
            ? "bg-red-500 text-white"
            : "text-gray-600"
        }`}
        onClick={() => handleFilterClick("month")}
      >
        Month
      </span>
    </div>
  );

  // --- RENDER LINE CHART ---
  if (isLineChart) {
    return (
      <div className="rounded-xl bg-white p-5 shadow-lg w-full max-w-lg flex-shrink-0">
        <div className="relative mb-8">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          {/* Time Filters */}
          <TimeFilterButtons />
        </div>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart
            data={lineData}
            margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e5e7eb"
            />

            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={40}
            />

            <YAxis
              domain={[0, maxDomainY]}
              tickFormatter={(value) => value.toFixed(1)}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
            />

            <Tooltip content={<CustomLineTooltip />} />

            <Line
              type="monotone"
              dataKey="value"
              stroke={lineColor}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // --- RENDER HORIZONTAL BAR CHART (Original Design) ---
  if (isBarChart) {
    // Reverse the data so the first item (longest bar) appears at the top
    const chartData = [...barData!].reverse();

    return (
      <div className="rounded-xl bg-white p-5 shadow-lg w-full max-w-lg flex-shrink-0">
        {/* Header Section */}
        <div className="relative mb-8">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <p className="text-sm text-gray-500">{subtitle}</p>

          {/* Time Filters */}
          <TimeFilterButtons />
        </div>

        {/* Chart Container */}
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 0, right: 30, left: yAxisWidth, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={false}
              stroke="#e5e7eb"
            />

            <XAxis
              type="number"
              domain={[0, maxDomainX]}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) =>
                maxDomainX > 1000
                  ? `${value / 1000}${tooltipUnit}`
                  : String(value)
              }
              tick={{ fill: "#6b7280", fontSize: 12 }}
            />

            <YAxis
              dataKey="category"
              type="category"
              axisLine={false}
              tickLine={false}
              width={yAxisWidth}
              tick={{ fill: "#374151", fontSize: 12 }}
            />

            <Tooltip content={<CustomBarTooltip />} />

            <Bar
              dataKey="value"
              barSize={20}
              radius={[0, 4, 4, 0]}
              // The 'fill' prop is REMOVED to satisfy Recharts/TS
            >
              {/* This is the CORRECT place to apply dynamic colors using Cell */}
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // Fallback if no data is provided
  return (
    <div className="rounded-xl bg-white p-5 shadow-lg w-full max-w-lg flex-shrink-0 flex items-center justify-center h-80">
      <p className="text-gray-500">No chart data provided.</p>
    </div>
  );
};

export default ChartCard;
