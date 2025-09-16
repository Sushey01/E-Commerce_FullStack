import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import supabase from "../supabase";
import Spinner from "../components/Spinner";
import MonthlySaleCard from "../components/MonthlySaleCard"; // Use card directly

const SubCategories = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]); // products for the whole category
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const categoryId = queryParams.get("id");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Fetch category name
      const { data: categoryData } = await supabase
        .from("categories")
        .select("name")
        .eq("id", categoryId)
        .single();
      if (categoryData) setCategoryName(categoryData.name);

      // Fetch subcategories for this category
      const { data: subData } = await supabase
        .from("subcategories")
        .select("id, name")
        .eq("category_id", categoryId);

      if (subData) setSubcategories(subData);

      // Fetch all products for this category (through subcategories)
      const { data: productData } = await supabase
        .from("products")
        .select("*")
        .in(
          "subcategory_id",
          (subData || []).map((s) => s.id)
        )
        .order("created_at", { ascending: false });

  if (productData) {
    setProducts(
      productData.map((p) => {
        let images = [];
        try {
          const parsed = JSON.parse(p.images);
          images = Array.isArray(parsed) ? parsed : [parsed];
        } catch {
          if (p.images) {
            images = [p.images]; // plain string fallback
          }
        }

        return {
          id: p.id,
          title: p.title,
          price: p.price,
          oldPrice: p.old_price, // map DB -> card prop
          discount: p.discount || 0, // if you store discount %
          sold: p.sold || 20, // map DB -> card prop
          inStock: p.in_stock || 20, // map DB -> card prop
          rating: p.rating || 0,
          reviews: p.reviews || 0,
          images,
        };
      })
    );
  }


      setLoading(false);
    };

    fetchData();
  }, [categoryId]);

  if (loading) return <Spinner />;

  return (
    <div className="p-4">
      {/* Subcategories Grid */}
      <h2 className="text-2xl font-semibold mb-4">
        {categoryName ? `${categoryName} Subcategories` : "Subcategories"}
      </h2>

      {subcategories.length === 0 ? (
        <p>No subcategories found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {subcategories.map((s) => (
            <div
              key={s.id}
              onClick={() => navigate(`/Subsubcategory?id=${s.id}`)}
              className="border rounded p-4 cursor-pointer hover:shadow"
            >
              {s.name}
            </div>
          ))}
        </div>
      )}

      {/* All Products under this Category */}
      <h3 className="text-xl font-semibold mb-4">
        All {categoryName} Products
      </h3>

      {products.length === 0 ? (
        <p>No products found in this category.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <MonthlySaleCard
              key={product.id}
              {...product}
              image={product.images?.[0] || "/placeholder.jpg"}
              label="Add to Cart"
              onAddToCart={() => console.log("Added:", product.title)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SubCategories;
