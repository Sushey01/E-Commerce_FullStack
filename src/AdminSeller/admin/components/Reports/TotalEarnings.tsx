import React from "react";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";

type TotalEarningsProps = {
  price: number;
  label: string;
  icon: React.ReactNode;
  details: string;
  detailPrice?: number;
  color?: string; // background color for the details chip
  // Mini bar chart (optional)
  barValues?: number[]; // raw values for mini bar chart
  barData?: { name: string; value: number }[]; // named bars with labels
  barColorClass?: string; // tailwind class for fallback CSS bars
  barFill?: string; // explicit hex/rgba/color string for Recharts bar fill
  barColors?: string[]; // optional distinct colors per bar
  showXAxisLabels?: boolean; // show names under bars when barData present
  // If provided, replaces chart with a simple highlight text (e.g., top category/brand)
  highlightText?: string;
  // Alternatively, render multiple highlight names (e.g., top 3 categories)
  highlightList?: string[];
};

const TotalEarnings = ({
  price,
  label,
  icon,
  details,
  detailPrice,
  color = "bg-blue-500",
  barValues,
  barData,
  barColorClass = "bg-blue-600",
  barFill,
  barColors,
  showXAxisLabels,
  highlightText,
  highlightList,
}: TotalEarningsProps) => {
  const rechartsData = (
    barData && barData.length
      ? barData
      : barValues?.map((v, i) => ({ name: `${i + 1}`, value: v })) || []
  ) as {
    name: string;
    value: number;
  }[];
  const maxVal =
    rechartsData.length > 0
      ? Math.max(...rechartsData.map((d) => d.value)) || 1
      : 1;
  const shouldShowXAxis =
    typeof showXAxisLabels === "boolean"
      ? showXAxisLabels
      : Boolean(barData && barData.length);
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm hover:shadow-md transition flex flex-col gap-3">
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <h1 className="text-2xl font-bold text-gray-800">
          ${price.toLocaleString()}
        </h1>
        <div className="text-gray-400">{icon}</div>
      </div>

      <p className="text-gray-500 text-sm">{label}</p>

      {/* Detail section (colored box) */}
      <div
        className={`${color} text-white px-4 py-2 rounded-lg flex justify-between items-center`}
      >
        <span>{details}</span>
        {detailPrice !== undefined && <span>${detailPrice.toFixed(3)}</span>}
      </div>

      {/* Highlight names in place of chart (optional) */}
      {highlightList && highlightList.length ? (
        <div className="mt-2 w-full">
          <ul className="space-y-1">
            {highlightList.slice(0, 3).map((name, idx) => (
              <li key={idx} className="text-sm text-gray-700 truncate" title={name}>
                • {name}
              </li>
            ))}
          </ul>
        </div>
      ) : highlightText ? (
        <div className="mt-2 h-24 w-full flex items-center justify-center">
          <span
            className="text-sm font-medium text-gray-700 truncate max-w-full"
            title={highlightText}
          >
            {highlightText}
          </span>
        </div>
      ) : (
        /* Mini Bar Chart (Recharts) */
        rechartsData &&
        rechartsData.length > 0 && (
          <div className="mt-2 h-24 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rechartsData}>
                <XAxis
                  dataKey="name"
                  hide={!shouldShowXAxis}
                  interval={0}
                  angle={-30}
                  textAnchor="end"
                  tick={{ fontSize: 10 }}
                  height={shouldShowXAxis ? 36 : 0}
                />
                <YAxis hide domain={[0, maxVal]} />
                <Tooltip
                  cursor={{ fill: "rgba(0,0,0,0.06)" }}
                  wrapperClassName="text-xs"
                  contentStyle={{ borderRadius: 8, padding: 6 }}
                />
                <Bar
                  dataKey="value"
                  radius={[4, 4, 0, 0]}
                  fill={
                    barColors && barColors.length
                      ? undefined
                      : barFill || "#2563eb"
                  }
                >
                  {barColors && barColors.length
                    ? rechartsData.map((_, idx) => (
                        <Cell
                          key={`cell-${idx}`}
                          fill={barColors[idx % barColors.length]}
                        />
                      ))
                    : null}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )
      )}
    </div>
  );
};

export default TotalEarnings;
