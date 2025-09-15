import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import supabase from "../supabase";
import Spinner from "./Spinner";
import FlashSaleSlider from "./FlashSaleSlider";

const CategoryBrowser = () => {
  const [items, setItems] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const categoryId = queryParams.get("category");
  const subcategoryId = queryParams.get("subcategory");
  const subsubcategoryId = queryParams.get("subsubcategory");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        if (subsubcategoryId) {
          // 1️⃣ Fetch products for subsubcategory
          const { data: products } = await supabase
            .from("products")
            .select("*")
            .eq("subsubcategory_id", subsubcategoryId)
            .order("created_at", { ascending: false });

          setItems(products || []);

          // Fetch subsubcategory name
          const { data: subsub } = await supabase
            .from("subsubcategories")
            .select("name")
            .eq("id", subsubcategoryId)
            .single();
          setTitle(subsub?.name || "Products");
        } else if (subcategoryId) {
          // 2️⃣ Fetch subsubcategories
          const { data: subsubs } = await supabase
            .from("subsubcategories")
            .select("id, name")
            .eq("subcategory_id", subcategoryId);

          setItems(subsubs || []);

          // Fetch subcategory name
          const { data: sub } = await supabase
            .from("subcategories")
            .select("name")
            .eq("id", subcategoryId)
            .single();
          setTitle(sub?.name || "Subcategories");
        } else if (categoryId) {
          // 3️⃣ Fetch subcategories
          const { data: subs } = await supabase
            .from("subcategories")
            .select("id, name")
            .eq("category_id", categoryId);

          setSubcategories(subs || []);
          // Set the first subcategory or use the one from query if available
          const initialSubcategoryId =
            queryParams.get("subcategory") || subs[0]?.id;
          setSelectedSubcategoryId(initialSubcategoryId);

          // Fetch category name
          const { data: cat } = await supabase
            .from("categories")
            .select("name")
            .eq("id", categoryId)
            .single();
          setTitle(cat?.name || "Categories");
        }
      } catch (error) {
        console.error(error);
        setItems([]);
      }

      setLoading(false);
    };

    fetchData();
  }, [categoryId, subcategoryId, subsubcategoryId, selectedSubcategoryId]);

  if (loading) return <Spinner />;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>

      {categoryId &&
        !subcategoryId &&
        !subsubcategoryId &&
        subcategories.length > 0 && (
          // Subcategory Selection Bar
          <div className="flex space-x-4 mb-6 overflow-x-auto border-b pb-2">
            {subcategories.map((sub) => (
              <button
                key={sub.id}
                onClick={() => {
                  setSelectedSubcategoryId(sub.id);
                  navigate(
                    `/browse?category=${categoryId}&subcategory=${sub.id}`
                  );
                }}
                className={`px-4 py-2 rounded-t-lg ${
                  selectedSubcategoryId === sub.id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        )}

      {subsubcategoryId ? (
        // Show products
        items.length > 0 ? (
          <>
            <FlashSaleSlider products={items} />
            <div className="mt-8">
              <h3 className="text-xl font-medium mb-4">All {title} Products</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {items.map((product) => (
                  <div
                    key={product.id}
                    className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
                  >
                    {product.image_url && (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-md mb-4"
                      />
                    )}
                    <h4 className="text-lg font-semibold">{product.name}</h4>
                    <p className="text-gray-600">${product.price}</p>
                    <p className="text-sm text-gray-500 truncate">
                      {product.description}
                    </p>
                    <button className="mt-2 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
                      Source Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <p>No products found.</p>
        )
      ) : (
        // Show subcategories or subsubcategories
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                if (categoryId)
                  navigate(
                    `/browse?category=${categoryId}&subcategory=${item.id}`
                  );
                else if (subcategoryId)
                  navigate(
                    `/browse?category=${categoryId}&subsubcategory=${item.id}`
                  );
              }}
              className="border rounded p-4 cursor-pointer hover:shadow"
            >
              {item.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryBrowser;
