"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CartData, useCart } from "./context/CartContext";

export default function CartClient({ initialCartData }: { initialCartData: CartData }) {
  const router = useRouter();
  const { setCartData } = useCart();
  const [cart, setCart] = useState<CartData>(initialCartData);

  // sync local cart state into global context so checkout/payment pages can read it
  useEffect(() => {
    setCartData(cart);
  }, [cart, setCartData]);

  const subtotal = cart.cartItems.reduce(
    (acc, item) => acc + item.product_price * item.quantity,
    0
  );
  const total = subtotal + cart.shipping_fee - cart.discount_applied;

  function updateQty(id: number, qty: number) {
    if (qty < 1) return;
    setCart(prev => ({
      ...prev,
      cartItems: prev.cartItems.map(item =>
        item.product_id === id ? { ...item, quantity: qty } : item
      )
    }));
  }

  function removeItem(id: number) {
    setCart(prev => ({
      ...prev,
      cartItems: prev.cartItems.filter(item => item.product_id !== id)
    }));
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

      {/* Cart items */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800">
              Shopping Cart ({cart.cartItems.length} items)
            </h2>
          </div>

          {cart.cartItems.length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              <div className="text-5xl mb-3">🛒</div>
              <p className="font-semibold">Your cart is empty</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {cart.cartItems.map((item) => (
                <div key={item.product_id} className="p-5 flex gap-4">
                  <img
                    src={item.image}
                    alt={item.product_name}
                    className="w-20 h-20 rounded-lg object-cover border border-gray-100 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 text-sm leading-snug">
                      {item.product_name}
                    </p>
                    <p className="text-green-700 font-bold mt-1">₹{item.product_price}</p>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQty(item.product_id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-50 disabled:opacity-30 text-lg font-bold"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-sm font-bold border-x border-gray-200 text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(item.product_id, item.quantity + 1)}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-50 text-lg font-bold"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-gray-800">
                          ₹{item.product_price * item.quantity}
                        </p>
                        <button
                          onClick={() => removeItem(item.product_id)}
                          className="text-xs text-red-400 hover:text-red-600 mt-0.5"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Order summary */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sticky top-20">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h3>

          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-700">₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Shipping</span>
              <span className="font-semibold text-gray-700">₹{cart.shipping_fee}</span>
            </div>
            {cart.discount_applied > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span className="font-semibold">-₹{cart.discount_applied}</span>
              </div>
            )}
            <hr className="border-gray-100" />
            <div className="flex justify-between font-bold text-gray-800 text-base">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>

          {/* promo code - TODO: wire this up later */}
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              placeholder="Promo code"
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:border-green-500"
            />
            <button className="px-3 py-2 text-sm font-bold text-green-700 border border-green-600 rounded-lg hover:bg-green-50">
              Apply
            </button>
          </div>

          <button
            onClick={() => router.push("/checkout")}
            disabled={cart.cartItems.length === 0}
            className="mt-4 w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg text-sm transition-colors"
          >
            Proceed to Checkout →
          </button>

          <p className="text-center text-xs text-gray-400 mt-3">🔒 Safe & Secure Payments</p>
        </div>
      </div>

    </div>
  );
}
