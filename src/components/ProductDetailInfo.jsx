import React from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { addToCartlist } from "../features/cartlistSlice";
import { formatPrice } from "../utils/formatPrice";
import { saveCartItem } from "../supabase/carts";

// Helper function to map color names to actual colors
const getColorValue = (colorName) => {
  const colorMap = {
    black: "#000000",
    white: "#ffffff",
    red: "#ef4444",
    blue: "#3b82f6",
    green: "#22c55e",
    yellow: "#eab308",
    purple: "#a855f7",
    pink: "#ec4899",
    orange: "#f97316",
    gray: "#6b7280",
    grey: "#6b7280",
    brown: "#92400e",
    navy: "#1e3a8a",
    teal: "#14b8a6",
    lime: "#84cc16",
    cyan: "#06b6d4",
    rose: "#f43f5e",
    indigo: "#6366f1",
    violet: "#8b5cf6",
    amber: "#f59e0b",
    emerald: "#10b981",
    sky: "#0ea5e9",
    slate: "#64748b",
  };

  // If it's already a hex color, return as is
  if (colorName.startsWith("#")) return colorName;

  // Return mapped color or the original value (in case it's a valid CSS color)
  return colorMap[colorName.toLowerCase()] || colorName.toLowerCase();
};

const ProductDetailInfo = ({ product }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      variations: {},
      quantity: 1,

      // LocalProductID: product.id,
    },
  });
  const dispatch = useDispatch();
  const quantity = watch("quantity");

  // Create default variations object based on product variants
  const getDefaultVariations = () => {
    // Check if product has no variants or if variants are empty
    if (!product?.variant || Object.keys(product.variant).length === 0) {
      return {};
    }
    // Create an empty object to store default variant selections
    const defaultVariations = {};
    // Loop through each variant (e.g., color, size) and its values (e.g., ["Red", "Blue"])
    Object.entries(product.variant).forEach(([key, values]) => {
      // Check if values exist and are not empty
      if (values && values.length > 0) {
        // Pick the first value as the default for this variant
        defaultVariations[key] = values[0];
      }
    });
    // Return the object with default selections
    return defaultVariations;
  };

  const handleVariations = (key, value) => {
    // console.log([key, value], "sdfsdfsdf");
    setValue("variations", {
      ...watch("variations"),
      [key]: value,
    });
  };

  // Handle form submission
  const onSubmit = async (data) => {
    console.log("Submitted data:", data); // Log submitted data to debug
    if (!product.title1 || !product.subtitle) {
      alert("Product data is incomplete. Please try again.");
      return;
    }

    const cartItem = {
      product_id: product.id,
      id: product.id,
      name: `${product.title1} ${product.subtitle || ""}`.trim(),
      price: product.price || 60000,
      oldPrice: product.oldPrice || null, // ✅ keep old price if exists
      quantity: data.quantity,
      image: product.image || "",
      variant: data.variations || {},
      // LocalProductID:product.id ,
    };

    console.log(cartItem, "ssssssssssss");
    //1. Dispatch to Redux
    dispatch(addToCartlist(cartItem));
    setValue("variations", {});

    await saveCartItem(cartItem); // Supabase
    // reset(defaultValues); // reset form
  };

  // Handle quantity increment/decrement
  const handleQuantityChange = (delta) => {
    setValue("quantity", Math.max(1, quantity + delta));
  };

  // Calculate discounted price
  const discountedAmount =
    product.oldPrice && product.price ? product.oldPrice - product.price : 0;
  const discountDisplay =
    discountedAmount > 0 ? `Save ${formatPrice(discountedAmount)}` : "";

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 bg-white rounded-md shadow-sm relative">
      {product.outOfStock && (
        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center text-red-600 font-bold text-xl z-10">
          Out of Stock
        </div>
      )}

      {/* Product Info */}
      <h1 className="text-2xl md:text-3xl font-semibold leading-tight">
        {product.title1} {product.subtitle || ""}
      </h1>
      <p className="text-gray-600 mt-2">
        {product.subtitle || "No description available"}
      </p>

      {/* Rating */}
      <div className="flex items-center mt-3">
        <div className="text-yellow-400 text-lg">★★★★★</div>
        <p className="ml-2 text-gray-500 text-sm">
          {product.reviews || 0} Reviews
        </p>
      </div>

      {/* Price */}
      <div className="mt-4 text-xl flex font-bold text-black">
        {formatPrice(product.price || 60000)}
        {/* <p>{product.oldPrice}</p> */}

        {product.oldPrice && (
          <span className="line-through text-gray-400 text-base ml-2">
            {formatPrice(product.oldPrice)}
          </span>
        )}
        {discountDisplay && (
          <span className="text-green-600 text-base ml-2 font-semibold">
            {discountDisplay}
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Variants */}
        {product?.variant && Object.keys(product.variant).length > 0 && (
          <>
            {Object.entries(product.variant)
              .filter(
                ([key, values]) => Array.isArray(values) && values.length > 0
              )
              .map(([key, values]) => (
                <div className="mt-6" key={key}>
                  <p className="font-medium text-sm text-gray-700 mb-1 capitalize">
                    {key}
                  </p>
                  <div className="flex gap-4 flex-wrap">
                    {values.map((value) => (
                      <label key={value} className="cursor-pointer">
                        <input
                          type="radio"
                          name={key}
                          value={value}
                          {...register(`variations.${key}`, {
                            required: `Please select a ${key}`,
                          })}
                          onChange={() => handleVariations(key, value)}
                          defaultChecked={getDefaultVariations()[key] === value}
                          className="hidden peer" // ✅ hide radio, but still keeps it functional
                        />

                        {key.toLowerCase() === "color" ||
                        key.toLowerCase() === "colors" ? (
                          // 🎨 show actual color circle
                          <span
                            className="w-8 h-8 rounded-full border-2 border-gray-300 block peer-checked:ring-2 peer-checked:ring-teal-600 peer-checked:ring-offset-1 hover:scale-110 transition-transform"
                            style={{
                              backgroundColor: getColorValue(value),
                              boxShadow:
                                getColorValue(value) === "#ffffff" ||
                                value.toLowerCase() === "white"
                                  ? "inset 0 0 0 1px #e5e7eb"
                                  : "none",
                            }}
                            title={value}
                          ></span>
                        ) : (
                          // 📝 show text for other variants
                          <span className="px-3 py-1 border rounded text-sm peer-checked:bg-teal-600 peer-checked:text-white">
                            {value}
                          </span>
                        )}
                      </label>
                    ))}
                  </div>

                  {errors[key] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors[key].message}
                    </p>
                  )}
                </div>
              ))}
          </>
        )}

        {/* Quantity */}
        <div className="mt-6 flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleQuantityChange(-1)}
            className="px-3 py-1 border rounded"
          >
            -
          </button>
          <span>{quantity}</span>
          <button
            type="button"
            onClick={() => handleQuantityChange(1)}
            className="px-3 py-1 border rounded"
          >
            +
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <button
            type="submit"
            disabled={product.outOfStock}
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded disabled:opacity-50"
          >
            Buy Now
          </button>
          <button
            type="submit"
            disabled={product.outOfStock}
            className="flex items-center justify-center gap-2 border border-teal-600 text-teal-600 px-6 py-2 rounded text-sm hover:bg-teal-50 disabled:opacity-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.3 5.4A1 1 0 007 20h10a1 1 0 001-.8L20 13M7 13H5.4"
              />
            </svg>
            Add to Cart
          </button>
        </div>
      </form>

      {/* Return Policies */}
      <ul className="mt-6 list-disc list-inside text-gray-700 text-sm space-y-1">
        <li>Free delivery today</li>
        <li>100% money back Guarantee</li>
        <li>7 days product return policy</li>
      </ul>
    </div>
  );
};

export default ProductDetailInfo;
