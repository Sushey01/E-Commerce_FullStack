import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import supabase from "../supabase";
import Spinner from "./Spinner";
import FlashSaleSlider from "./FlashSaleSlider";

const CategoryBrowser = () => {
  const [items, setItems] = useState([]);
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

          setItems(subs || []);

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
  }, [categoryId, subcategoryId, subsubcategoryId]);

  if (loading) return <Spinner />;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>

      {subsubcategoryId ? (
        // Show products
        items.length > 0 ? (
          <FlashSaleSlider products={items} />
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
                if (categoryId) navigate(`/browse?subcategory=${item.id}`);
                else if (subcategoryId)
                  navigate(`/browse?subsubcategory=${item.id}`);
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
