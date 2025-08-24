import React from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { addToCartlist } from "../features/cartlistSlice";
import { formatPrice } from "../utils/formatPrice";

const ProductDetailInfo = ({ product }) => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      style: product.variant?.style?.[0] || "",
      capacity: product.variant?.size?.[0] || "",
      color: product.variant?.color?.[0] || "",
      quantity: 1,
      LocalProductID: product.id,
    },
  });

  const dispatch = useDispatch();
  const quantity = watch("quantity");
  const style = watch("style");
  const capacity = watch("capacity");
  const color = watch("color");

  // Log product only once on mount
  React.useEffect(() => {
    console.log("Product prop:", product);
  }, [product]);

  // Handle form submission
  const onSubmit = (data) => {
    console.log("Submitted data:", data); // Log submitted data to debug
    if (!product.title1 || !product.subtitle) {
      alert("Product data is incomplete. Please try again.");
      return;
    }

  const cartItem = {
  id: product.id,
  name: `${product.title1} ${product.subtitle || ""}`.trim(),
  price: product.price || 60000,
  oldPrice: product.oldPrice || null,   // ✅ keep old price if exists
  quantity: data.quantity,
  image: product.image || "",
  style: data.style,
  capacity: data.capacity,
  color: data.color,
};


    // Dispatch to Redux
    dispatch(addToCartlist(cartItem));
    // console.log("Dispatched cart item:", cartItem); // Log dispatched item

    // Save to localStorage
    const existingCart = JSON.parse(localStorage.getItem("cartlist") || "[]");
    const existingItemIndex = existingCart.findIndex(
      (item) =>
        item.id === cartItem.id &&
        item.style === cartItem.style &&
        item.capacity === cartItem.capacity &&
        item.color === cartItem.color
    );
    let updatedCart;
    if (existingItemIndex >= 0) {
      updatedCart = [...existingCart];
      updatedCart[existingItemIndex].quantity += cartItem.quantity;
    } else {
      updatedCart = [...existingCart, cartItem];
    }
    localStorage.setItem("cartlist", JSON.stringify(updatedCart));
    // console.log("Cart saved to localStorage:", updatedCart); // Log to verify

    alert(`${cartItem.name} added to cart!`);
  };

  // Handle quantity increment/decrement
  const handleQuantityChange = (delta) => {
    setValue("quantity", Math.max(1, quantity + delta));
  };

  // Calculate discounted price
  const discountedAmount = product.oldPrice && product.price
    ? product.oldPrice - product.price
    : 0;
  const discountDisplay = discountedAmount > 0
    ? `Save ${formatPrice(discountedAmount)}`
    : "";

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
      <p className="text-gray-600 mt-2">{product.subtitle || "No description available"}</p>

      {/* Rating */}
      <div className="flex items-center mt-3">
        <div className="text-yellow-400 text-lg">★★★★★</div>
        <p className="ml-2 text-gray-500 text-sm">{product.reviews || 0} Reviews</p>
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
            {Object.entries(product.variant).map(([key, values]) => (
              <div className="mt-6" key={key}>
                <p className="font-medium text-sm text-gray-700 mb-1">{key}</p>
                <div className="flex gap-4 flex-wrap">
                  {values.map((value) => (
                    <label key={value} className="flex items-center gap-2">
                      <input
                        type="radio"
                        {...register(key, {
                          required: `Please select a ${key}`,
                        })}
                        value={value}
                        className="form-radio text-black"
                      />
                      <span className="text-sm">{value}</span>
                    </label>
                  ))}
                </div>
                {errors[key] && (
                  <p className="text-red-500 text-sm mt-1">{errors[key].message}</p>
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