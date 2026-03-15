# Ecoyaan Checkout Flow

A multi-step checkout flow built with **Next.js 14 (App Router)**, **TypeScript**, and **Tailwind CSS**.

## Live Demo

Deploy on Vercel (set the env variable below first):

```bash
npm i -g vercel
vercel
```

---

## Running Locally

```bash
git clone <your-repo-url>
cd ecoyaan-checkout
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

> No extra setup needed — the mock API is built in.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_BASE_URL` | Production only | Your deployed URL e.g. `https://your-app.vercel.app` |

In development this defaults to `http://localhost:3000`. Set it in the Vercel dashboard for production.

---

## Project Structure

```
app/
├── api/cart/route.ts         # Mock API — GET /api/cart (Next.js route handler)
├── context/CartContext.tsx   # Global state — cart data + shipping address
├── components/
│   ├── Header.tsx            # Navbar
│   └── StepIndicator.tsx     # Step 1 → 2 → 3 progress bar
├── page.tsx                  # Step 1: Cart page (Server Component, SSR)
├── CartClient.tsx            # Cart UI — qty stepper, remove, order summary
├── checkout/
│   ├── page.tsx              # Step 2: Shipping (Server Component wrapper)
│   └── ShippingForm.tsx      # Address form with validation
├── payment/
│   ├── page.tsx              # Step 3: Payment (Server Component wrapper)
│   └── PaymentClient.tsx     # Payment method selector + order review
└── success/
    └── page.tsx              # Order confirmed screen
```

---

## Architecture Decisions

### SSR (Server-Side Rendering)

The cart page (`app/page.tsx`) is an **async Server Component** that fetches `/api/cart` at request time using `cache: "no-store"`. This means the product data is always fresh and rendered on the server before sending HTML to the client — no loading spinner on the cart page.

The mock API lives in `app/api/cart/route.ts` as a Next.js Route Handler with the exact data from the assignment.

### State Management — Context API

I used **React Context API** since this is a linear 3-step flow and the data is simple (cart items + one shipping address). Redux/Zustand would be overkill here.

`CartContext` stores:
- `cartData` — cart items, shipping fee, discount (seeded from SSR on step 1)
- `shippingAddress` — collected on step 2, read on step 3
- Computed: `subtotal`, `grandTotal`

### Form Validation

The shipping form uses controlled inputs with a `validate()` function that runs on submit. Errors clear as the user types. The `FormField` component is defined **outside** the parent component to prevent it re-mounting on every render (which would cause the input to lose focus).

Validation rules:
- All fields required
- Email: regex `/\S+@\S+\.\S+/`
- Phone: regex `/^[6-9]\d{9}$/` (Indian mobile numbers)
- PIN code: exactly 6 digits

### Payment Simulation

On clicking "Pay Securely", a 2-second `setTimeout` simulates a payment API call, then redirects to `/success`. No real payment processing happens.

---

## Tech Stack

| What | Choice |
|---|---|
| Framework | Next.js 14, App Router |
| Language | TypeScript |
| Styling | Tailwind CSS |
| State | React Context API |
| Font | Nunito (Google Fonts) |
