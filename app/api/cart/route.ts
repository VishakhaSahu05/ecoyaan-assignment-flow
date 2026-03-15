import { NextResponse } from "next/server";
const mockCartData = {
  cartItems: [
    {
      product_id: 101,
      product_name: "Bamboo Toothbrush (Pack of 4)",
      product_price: 299,
      quantity: 2,
      image: "https://placehold.co/150x150/d1fae5/065f46?text=Bamboo",
    },
    {
      product_id: 102,
      product_name: "Reusable Cotton Produce Bags",
      product_price: 450,
      quantity: 1,
      image: "https://placehold.co/150x150/fef3c7/92400e?text=Cotton",
    },
  ],
  shipping_fee: 50,
  discount_applied: 0,
};

export async function GET() {
  // small delay to simulate real API
  await new Promise((r) => setTimeout(r, 80));
  return NextResponse.json(mockCartData);
}
