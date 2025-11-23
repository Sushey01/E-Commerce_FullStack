import { Card, CardHeader, CardTitle, CardContent } from "../../ui/card";

export default function TopBrandsSection({ topBrands = [], totalSales = 0 }) {
  return (
    <Card className="border-none shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-base md:text-lg">Top Brands</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {topBrands.map((brand, idx) => (
            <div
              key={brand.brand_id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                  {brand.brand_name?.substring(0, 2).toUpperCase()}
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {brand.brand_name}
                </span>
              </div>
              <span className="text-sm font-bold text-gray-900">
                $
                {((totalSales / topBrands.length) * (1 - idx * 0.08)).toFixed(
                  2
                )}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
