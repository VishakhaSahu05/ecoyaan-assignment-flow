import { CartData } from "./context/CartContext";
import CartClient from "./CartClient";
import Header from "./components/Header";
import StepIndicator from "./components/StepIndicator";

async function getCartData(): Promise<CartData> {
  // Need absolute URL for SSR — relative URLs don't work in server components
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/cart`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch cart data");
  return res.json();
}

export default async function HomePage() {
  const cartData = await getCartData();

  return (
    <div>
      <Header />
      <div className="max-w-5xl mx-auto px-4 pb-12">
        <StepIndicator current={1} />
        <CartClient initialCartData={cartData} />
      </div>
    </div>
  );
}
