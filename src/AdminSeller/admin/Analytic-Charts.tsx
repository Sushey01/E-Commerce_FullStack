import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Mock data for charts
const revenueData = [
  { month: "Jan", revenue: 4000, orders: 24 },
  { month: "Feb", revenue: 3000, orders: 18 },
  { month: "Mar", revenue: 5000, orders: 32 },
  { month: "Apr", revenue: 4500, orders: 28 },
  { month: "May", revenue: 6000, orders: 38 },
  { month: "Jun", revenue: 5500, orders: 35 },
];

const categoryData = [
  { name: "Electronics", value: 45, sales: 2400 },
  { name: "Home & Garden", value: 30, sales: 1600 },
  { name: "Sports", value: 15, sales: 800 },
  { name: "Accessories", value: 10, sales: 533 },
];

const topProductsData = [
  { name: "Wireless Headphones", sales: 89, revenue: 8900 },
  { name: "Laptop Stand", sales: 67, revenue: 3350 },
  { name: "Coffee Mug", sales: 54, revenue: 864 },
  { name: "Yoga Mat", sales: 43, revenue: 1290 },
  { name: "Phone Case", sales: 38, revenue: 950 },
];

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
];

interface AnalyticsChartsProps {
  userRole?: "admin" | "seller";
}

export default function AnalyticsCharts({
  userRole = "admin",
}: AnalyticsChartsProps) {
  return (
    <div className="space-y-6">
      {/* Revenue Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
            <CardDescription>Monthly revenue and order volume</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                revenue: {
                  label: "Revenue",
                  color: "hsl(var(--chart-1))",
                },
                orders: {
                  label: "Orders",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--color-revenue)"
                    strokeWidth={2}
                    name="Revenue ($)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="orders"
                    stroke="var(--color-orders)"
                    strokeWidth={2}
                    name="Orders"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
            <CardDescription>
              Distribution of sales across product categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                electronics: {
                  label: "Electronics",
                  color: "hsl(var(--chart-1))",
                },
                home: {
                  label: "Home & Garden",
                  color: "hsl(var(--chart-2))",
                },
                sports: {
                  label: "Sports",
                  color: "hsl(var(--chart-3))",
                },
                accessories: {
                  label: "Accessories",
                  color: "hsl(var(--chart-4))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }: any) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle>
            {userRole === "admin"
              ? "Top Performing Products"
              : "My Best Sellers"}
          </CardTitle>
          <CardDescription>Products with highest sales volume</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              sales: {
                label: "Sales",
                color: "hsl(var(--chart-1))",
              },
              revenue: {
                label: "Revenue",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[400px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProductsData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar
                  dataKey="sales"
                  fill="var(--color-sales)"
                  name="Units Sold"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">
                Total Revenue
              </p>
              <p className="text-2xl font-bold text-card-foreground">$28,000</p>
              <p className="text-xs text-green-600">+12% from last month</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">
                Total Orders
              </p>
              <p className="text-2xl font-bold text-card-foreground">175</p>
              <p className="text-xs text-green-600">+8% from last month</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">
                Avg. Order Value
              </p>
              <p className="text-2xl font-bold text-card-foreground">$160</p>
              <p className="text-xs text-green-600">+5% from last month</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">
                Conversion Rate
              </p>
              <p className="text-2xl font-bold text-card-foreground">3.2%</p>
              <p className="text-xs text-red-600">-0.3% from last month</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
