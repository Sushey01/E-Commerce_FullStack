// SubsubcategoryPage.js
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import supabase from "../supabase";
import Spinner from "../components/Spinner";
import FlashSaleSlider from "../components/FlashSaleSlider";
const SubsubcategoryPage = () => {
  const [products, setProducts] = useState([]);
  const [subsubcategoryName, setSubsubcategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const subsubcategoryId = queryParams.get("id");
  const subcategoryId = queryParams.get("subcategoryId");

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);

    let productsData;
    let title = "";

    if (subsubcategoryId) {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("subsubcategory_id", subsubcategoryId)
        .order("created_at", { ascending: false });
      productsData = (data || []).map((p) => ({
        ...p,
        images: JSON.parse(p.images || "[]"),
      }));

      const { data: subsub } = await supabase
        .from("subsubcategories")
        .select("name")
        .eq("id", subsubcategoryId)
        .single();
      title = subsub?.name || "Products";
    } else if (subcategoryId) {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("subcategory_id", subcategoryId)
        .order("created_at", { ascending: false });
      productsData = (data || []).map((p) => ({
        ...p,
        images: JSON.parse(p.images || "[]"),
      }));

      const { data: sub } = await supabase
        .from("subcategories")
        .select("name")
        .eq("id", subcategoryId)
        .single();
      title = sub?.name || "Products";
    }

    setProducts(productsData || []);
    setSubsubcategoryName(title);
    setLoading(false);
  };

  fetchData();
}, [subcategoryId, subsubcategoryId]);


  if (loading) return <Spinner />;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">
        {subsubcategoryName ? `Products in ${subsubcategoryName}` : "Products"}
      </h2>

      {products.length === 0 ? (
        <p>No products found in this subsubcategory.</p>
      ) : (
        <FlashSaleSlider products={products} />
      )}
    </div>
  );
};

export default SubsubcategoryPage;
