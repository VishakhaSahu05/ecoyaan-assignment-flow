import { NextResponse } from "next/server";
import { mockCartData } from "../../lib/cartData";

export async function GET() {
  await new Promise((r) => setTimeout(r, 80));
  return NextResponse.json(mockCartData);
}