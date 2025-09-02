import {
  CircleCheck,
  EllipsisVertical,
  Package,
  Truck,
  CheckCircle2,
  Clock,
} from "lucide-react";
import React from "react";

const OrderSuccessDetail = () => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 space-y-6 w-[400px]">
      {/* Header */}
      <div className="flex justify-between items-center">
        <p className="font-semibold">Order #98745</p>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-green-100 text-green-600 px-2 py-1 rounded-md text-sm">
            <CircleCheck size={16} />
            <span>Paid</span>
          </div>
          <EllipsisVertical className="text-gray-500" />
        </div>
      </div>

      {/* Date + Total */}
      <div className="text-gray-600 text-sm flex gap-2">
        <p>Oct 29, 2025</p>
        <span>•</span>
        <p className="font-medium">${478.8}</p>
      </div>

      {/* Order Summary */}
      <div>
        <h3 className="text-gray-700 font-semibold mb-3">Order Summary</h3>
        <div className="flex items-center gap-3">
          <img
            src="https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/MXQT2_VW_34FR+watch-44-alum-spacegray-nc-se_VW_34FR+watch-face-44-nike-prideedition-sportband_VW_34FR_GEO_EMEA_LANG_EN?wid=940&hei=1112&fmt=png-alpha&.v=1594155839000"
            alt="Apple Watch"
            className="w-16 h-16 rounded-md border"
          />
          <div>
            <p className="font-medium">Apple Watch S5 GPS 40MM</p>
            <p className="text-sm text-gray-500">MWVE2LL/A</p>
          </div>
        </div>

        <div className="mt-3 text-sm text-gray-600 space-y-1">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>$399.00</span>
          </div>
          <div className="flex justify-between">
            <span>VAT (20.00%)</span>
            <span>$79.80</span>
          </div>
          <div className="flex justify-between font-semibold text-gray-900">
            <span>Total</span>
            <span>$478.80</span>
          </div>
        </div>
      </div>

      {/* Customer */}
      <div>
        <h3 className="text-gray-700 font-semibold mb-3">Customer</h3>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-yellow-500 text-white flex items-center justify-center font-semibold">
            SW
          </div>
          <div>
            <p className="font-medium">Sophia Williams</p>
            <p className="text-sm text-gray-500">sophia@alignui.com</p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div>
        <h3 className="text-gray-700 font-semibold mb-3">Timeline</h3>
        <div className="space-y-4 text-sm">
          <div className="flex gap-3 items-start">
            <CheckCircle2 className="text-green-500" size={18} />
            <div>
              <p className="font-medium">Order confirmed</p>
              <p className="text-gray-500">Order placed and confirmed</p>
              <p className="text-gray-400 text-xs">4 NOV 2025, 05:16</p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <Package className="text-blue-500" size={18} />
            <div>
              <p className="font-medium">Package prepared</p>
              <p className="text-gray-500">Packed and handed to DHL Express</p>
              <p className="text-gray-400 text-xs">5 NOV 2025, 09:45</p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <Truck className="text-orange-500" size={18} />
            <div>
              <p className="font-medium">In transit</p>
              <p className="text-gray-500">Package in transit</p>
              <p className="text-gray-400 text-xs">6 NOV 2025, 14:30</p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <Clock className="text-gray-400" size={18} />
            <div>
              <p className="font-medium">Out for delivery</p>
              <p className="text-gray-500">Will be delivered today</p>
              <p className="text-gray-400 text-xs">6 NOV 2025, 16:45</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessDetail;
