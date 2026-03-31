"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface CartItem {
  product_id: number;
  product_name: string;
  product_price: number;
  quantity: number;
  image: string;
}

export interface CartData {
  cartItems: CartItem[];
  shipping_fee: number;
  discount_applied: number;
}

export interface ShippingAddress {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  pinCode: string;
  city: string;
  state: string;
}

interface CartContextType {
  cartData: CartData | null;
  setCartData: (data: CartData) => void;
  savedAddresses: ShippingAddress[];
  addAddress: (addr: Omit<ShippingAddress, "id">) => ShippingAddress;
  deleteAddress: (id: string) => void;
  selectedAddress: ShippingAddress | null;
  setSelectedAddress: (addr: ShippingAddress) => void;
  subtotal: number;
  grandTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartData, setCartDataState] = useState<CartData | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<ShippingAddress[]>([]);
  const [selectedAddress, setSelectedAddressState] = useState<ShippingAddress | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const addresses = loadFromStorage<ShippingAddress[]>("eco_addresses", []);
    const selected = loadFromStorage<ShippingAddress | null>("eco_selected_address", null);
    const cart = loadFromStorage<CartData | null>("eco_cart", null);
    setSavedAddresses(addresses);
    setSelectedAddressState(selected);
    if (cart) setCartDataState(cart);
    setHydrated(true);
  }, []);

  function setCartData(data: CartData) {
    setCartDataState(data);
    saveToStorage("eco_cart", data);
  }

  function addAddress(addr: Omit<ShippingAddress, "id">): ShippingAddress {
    const newAddr: ShippingAddress = { ...addr, id: Date.now().toString() };
    const updated = [...savedAddresses, newAddr];
    setSavedAddresses(updated);
    saveToStorage("eco_addresses", updated);
    // auto-select the new address
    setSelectedAddressState(newAddr);
    saveToStorage("eco_selected_address", newAddr);
    return newAddr;
  }

  function deleteAddress(id: string) {
    const updated = savedAddresses.filter(a => a.id !== id);
    setSavedAddresses(updated);
    saveToStorage("eco_addresses", updated);
    if (selectedAddress?.id === id) {
      const next = updated[0] || null;
      setSelectedAddressState(next);
      saveToStorage("eco_selected_address", next);
    }
  }

  function setSelectedAddress(addr: ShippingAddress) {
    setSelectedAddressState(addr);
    saveToStorage("eco_selected_address", addr);
  }

  const hasItems = cartData && cartData.cartItems.length > 0;
  const subtotal = hasItems
    ? cartData.cartItems.reduce((sum, item) => sum + item.product_price * item.quantity, 0)
    : 0;
  const grandTotal = hasItems
    ? subtotal + cartData.shipping_fee - cartData.discount_applied
    : 0;

  if (!hydrated) return null;

  return (
    <CartContext.Provider value={{
      cartData, setCartData,
      savedAddresses, addAddress, deleteAddress,
      selectedAddress, setSelectedAddress,
      subtotal, grandTotal,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}