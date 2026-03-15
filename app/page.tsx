import CartClient from "./CartClient";
import Header from "./components/Header";
import StepIndicator from "./components/StepIndicator";
import { mockCartData } from "./lib/cartData";

async function getCartData() {
  await new Promise((r) => setTimeout(r, 0));
  return mockCartData;
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