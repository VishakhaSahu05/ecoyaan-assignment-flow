"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";

export default function SuccessPage() {
  const router = useRouter();
  const [orderId] = useState(
    () => "ECO" + Math.floor(Math.random() * 900000 + 100000)
  );

  return (
    <div>
      <Header />
      <div className="max-w-lg mx-auto px-4 py-14 text-center">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Order Placed! 🎉</h1>
          <p className="text-gray-500 text-sm mb-5">
            Thanks for shopping with Ecoyaan. Your eco-friendly products are on their way!
          </p>

          <div className="bg-gray-50 rounded-lg px-4 py-3 mb-6 text-left">
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Order ID</p>
            <p className="font-bold text-gray-800 font-mono mt-0.5">{orderId}</p>
          </div>

          <div className="text-left space-y-3 mb-6">
            {[
              { icon: "📦", text: "Your items are being packed in eco-friendly packaging" },
              { icon: "🚚", text: "Dispatched within 1-2 business days" },
              { icon: "🏠", text: "Expected delivery in 3-5 business days" },
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-lg">{step.icon}</span>
                <p className="text-sm text-gray-600 pt-0.5">{step.text}</p>
              </div>
            ))}
          </div>

          <div className="bg-green-50 border border-green-100 rounded-lg p-3 mb-6 text-left">
            <p className="text-xs text-green-700">
              🌱 By choosing Ecoyaan, you helped reduce plastic waste. Thank you for making a difference!
            </p>
          </div>

          <button
            onClick={() => router.push("/")}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg text-sm transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
