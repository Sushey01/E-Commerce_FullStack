import { useEffect, useState } from "react";
import MonthlySaleCard from "./MonthlySaleCard";
import supabase from "../supabase";
import Spinner from "./Spinner";

// Debounce helper
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const HomeProductFilterSort = ({ onFilterClick, filters }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("Latest");
  const [showCount, setShowCount] = useState(12);
  const [error, setError] = useState(null);

const fetchProducts = async () => {
  setLoading(true);
  setError(null);

  try {
    let subcategoryIds = [];
    let brandIds = [];

    // Step 1: map category names → subcategory IDs
    if (filters.selectedCategories?.length > 0) {
      const { data: subcategories, error: subcatError } = await supabase
        .from("subcategories")
        .select("id")
        .in("name", filters.selectedCategories);

      if (subcatError) {
        console.error("Error fetching subcategories:", subcatError.message);
      } else {
        subcategoryIds = subcategories.map((sc) => sc.id);
      }
    }

    // Step 2: map brand names → brand IDs
    if (filters.selectedBrands?.length > 0) {
      const { data: brands, error: brandError } = await supabase
        .from("brands")
        .select("brand_id, brand_name")
        .in("brand_name", filters.selectedBrands);

      if (brandError) {
        console.error("Error fetching brands:", brandError.message);
      } else if (brands?.length > 0) {
        brandIds = brands.map((b) => b.brand_id);
      }
    }

    // Step 3: build product query
    let query = supabase.from("products").select("*");

    if (subcategoryIds.length > 0) {
      query = query.in("subcategory_id", subcategoryIds);
    }

    if (brandIds.length > 0) {
      query = query.in("brand_id", brandIds);
    }

    if (filters.selectedColors?.length > 0) {
      const color = filters.selectedColors[0]; // TODO: support multiple
      query = query.filter("variant->color", "cs", `["${color}"]`);
    }

    if (
      filters.priceRange?.min !== undefined &&
      filters.priceRange?.max !== undefined
    ) {
      query = query
        .gte("price", filters.priceRange.min)
        .lte("price", filters.priceRange.max);
    }

    // Sorting
    if (sortBy === "Latest")
      query = query.order("created_at", { ascending: false });
    else if (sortBy === "Popular")
      query = query.order("sold", { ascending: false });
    else if (sortBy === "Price: Low to High")
      query = query.order("price", { ascending: true });
    else if (sortBy === "Price: High to Low")
      query = query.order("price", { ascending: false });

    const { data, error: productError } = await query;

    if (productError) {
      console.error("Error fetching products:", productError.message);
      setProducts([]);
      setError("Failed to load products. Please try again later.");
    } else {
      setProducts(data || []);
      setError(null);
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    setProducts([]);
    setError("Something went wrong.");
  }

  setLoading(false);
};


  const debouncedFetchProducts = debounce(fetchProducts, 300);

  useEffect(() => {
    debouncedFetchProducts();
  }, [filters, sortBy]);

  const handleBuyNow = (product) => {
    alert(`Buying ${product.title} for ${product.price}`);
  };

  return (
    <>
      {/* Top bar with sorting + show count + filter button */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 px-1 gap-3">
        <p className="text-sm hidden md:block lg:block">
          Showing all {showCount} items
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 w-full md:w-auto">
          <div className="flex flex-wrap justify-between md:gap-2 lg:gap-4">
            {/* Sort By */}
            <div className="flex gap-2 items-center">
              <p className="text-sm text-[#4b5563]">Sort By:</p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border rounded bg-gray-200 text-sm px-2 py-1 focus:outline-none focus:bg-gray-200"
              >
                <option>Latest</option>
                <option>Popular</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>

            {/* Show Count */}
            <div className="flex gap-2 items-center">
              <p className="text-sm text-[#4b5563]">Show:</p>
              <select
                value={showCount}
                onChange={(e) => setShowCount(Number(e.target.value))}
                className="border rounded bg-gray-200 text-sm px-2 py-1 focus:outline-none focus:bg-gray-200"
              >
                <option value={12}>12 Items</option>
                <option value={24}>24 Items</option>
                <option value={36}>36 Items</option>
                <option value={48}>48 Items</option>
              </select>
            </div>
          </div>

          {/* Mobile filter toggle */}
          <div className="flex gap-2 items-center justify-between">
            <p className="block lg:hidden md:hidden">
              Showing all {showCount} items
            </p>
            <div className="flex flex-wrap items-center gap-1">
              <button
                className="flex md:hidden lg:hidden"
                onClick={onFilterClick}
              >
                {/* Use className instead of class */}
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 24 24"
                  className="text-2xl"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="Filter">
                    <path d="M14.037,20.937a1.015,1.015,0,0,1-.518-.145l-3.334-2a2.551,2.551,0,0,1-1.233-2.176V12.091a1.526,1.526,0,0,0-.284-.891L4.013,4.658a1.01,1.01,0,0,1,.822-1.6h14.33a1.009,1.009,0,0,1,.822,1.6h0L15.332,11.2a1.527,1.527,0,0,0-.285.891v7.834a1.013,1.013,0,0,1-1.01,1.012ZM4.835,4.063,9.482,10.62a2.515,2.515,0,0,1,.47,1.471v4.524a1.543,1.543,0,0,0,.747,1.318l3.334,2,.014-7.843a2.516,2.516,0,0,1,.471-1.471l4.654-6.542,0,0Z"></path>
                  </g>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error / Loader / Products */}
      {error && <div className="text-red-500 text-center py-4">{error}</div>}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 py-2 gap-3">
        {loading ? (
          <Spinner />
        ) : (
          products.map((product) => (
            <MonthlySaleCard
              key={product.id}
              id={product.id}
              title={product.title}
              price={product.price}
              oldPrice={product.old_price}
              image={
                Array.isArray(product.images)
                  ? product.images[0]
                  : product.images || "https://via.placeholder.com/150"
              }
              sold={product.sold || 10}
              inStock={product.outofstock ? 0 : 1}
              discount={
                product.old_price > 0
                  ? Math.round(
                      ((product.old_price - product.price) /
                        product.old_price) *
                        100
                    )
                  : 0
              }
              rating={product.rating || 0}
              reviews={product.reviews || 0}
              label="Buy Now"
              onBuyNow={() => handleBuyNow(product)}
            />
          ))
        )}
      </div>
    </>
  );
};

export default HomeProductFilterSort;
