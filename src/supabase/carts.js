import supabase from "../supabase";

const TEMP_USER_ID = "aa62b313-11dc-400d-aad3-a476c328a0d5";

function getLocalCartKey(userId) {
  return `cart_id:${userId}`;
}

async function getActiveUserId() {
  try {
    const { data } = await supabase.auth.getUser();
    return data?.user?.id || TEMP_USER_ID;
  } catch {
    return TEMP_USER_ID;
  }
}

// Get or create a cart for a user (persists chosen cart_id in localStorage)
export async function getOrCreateCart() {
  try {
    const userId = await getActiveUserId();

    // 1) Try localStorage-pinned cart first
    const localKey = getLocalCartKey(userId);
    const cachedCartId =
      typeof window !== "undefined" ? localStorage.getItem(localKey) : null;
    if (cachedCartId) {
      const { data: existingCart, error: findErr } = await supabase
        .from("carts")
        .select("*")
        .eq("id", cachedCartId)
        .single();

      if (!findErr && existingCart) {
        return existingCart;
      }
      if (typeof window !== "undefined") {
        localStorage.removeItem(localKey);
      }
    }

    // 2) Fallback: pick any existing cart for this user
    const { data: carts, error } = await supabase
      .from("carts")
      .select("*")
      .eq("user_id", userId)
      .limit(1);

    if (error) throw error;

    let cart = Array.isArray(carts) ? carts[0] : null;

    if (!cart) {
      const { data: newCart, error: insertError } = await supabase
        .from("carts")
        .insert([{ user_id: userId }])
        .select()
        .single();
      if (insertError) throw insertError;
      cart = newCart;
    }

    // Cache the chosen cart id for this user to ensure consistent reads
    if (typeof window !== "undefined") {
      localStorage.setItem(localKey, cart.id);
    }

    return cart;
  } catch (err) {
    console.error("Error getting cart:", err.message);
    return null;
  }
}

// Fetch all items in the cart
export async function fetchCartItems() {
  try {
    const cart = await getOrCreateCart();
    const { data, error } = await supabase
      .from("cart_items")
      .select("*")
      .eq("cart_id", cart.id);
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("Error fetching cart items:", err.message);
    return [];
  }
}

// Add or update a cart item
export async function saveCartItem(item) {
  try {
    const cart = await getOrCreateCart();
    console.log("Cart returned:", cart);

    if (!item?.product_id) {
      throw new Error("Missing product_id for cart item");
    }

    // Find existing candidates for same product + seller listing (null-safe)
    let candidatesQuery = supabase
      .from("cart_items")
      .select("*")
      .eq("cart_id", cart.id)
      .eq("product_id", item.product_id);

    if (item.seller_product_id == null) {
      candidatesQuery = candidatesQuery.is("seller_product_id", null);
    } else {
      candidatesQuery = candidatesQuery.eq(
        "seller_product_id",
        item.seller_product_id
      );
    }

    const { data: candidates, error: existingErr } = await candidatesQuery;
    if (existingErr) throw existingErr;

    const targetVariant = item.variant ?? {};
    const existingItems = (candidates || []).filter((row) => {
      try {
        const rowVariant = row.variant ?? {};
        return JSON.stringify(rowVariant) === JSON.stringify(targetVariant);
      } catch {
        return false;
      }
    });

    if (existingItems.length > 0) {
      // Update existing item
      const safeVariant =
        typeof item.variant === "object" && item.variant !== null
          ? item.variant
          : {};
      const { error: updateErr } = await supabase
        .from("cart_items")
        .update({
          // increment quantity if item already exists
          quantity:
            Number(existingItems[0].quantity ?? 0) + Number(item.quantity ?? 1),
          price: Number(item.price ?? 0),
          title: item.title ?? item.name ?? "Product",
          image: item.image ?? "",
          variant: safeVariant,
          seller_product_id: item.seller_product_id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingItems[0].id);
      if (updateErr) throw updateErr;
    } else {
      // Insert new item
      const safeVariant =
        typeof item.variant === "object" && item.variant !== null
          ? item.variant
          : {};
      const { error: insertErr } = await supabase.from("cart_items").insert([
        {
          cart_id: cart.id,
          product_id: item.product_id,
          quantity: Number(item.quantity ?? 1),
          price: Number(item.price ?? 0),
          title: item.title ?? item.name ?? "Product",
          image: item.image ?? "",
          variant: safeVariant,
          seller_product_id: item.seller_product_id ?? null,
          updated_at: new Date().toISOString(),
        },
      ]);
      if (insertErr) throw insertErr;
    }
  } catch (err) {
    console.error("Error saving cart item:", err.message || err);
    throw err;
  }
}

// Delete a single cart item
export async function deleteCartItem(itemId) {
  try {
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", itemId);
    if (error) throw error;
  } catch (err) {
    console.error("Error deleting cart item:", err.message);
  }
}

// Delete all cart items
export async function clearCart() {
  try {
    const cart = await getOrCreateCart();
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("cart_id", cart.id);
    if (error) throw error;
  } catch (err) {
    console.error("Error clearing cart:", err.message);
  }
}
