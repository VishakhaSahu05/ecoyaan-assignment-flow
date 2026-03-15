import Header from "../components/Header";
import StepIndicator from "../components/StepIndicator";
import ShippingForm from "./ShippingForm";

export default function CheckoutPage() {
  return (
    <div>
      <Header />
      <div className="max-w-5xl mx-auto px-4 pb-12">
        <StepIndicator current={2} />
        <ShippingForm />
      </div>
    </div>
  );
}
