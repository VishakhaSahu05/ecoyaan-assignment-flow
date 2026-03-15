"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart, ShippingAddress } from "../context/CartContext";

const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu & Kashmir", "Ladakh", "Puducherry", "Chandigarh"
];

type Errors = Partial<Record<keyof ShippingAddress, string>>;

// Moved outside component so it doesn't re-create on every render
// (was causing input focus loss when defined inside — learned this the hard way)
interface FieldProps {
  label: string;
  name: keyof ShippingAddress;
  value: string;
  onChange: (val: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
}

function FormField({ label, name, value, onChange, error, type = "text", placeholder }: FieldProps) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-1">
        {label} <span className="text-red-500">*</span>
      </label>
      <input
        id={name}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full border rounded-lg px-3 py-2.5 text-sm text-gray-800 transition-colors
          ${error
            ? "border-red-400 bg-red-50 focus:border-red-400"
            : "border-gray-200 focus:border-green-500"
          }`}
      />
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
}

export default function ShippingForm() {
  const router = useRouter();
  const { setShippingAddress, cartData, grandTotal } = useCart();

  const [form, setForm] = useState<ShippingAddress>({
    fullName: "",
    email: "",
    phone: "",
    pinCode: "",
    city: "",
    state: "",
  });

  const [errors, setErrors] = useState<Errors>({});

  function updateField(field: keyof ShippingAddress, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
    // clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }

  function validate(): Errors {
    const e: Errors = {};
    if (!form.fullName.trim()) e.fullName = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.phone.trim()) e.phone = "Phone is required";
    else if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = "Enter valid 10-digit number";
    if (!form.pinCode.trim()) e.pinCode = "PIN code is required";
    else if (!/^\d{6}$/.test(form.pinCode)) e.pinCode = "PIN code must be 6 digits";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.state) e.state = "Please select a state";
    return e;
  }

  function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    setShippingAddress(form);
    router.push("/payment");
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

      <div className="lg:col-span-2">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800">Shipping Details</h2>
            <p className="text-sm text-gray-500 mt-0.5">Where should we deliver your order?</p>
          </div>

          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <FormField
                name="fullName"
                label="Full Name"
                value={form.fullName}
                onChange={v => updateField("fullName", v)}
                error={errors.fullName}
                placeholder="Rahul Sharma"
              />
            </div>

            <FormField
              name="email"
              label="Email Address"
              type="email"
              value={form.email}
              onChange={v => updateField("email", v)}
              error={errors.email}
              placeholder="rahul@gmail.com"
            />

            {/* phone with +91 prefix */}
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                <span className="flex items-center px-3 bg-gray-50 border border-r-0 border-gray-200 rounded-l-lg text-sm text-gray-500 font-semibold select-none">
                  +91
                </span>
                <input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={e => updateField("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="9876543210"
                  className={`flex-1 border rounded-r-lg px-3 py-2.5 text-sm text-gray-800 transition-colors
                    ${errors.phone
                      ? "border-red-400 bg-red-50 focus:border-red-400"
                      : "border-gray-200 focus:border-green-500"
                    }`}
                />
              </div>
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            <FormField
              name="pinCode"
              label="PIN Code"
              value={form.pinCode}
              onChange={v => updateField("pinCode", v.replace(/\D/g, "").slice(0, 6))}
              error={errors.pinCode}
              placeholder="110001"
            />

            <FormField
              name="city"
              label="City"
              value={form.city}
              onChange={v => updateField("city", v)}
              error={errors.city}
              placeholder="New Delhi"
            />

            <div className="sm:col-span-2">
              <label htmlFor="state" className="block text-sm font-semibold text-gray-700 mb-1">
                State <span className="text-red-500">*</span>
              </label>
              <select
                id="state"
                value={form.state}
                onChange={e => updateField("state", e.target.value)}
                className={`w-full border rounded-lg px-3 py-2.5 text-sm text-gray-800 bg-white transition-colors
                  ${errors.state
                    ? "border-red-400 bg-red-50 focus:border-red-400"
                    : "border-gray-200 focus:border-green-500"
                  }`}
              >
                <option value="">-- Select State --</option>
                {STATES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={() => router.push("/")}
            className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            ← Back to Cart
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-lg text-sm transition-colors"
          >
            Continue to Payment →
          </button>
        </div>
      </div>

      {/* mini order summary */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sticky top-20">
          <h3 className="font-bold text-gray-800 mb-4">Your Order</h3>

          {cartData?.cartItems.map(item => (
            <div key={item.product_id} className="flex gap-3 items-center mb-3">
              <img
                src={item.image}
                alt={item.product_name}
                className="w-10 h-10 rounded-lg object-cover border border-gray-100 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-700 truncate">{item.product_name}</p>
                <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
              </div>
              <p className="text-xs font-bold text-gray-800 whitespace-nowrap">
                ₹{item.product_price * item.quantity}
              </p>
            </div>
          ))}

          {!cartData?.cartItems.length && (
            <p className="text-sm text-gray-400">No items found</p>
          )}

          <hr className="my-3 border-gray-100" />
          <div className="flex justify-between font-bold text-gray-800">
            <span>Total</span>
            <span>₹{grandTotal}</span>
          </div>
        </div>
      </div>

    </div>
  );
}
