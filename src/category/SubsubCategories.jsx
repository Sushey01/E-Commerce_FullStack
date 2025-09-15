import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import supabase from "../supabase";
import Spinner from "../components/Spinner";
import FlashSaleSlider from "../components/FlashSaleSlider";
const SubsubcategoryPage = () => {
  const [products, setProducts] = useState([]);
  const [subcategoryName, setSubcategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const subcategoryId = queryParams.get("id");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Fetch subcategory name
      const { data: subData } = await supabase
        .from("subcategories")
        .select("name")
        .eq("id", subcategoryId)
        .single();

      if (subData) setSubcategoryName(subData.name);

      // Fetch all products under this subcategory (ignore subsubcategory for now)
      const { data: productsData, error } = await supabase
        .from("products")
        .select("*")
        .eq("subcategory_id", subcategoryId)
        .order("created_at", { ascending: false });

      if (!error && productsData) setProducts(productsData);

      setLoading(false);
    };

    fetchData();
  }, [subcategoryId]);

  if (loading) return <Spinner />;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">
        {subcategoryName ? `Products in ${subcategoryName}` : "Products"}
      </h2>

      {products.length === 0 ? (
        <p>No products found in this Subsubcategory.</p>
      ) : (
        <FlashSaleSlider products={products} />
      )}
    </div>
  );
};

export default SubsubcategoryPage;
