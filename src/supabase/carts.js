import supabase from "../supabase";

const TEMP_USER_ID = "aa62b313-11dc-400d-aad3-a476c328a0d5";

// Create or update a cart
export async function saveCart(cartItems) {
  try {
    // Check if cart exists for user
    const { data: existingCart, error: fetchError } = await supabase
      .from("carts")
      .select("*")
      .eq("user_id", TEMP_USER_ID)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116: no rows found
      throw fetchError;
    }

    if (existingCart) {
      // Update existing cart
      const { error: updateError } = await supabase
        .from("carts")
        .update({ cart_items: cartItems, updated_at: new Date().toISOString() })
        .eq("id", existingCart.id);

      if (updateError) throw updateError;
      return { ...existingCart, cart_items: cartItems };
    } else {
      // Create new cart
      const { data: newCart, error: insertError } = await supabase
        .from("carts")
        .insert([{ user_id: TEMP_USER_ID, cart_items: cartItems }])
        .select()
        .single();

      if (insertError) throw insertError;
      return newCart;
    }
  } catch (error) {
    console.error("❌ Error saving cart:", error.message);
    return null;
  }
}

// Fetch cart for user
export async function fetchCart() {
  try {
    const { data, error } = await supabase
      .from("carts")
      .select("*")
      .eq("user_id", TEMP_USER_ID)
      .single();

    if (error) throw error;
    return data?.cart_items || [];
  } catch (error) {
    console.error("❌ Error fetching cart:", error.message);
    return [];
  }
}
// Clear the entire cart
export async function clearCart() {
  try {
    const { error } = await supabase
      .from("carts")
      .delete()
      .eq("user_id", TEMP_USER_ID);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("❌ Error clearing cart:", error.message);
    return false;
  }
}

