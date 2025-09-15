// SubcategoryPage.js
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import supabase from "../supabase";
import Spinner from "./Spinner";

const SubcategoryPage = () => {
  const [subsubcategories, setSubsubcategories] = useState([]);
  const [subcategoryName, setSubcategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

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

      // Fetch subsubcategories
      const { data: subsubData, error } = await supabase
        .from("subsubcategories")
        .select("id, name")
        .eq("subcategory_id", subcategoryId);

      if (!error && subsubData) setSubsubcategories(subsubData);

      setLoading(false);
    };

    fetchData();
  }, [subcategoryId]);

  if (loading) return <Spinner />;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">
        {subcategoryName ? `${subcategoryName} Subcategories` : "Subcategories"}
      </h2>

      {subsubcategories.length === 0 ? (
        <p>No subsubcategories found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {subsubcategories.map((s) => (
            <div
              key={s.id}
              onClick={() => navigate(`/subsubcategory?id=${s.id}`)}
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

export default SubcategoryPage;
