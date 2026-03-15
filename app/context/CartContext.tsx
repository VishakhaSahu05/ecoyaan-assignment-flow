"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

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
  shippingAddress: ShippingAddress | null;
  setShippingAddress: (addr: ShippingAddress) => void;
  subtotal: number;
  grandTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);

  const hasItems = cartData && cartData.cartItems.length > 0;

  const subtotal = hasItems
    ? cartData.cartItems.reduce((sum, item) => sum + item.product_price * item.quantity, 0)
    : 0;

  // Only charge shipping if there are actual items in cart
  const grandTotal = hasItems
    ? subtotal + cartData.shipping_fee - cartData.discount_applied
    : 0;

  return (
    <CartContext.Provider
      value={{
        cartData,
        setCartData,
        shippingAddress,
        setShippingAddress,
        subtotal,
        grandTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
