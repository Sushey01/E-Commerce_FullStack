import { Heart, Share2, ShoppingCart } from "lucide-react";
import React from "react";
import { saveCartItem } from "../supabase/carts";
import supabase from "../supabase";
import { useDispatch } from "react-redux";
import { addToWishlist } from "../features/wishlistSlice";
import { addToCartlist } from "../features/cartlistSlice";
import { toast } from "react-toastify";

const HoverAddCartWishShare = ({ product = {} }) => {
  const dispatch = useDispatch();

  const onAddToWishList = () => {
    dispatch(addToWishlist(product));
    toast.success(`${product.title} added to wishlist`);
  };

  const onAddToCart = async () => {
    try {
      const baseId = product.id || product.product_id;
      if (!baseId) {
        toast.error("Missing product id");
        return;
      }

      // Attempt to fetch seller_product_id linked to this product
      let sellerProductId = null;
      const { data: sp, error: spErr } = await supabase
        .from("seller_products")
        .select("seller_product_id")
        .eq("product_id", baseId)
        .limit(1);
      if (!spErr && sp && sp.length > 0) {
        sellerProductId = sp[0].seller_product_id;
      }

      const productWithId = {
        ...product,
        product_id: baseId,
        seller_product_id: sellerProductId,
        quantity: 1,
      };
      await saveCartItem(productWithId);
      toast.success(`${product.title} added to cart`);
    } catch (err) {
      console.error("❌ Failed to save item in Supabase", err);
      toast.error("Failed to add item to cart");
    }
  };

  return (
    <div className="md:p-1.5 p-1 flex flex-col gap-2 border cursor-pointer bg-[#f69620]">
      <div className="border p-1 rounded-full flex justify-center bg-white">
        <ShoppingCart className="w-4 h-4" onClick={onAddToCart} />
      </div>

      <div
        className="border p-1 rounded-full flex justify-center hover:text-red-400 bg-white"
        onClick={onAddToWishList}
      >
        <Heart className="w-4 h-4" />
      </div>

      <div className="border p-1 rounded-full flex justify-center bg-white">
        <Share2 className="w-4 h-4" />
      </div>
    </div>
  );
};

export default HoverAddCartWishShare;
