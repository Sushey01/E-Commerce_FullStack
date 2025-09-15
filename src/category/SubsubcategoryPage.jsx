// SubsubcategoryPage.js
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import supabase from "../supabase";
import Spinner from "./Spinner";
import FlashSaleSlider from "./FlashSaleSlider";

const SubsubcategoryPage = () => {
  const [products, setProducts] = useState([]);
  const [subsubcategoryName, setSubsubcategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const subsubcategoryId = queryParams.get("id");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Fetch products for this subsubcategory
      const { data: productsData } = await supabase
        .from("products")
        .select("*")
        .eq("subsubcategory_id", subsubcategoryId)
        .order("created_at", { ascending: false });

      if (productsData) setProducts(productsData);

      // Fetch subsubcategory name
      const { data: subsubData } = await supabase
        .from("subsubcategories")
        .select("name")
        .eq("id", subsubcategoryId)
        .single();
      if (subsubData) setSubsubcategoryName(subsubData.name);

      setLoading(false);
    };

    fetchData();
  }, [subsubcategoryId]);

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
