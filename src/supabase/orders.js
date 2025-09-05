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
      product_id: item.id, // Maps item.id to product_id
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

    return order;
  } catch (error) {
    console.error("❌ Order creation failed:", error.message);
    return null;
  }
}
