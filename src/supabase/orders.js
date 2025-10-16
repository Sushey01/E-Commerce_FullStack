import supabase from "../supabase";

const TEMP_USER_ID = "aa62b313-11dc-400d-aad3-a476c328a0d5";

export async function createOrder(orderData, items) {
  try {
    if (!orderData.total || !items?.length) {
      throw new Error("Missing required fields: total or items");
    }

    const { user } = await supabase.auth.getUser();
    const userId = user?.id || orderData.user_id || TEMP_USER_ID; // ✅ fallback

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          user_id: userId,
          subtotal: orderData.subtotal ?? 0,
          shipping: orderData.shipping ?? 0,
          discount: orderData.discount ?? 0,
          total: orderData.total,
          status: orderData.status ?? "Payment Pending",
          paid_amount: orderData.paid_amount ?? 0,
          payment_method: orderData.payment_method ?? "unknown",
          observations: orderData.observations ?? null,
          shipping_info: orderData.shipping_info ?? {},
          voucher_code: orderData.voucher_code ?? null,
          expires_at: new Date(Date.now() + 30 * 60 * 1000), // 30 mins
        },
      ])
      .select()
      .single();

    // Example: cancel expired orders
    await supabase
      .from("orders")
      .update({ status: "Cancelled", cancelled_at: new Date() })
      .lt("expires_at", new Date())
      .eq("status", "Payment Pending");

    if (orderError) throw new Error(orderError.message);

    // … rest of your logic

    const orderId = order.id;

    const itemsToInsert = items.map((item) => ({
      order_id: orderId,
      product_id: item.product_id || item.id, // prefer explicit product_id
      seller_product_id: item.seller_product_id ?? null,
      price: item.price,
      quantity: item.quantity,
      variant: item.variant ?? {},
      // name: item.name ?? item.title ?? "Unnamed Product",
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(itemsToInsert);

    if (itemsError) {
      await supabase.from("orders").delete().eq("id", orderId);
      throw new Error(`Order items insertion failed: ${itemsError.message}`);
    }

    const { error: paymentError } = await supabase.from("payments").insert([
      {
        order_id: orderId,
        amount: orderData.total,
        method: orderData.payment_method ?? "unknown",
        status: orderData.payment_status ?? "Unpaid",
        transaction_id: orderData.transaction_id ?? null,
        paid_at:
          orderData.payment_status === "Paid" ? new Date().toISOString() : null,
      },
    ]);

    if (paymentError) {
      await supabase.from("order_items").delete().eq("order_id", orderId);
      await supabase.from("orders").delete().eq("id", orderId);
      throw new Error(`Payment insertion failed: ${paymentError.message}`);
    }

    // Decrement stock for each ordered seller_product and update product out-of-stock status
    try {
      // Use the original items array to ensure we have seller_product_id and product_id/quantity
      for (const item of items) {
        const sellerProductId = item.seller_product_id;
        const productId = item.product_id || item.id;
        const qty = Number(item.quantity || 0);
        if (!sellerProductId || !productId || !qty) continue;

        // 1) Fetch current stock for the seller_product
        const { data: spRow, error: spFetchErr } = await supabase
          .from("seller_products")
          .select("stock")
          .eq("seller_product_id", sellerProductId)
          .single();
        if (spFetchErr) {
          console.warn(
            "Stock fetch failed for seller_product_id",
            sellerProductId,
            spFetchErr.message
          );
          continue;
        }

        const currentStock = Number(spRow?.stock ?? 0);
        const newStock = Math.max(0, currentStock - qty);

        // 2) Update the seller_product stock
        const { error: spUpdateErr } = await supabase
          .from("seller_products")
          .update({ stock: newStock })
          .eq("seller_product_id", sellerProductId);
        if (spUpdateErr) {
          console.warn(
            "Stock update failed for seller_product_id",
            sellerProductId,
            spUpdateErr.message
          );
        }

        // 3) Compute total remaining stock across all sellers for this product to set products.outofstock
        const { data: allSpRows, error: allSpErr } = await supabase
          .from("seller_products")
          .select("stock")
          .eq("product_id", productId);
        if (allSpErr) {
          console.warn(
            "Failed to aggregate stock for product",
            productId,
            allSpErr.message
          );
          continue;
        }

        const totalRemaining = (allSpRows || []).reduce(
          (sum, r) => sum + Number(r.stock || 0),
          0
        );
        const isOut = totalRemaining <= 0;

        const { error: prodUpdateErr } = await supabase
          .from("products")
          .update({ outofstock: isOut })
          .eq("id", productId);
        if (prodUpdateErr) {
          console.warn(
            "Failed to update products.outofstock for",
            productId,
            prodUpdateErr.message
          );
        }
      }
    } catch (stockErr) {
      console.warn("Stock decrement encountered an error:", stockErr);
      // Non-fatal: order was created; stock may be stale until next edit/refresh
    }

    return order;
  } catch (error) {
    console.error("❌ Order creation failed:", error.message);
    return null;
  }
}
