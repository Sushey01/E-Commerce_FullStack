// CategoryPage.js
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import supabase from "../supabase";
import Spinner from "../components/Spinner";

const Categories = () => {
  const [subcategories, setSubcategories] = useState([]);
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
      const { data: subData, error } = await supabase
        .from("subcategories")
        .select("id, name")
        .eq("category_id", categoryId);

      if (!error && subData) setSubcategories(subData);

      setLoading(false);
    };

    fetchData();
  }, [categoryId]);

  if (loading) return <Spinner />;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">
        {categoryName ? `${categoryName} Subcategories` : "Subcategories"}
      </h2>

      {subcategories.length === 0 ? (
        <p>No subcategories found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {subcategories.map((s) => (
            <div
              key={s.id}
              onClick={() => navigate(`/subcategory?id=${s.id}`)}
              className="border rounded p-4 cursor-pointer hover:shadow"
            >
              {s.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;
