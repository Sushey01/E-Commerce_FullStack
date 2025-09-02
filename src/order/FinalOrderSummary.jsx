const FinalOrderSummary = ({ order }) => {
  const items = order?.items || [];
  const subtotal = order?.subtotal || 0;
  const shipping = order?.shipping || 0;
  const discount = order?.discount ||0;
  
  const totalAmount = subtotal - discount + shipping;
  const itemCount = items.length;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">Order Summary</h3>

      {/* Subtotal */}
      <p className="text-sm text-gray-600">
        Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
      </p>
      <p className="text-lg font-bold mt-1">Rs. {subtotal}</p>

      {discount > 0 && (
        <>
          <p className="text-sm text-gray-600 mt-1">Discount</p>
          <p className="text-lg font-bold mt-1 text-red-500">
            - Rs. {discount}
          </p>
        </>
      )}

      {/* Shipping */}
      {shipping > 0 && (
        <p className="text-sm text-gray-600 mt-1">Shipping Fee</p>
      )}
      {shipping > 0 && <p className="text-lg font-bold mt-1">Rs. {shipping}</p>}

      <hr className="my-2" />

      {/* Total */}
      <p className="text-base font-semibold">Total Amount</p>
      <p className="text-xl font-bold mt-1">Rs. {totalAmount}</p>
    </div>
  );
};

export default FinalOrderSummary;
