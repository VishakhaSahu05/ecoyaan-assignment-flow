import { CartData } from "./context/CartContext";
import CartClient from "./CartClient";
import Header from "./components/Header";
import StepIndicator from "./components/StepIndicator";

async function getCartData(): Promise<CartData> {
  try {
    const res = await fetch("/api/cart", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch cart data");
    }

    return await res.json();
  } catch (error) {
    console.error("Cart fetch error:", error);

    return {
      cartItems: [],
      shipping_fee: 0,
      discount_applied: 0,
    };
  }
}

export default async function HomePage() {
  const cartData = await getCartData();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-5xl mx-auto px-4 pb-12">
        <StepIndicator current={1} />

        <CartClient initialCartData={cartData} />
      </div>
    </div>
  );
}