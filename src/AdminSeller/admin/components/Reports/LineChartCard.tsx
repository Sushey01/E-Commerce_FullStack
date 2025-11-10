// src/components/LineChartCard.tsx

import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// --- Types and Interfaces ---

// Data structure for a single point on the line chart
export interface LineChartDataItem {
  name: string | number; // X-axis label (e.g., day number '1', '3', '5')
  value: number; // The numerical value to plot on the Y-axis
}

export type TimeFilter = "all" | "today" | "week" | "month";

// Props for the LineChartCard component
interface LineChartCardProps {
  title: string;
  data: LineChartDataItem[];
  lineColor?: string; // Optional: color for the line (default red)
  maxDomainY?: number; // Optional: max value for the Y-axis (default 1)
  minDomainY?: number; // Optional: min value for the Y-axis (default 0)
  currentFilter?: TimeFilter; // Current selected filter
  onFilterChange?: (filter: TimeFilter) => void; // Callback when filter changes
}

// Custom Tooltip component for the line chart
// This is used by Recharts to render the tooltip content
const CustomLineTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    // 'label' here corresponds to the 'name' from your data (e.g., '1', '3')
    // 'payload[0].value' is the 'value' from your data for that point
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

// --- Main LineChartCard Component ---

const LineChartCard: React.FC<LineChartCardProps> = ({
  title,
  data,
  lineColor = "#ef4444", // Default line color (red from your design)
  maxDomainY = 1, // Default max Y-axis value
  minDomainY = 0, // Default min Y-axis value
  currentFilter,
  onFilterChange,
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
  };

  return (
    <div className="rounded-xl bg-white p-5 shadow-lg w-full max-w-lg flex-shrink-0">
      {/* Card Header and Time Filters */}
      <div className="relative mb-8">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        {/* The design for the line charts doesn't have a subtitle */}

        {/* Time Filters */}
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
      </div>

      {/* Responsive Container for the Line Chart */}
      <ResponsiveContainer width="100%" height={250}>
        <LineChart
          data={data}
          // Adjust margins as needed, especially bottom for rotated X-axis labels
          margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
        >
          {/* Horizontal grid lines only, matching the design */}
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e5e7eb"
          />

          {/* X-Axis Configuration */}
          <XAxis
            dataKey="name" // Maps to the 'name' property in LineChartDataItem
            tickLine={false} // Hide tick marks on the axis line
            axisLine={false} // Hide the axis line itself
            tick={{ fill: "#6b7280", fontSize: 12 }} // Styling for tick labels
            interval={0} // Show all ticks (e.g., all day numbers)
            angle={-45} // Rotate labels for better readability
            textAnchor="end" // Anchor text to the end after rotation
            height={40} // Provide enough space for rotated labels
          />

          {/* Y-Axis Configuration */}
          <YAxis
            domain={[minDomainY, maxDomainY]} // Set the min and max domain for the Y-axis
            tickFormatter={(value) => value.toFixed(1)} // Format numbers to one decimal (e.g., 0.1, 0.2)
            axisLine={false} // Hide axis line
            tickLine={false} // Hide tick marks
            tick={{ fill: "#6b7280", fontSize: 12 }} // Styling for tick labels
          />

          {/* Tooltip */}
          <Tooltip content={<CustomLineTooltip />} />

          {/* The Line itself */}
          <Line
            type="monotone" // Smooth curve for the line
            dataKey="value" // Maps to the 'value' property in LineChartDataItem
            stroke={lineColor} // Apply the line color from props
            strokeWidth={2} // Line thickness
            dot={false} // Do not show individual data points as dots
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartCard;
