import supabase from "../supabase";

const TEMP_USER_ID = "aa62b313-11dc-400d-aad3-a476c328a0d5";

// Get or create a cart for a user
export async function getOrCreateCart() {
  try {
    let { data: cart, error } = await supabase
      .from("carts")
      .select("*")
      .eq("user_id", TEMP_USER_ID)
      .single();

    if (error && error.code !== "PGRST116") throw error;

    if (!cart) {
      const { data: newCart, error: insertError } = await supabase
        .from("carts")
        .insert([{ user_id: TEMP_USER_ID }])
        .select()
        .single();
      if (insertError) throw insertError;
      return newCart;
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

    const { data: existingItems } = await supabase
      .from("cart_items")
      .select("*")
      .eq("cart_id", cart.id)
      .eq("product_id", item.product_id);

    if (existingItems.length > 0) {
      // Update existing item
      await supabase
        .from("cart_items")
        .update({
          quantity: Number(item.quantity),
          price: Number(item.price ?? 0),
          title: item.title ?? item.name ?? "Product",
          image: item.image ?? "",
          seller: item.seller ?? "Unknown Seller",
          variant: item.variant ?? {},
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingItems[0].id);
    } else {
      // Insert new item
      await supabase.from("cart_items").upsert(
        [
          {
            cart_id: cart.id,
            product_id: item.product_id,
            quantity: Number(item.quantity),
            price: Number(item.price ?? 0),
            title: item.title ?? item.name ?? "Product",
            image: item.image ?? "",
            seller: item.seller ?? "Unknown Seller",
            variant: item.variant ?? {},
            updated_at: new Date().toISOString(),
          },
        ],
        { onConflict: ["cart_id", "product_id"] }
      );
    }
  } catch (err) {
    console.error("Error saving cart item:", err.message);
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
