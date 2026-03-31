"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";

type PaymentMethod = "upi" | "card" | "cod";

export default function PaymentClient() {
  const router = useRouter();
  const { cartData, selectedAddress, subtotal, grandTotal } = useCart();
  const [method, setMethod] = useState<PaymentMethod>("upi");
  const [upiId, setUpiId] = useState("");
  const [upiError, setUpiError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!cartData || !selectedAddress) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 mb-4">Something went wrong. Please start again.</p>
        <button onClick={() => router.push("/")}
          className="bg-green-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm">
          Go to Cart
        </button>
      </div>
    );
  }

  const codFee = method === "cod" ? 20 : 0;
  const finalTotal = grandTotal + codFee;

  function handlePay() {
    if (method === "upi") {
      if (!upiId.trim() || !/^[\w.\-_]+@[\w]+$/.test(upiId)) {
        setUpiError("Please enter a valid UPI ID (eg: name@okaxis)");
        return;
      }
    }
    setUpiError("");
    setLoading(true);
    setTimeout(() => router.push("/success"), 2000);
  }

  return (
    // pb-24 so content doesn't hide behind sticky footer
    <div className="pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        <div className="lg:col-span-2 space-y-4">

          {/* Payment method */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">Select Payment Method</h2>
            </div>
            <div className="p-4 space-y-2">
              {([
                { id: "upi" as const, label: "UPI", sub: "Google Pay, PhonePe, Paytm etc.", emoji: "📱" },
                { id: "card" as const, label: "Credit / Debit Card", sub: "Visa, Mastercard, RuPay", emoji: "💳" },
                { id: "cod" as const, label: "Cash on Delivery", sub: "Pay when you receive (+₹20 handling)", emoji: "💵" },
              ]).map(opt => (
                <label key={opt.id}
                  className={`flex items-center gap-3 p-3.5 rounded-lg border-2 cursor-pointer transition-all
                    ${method === opt.id ? "border-green-500 bg-green-50" : "border-gray-100 hover:border-gray-200"}`}>
                  <input type="radio" name="payment" value={opt.id} checked={method === opt.id}
                    onChange={() => setMethod(opt.id)} className="accent-green-600" />
                  <span className="text-xl">{opt.emoji}</span>
                  <div>
                    <p className="text-sm font-bold text-gray-800">{opt.label}</p>
                    <p className="text-xs text-gray-500">{opt.sub}</p>
                  </div>
                </label>
              ))}
            </div>

            {method === "upi" && (
              <div className="px-5 pb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  UPI ID <span className="text-red-500">*</span>
                </label>
                <input type="text" value={upiId}
                  onChange={e => { setUpiId(e.target.value); setUpiError(""); }}
                  placeholder="yourname@okaxis"
                  className={`w-full border rounded-lg px-3 py-2.5 text-sm transition-colors
                    ${upiError ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-green-500"}`}
                />
                {upiError && <p className="text-red-500 text-xs mt-1">{upiError}</p>}
              </div>
            )}

            {method === "card" && (
              <div className="px-5 pb-5 space-y-3">
                <input type="text" placeholder="Card Number"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:border-green-500" />
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="MM / YY" className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:border-green-500" />
                  <input type="text" placeholder="CVV" className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:border-green-500" />
                </div>
                <p className="text-xs text-gray-400">⚠️ This is a demo — no real payment will happen</p>
              </div>
            )}

            {method === "cod" && (
              <div className="px-5 pb-5">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                  💡 A ₹20 handling fee will be added for Cash on Delivery
                </div>
              </div>
            )}
          </div>

          {/* Delivery address */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-800">Delivering to</h3>
              <button onClick={() => router.push("/checkout")}
                className="text-xs text-green-600 font-semibold hover:underline">
                Change
              </button>
            </div>
            <div className="px-5 py-4 text-sm text-gray-600 space-y-0.5">
              <p className="font-bold text-gray-800">{selectedAddress.fullName}</p>
              <p>{selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pinCode}</p>
              <p>{selectedAddress.phone}</p>
              <p>{selectedAddress.email}</p>
            </div>
          </div>

        </div>

        {/* Order summary sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 lg:sticky lg:top-20">
            <h3 className="font-bold text-gray-800 mb-4">Order Summary</h3>
            {cartData.cartItems.map(item => (
              <div key={item.product_id} className="flex gap-3 items-center mb-3">
                <img src={item.image} alt={item.product_name}
                  className="w-12 h-12 rounded-lg object-cover border border-gray-100 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-700 leading-snug">{item.product_name}</p>
                  <p className="text-xs text-gray-400">x{item.quantity}</p>
                </div>
                <p className="text-sm font-bold whitespace-nowrap">₹{item.product_price * item.quantity}</p>
              </div>
            ))}
            <hr className="my-3 border-gray-100" />
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span><span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span><span>₹{cartData.shipping_fee}</span>
              </div>
              {codFee > 0 && (
                <div className="flex justify-between text-gray-500">
                  <span>COD Handling</span><span>₹{codFee}</span>
                </div>
              )}
              {cartData.discount_applied > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span><span>-₹{cartData.discount_applied}</span>
                </div>
              )}
              <hr className="border-gray-100" />
              <div className="flex justify-between font-bold text-gray-800 text-base">
                <span>Total</span><span>₹{finalTotal}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Sticky bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-50">
        <div className="max-w-5xl mx-auto flex gap-3">
          <button onClick={() => router.back()}
            className="px-5 py-3 border border-gray-300 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap">
            ← Back
          </button>
          <button onClick={handlePay} disabled={loading}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-3 rounded-lg text-sm transition-colors flex items-center justify-center gap-2">
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Processing...
              </>
            ) : `🔒 Pay ₹${finalTotal} Securely`}
          </button>
        </div>
      </div>
    </div>
  );
}