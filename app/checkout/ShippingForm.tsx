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

type FormData = Omit<ShippingAddress, "id">;
type Errors = Partial<Record<keyof FormData, string>>;

interface FieldProps {
  label: string;
  name: keyof FormData;
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
          ${error ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-green-500"}`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

const emptyForm: FormData = {
  fullName: "", email: "", phone: "", pinCode: "", city: "", state: ""
};

export default function ShippingForm() {
  const router = useRouter();
  const { savedAddresses, addAddress, deleteAddress, selectedAddress, setSelectedAddress, grandTotal, cartData } = useCart();

  const [showForm, setShowForm] = useState(savedAddresses.length === 0);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState<Errors>({});

  function updateField(field: keyof FormData, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
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

  function handleSaveAddress() {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    addAddress(form);
    setForm(emptyForm);
    setShowForm(false);
  }

  function handleSubmit() {
    if (!selectedAddress) {
      alert("Please select a delivery address");
      return;
    }
    router.push("/payment");
  }

  return (
    // pb-24 so content doesn't hide behind sticky footer
    <div className="pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        <div className="lg:col-span-2 space-y-4">

          {/* Saved addresses */}
          {savedAddresses.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-800">Saved Addresses</h2>
              </div>
              <div className="p-4 space-y-3">
                {savedAddresses.map(addr => (
                  <label
                    key={addr.id}
                    className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all
                      ${selectedAddress?.id === addr.id ? "border-green-500 bg-green-50" : "border-gray-100 hover:border-gray-200"}`}
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddress?.id === addr.id}
                      onChange={() => setSelectedAddress(addr)}
                      className="accent-green-600 mt-1 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-gray-800">{addr.fullName}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{addr.city}, {addr.state} - {addr.pinCode}</p>
                      <p className="text-xs text-gray-500">{addr.phone} · {addr.email}</p>
                    </div>
                    <button
                      onClick={(e) => { e.preventDefault(); deleteAddress(addr.id); }}
                      className="text-xs text-red-400 hover:text-red-600 flex-shrink-0"
                    >
                      Delete
                    </button>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Add new address */}
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm font-semibold text-gray-500 hover:border-green-400 hover:text-green-600 transition-colors"
            >
              + Add New Address
            </button>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-800">
                  {savedAddresses.length === 0 ? "Shipping Details" : "Add New Address"}
                </h2>
                {savedAddresses.length > 0 && (
                  <button onClick={() => { setShowForm(false); setForm(emptyForm); setErrors({}); }}
                    className="text-sm text-gray-400 hover:text-gray-600">
                    Cancel
                  </button>
                )}
              </div>

              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <FormField name="fullName" label="Full Name" value={form.fullName}
                    onChange={v => updateField("fullName", v)} error={errors.fullName} placeholder="Rahul Sharma" />
                </div>
                <FormField name="email" label="Email Address" type="email" value={form.email}
                  onChange={v => updateField("email", v)} error={errors.email} placeholder="rahul@gmail.com" />
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex">
                    <span className="flex items-center px-3 bg-gray-50 border border-r-0 border-gray-200 rounded-l-lg text-sm text-gray-500 font-semibold select-none">+91</span>
                    <input id="phone" type="tel" value={form.phone}
                      onChange={e => updateField("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="9876543210"
                      className={`flex-1 border rounded-r-lg px-3 py-2.5 text-sm text-gray-800 transition-colors
                        ${errors.phone ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-green-500"}`}
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
                <FormField name="pinCode" label="PIN Code" value={form.pinCode}
                  onChange={v => updateField("pinCode", v.replace(/\D/g, "").slice(0, 6))} error={errors.pinCode} placeholder="110001" />
                <FormField name="city" label="City" value={form.city}
                  onChange={v => updateField("city", v)} error={errors.city} placeholder="New Delhi" />
                <div className="sm:col-span-2">
                  <label htmlFor="state" className="block text-sm font-semibold text-gray-700 mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <select id="state" value={form.state} onChange={e => updateField("state", e.target.value)}
                    className={`w-full border rounded-lg px-3 py-2.5 text-sm text-gray-800 bg-white transition-colors
                      ${errors.state ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-green-500"}`}>
                    <option value="">-- Select State --</option>
                    {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                </div>
              </div>

              <div className="px-5 pb-5">
                <button onClick={handleSaveAddress}
                  className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-2.5 rounded-lg text-sm transition-colors">
                  Save Address
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 lg:sticky lg:top-20">
            <h3 className="font-bold text-gray-800 mb-4">Your Order</h3>
            {cartData?.cartItems.map(item => (
              <div key={item.product_id} className="flex gap-3 items-center mb-3">
                <img src={item.image} alt={item.product_name}
                  className="w-10 h-10 rounded-lg object-cover border border-gray-100 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-700 truncate">{item.product_name}</p>
                  <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                </div>
                <p className="text-xs font-bold text-gray-800 whitespace-nowrap">
                  ₹{item.product_price * item.quantity}
                </p>
              </div>
            ))}
            {!cartData?.cartItems.length && <p className="text-sm text-gray-400">No items</p>}
            <hr className="my-3 border-gray-100" />
            <div className="flex justify-between font-bold text-gray-800">
              <span>Total</span>
              <span>₹{grandTotal}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Sticky bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-50">
        <div className="max-w-5xl mx-auto flex gap-3">
          <button onClick={() => router.push("/")}
            className="px-5 py-3 border border-gray-300 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap">
            ← Back
          </button>
          <button onClick={handleSubmit}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg text-sm transition-colors">
            Continue to Payment →
          </button>
        </div>
      </div>
    </div>
  );
}