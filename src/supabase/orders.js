import { supabase } from "./supabaseClient";

export async function createOrder(orderData, items) {
  try {
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          order_number: orderData.order_number,
          customer_name: orderData.customer_name,
          customer_email: orderData.customer_email,
          subtotal: orderData.subtotal,
          shipping: orderData.shipping,
          discount: orderData.discount,
          total: orderData.total,
          status: "Paid",
        },
      ])
      .select()
      .single();

    if (orderError) throw orderError;

    const orderId = order.id;

    const itemsToInsert = items.map((item) => ({
      order_id: orderId,
      product_id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(itemsToInsert);

    if (itemsError) throw itemsError;

    const { error: paymentError } = await supabase.from("payments").insert({
      order_id: orderId,
      amount: orderData.total,
      status: "Paid",
    });

    if (paymentError) throw paymentError;

    return order;
  } catch (error) {
    console.error("Error creating order:", error.message);
    return null;
  }
}
