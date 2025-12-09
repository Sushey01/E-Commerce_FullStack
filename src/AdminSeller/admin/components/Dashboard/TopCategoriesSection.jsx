import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

export default function TopCategoriesSection({ topCategories = [], totalSales = 0 }) {
  return (
    <Card className="border-none shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-base md:text-lg">Top Categories</CardTitle>
        <div className="flex gap-2 text-xs mt-2">
          <button className="px-3 py-1 bg-blue-600 text-white rounded">All Items</button>
          <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200">Week</button>
          <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200">Month</button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {topCategories.map((category, idx) => (
            <div
              key={category.id}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                {category.name?.charAt(0) || idx + 1}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">{category.name}</p>
                <p className="text-xs text-gray-500">
                  ${((totalSales / topCategories.length) * (1 - idx * 0.1)).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
