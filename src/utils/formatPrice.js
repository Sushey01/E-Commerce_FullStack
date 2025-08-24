
export const formatPrice = (price) =>
  typeof price === "number"
    ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price)
    : price;