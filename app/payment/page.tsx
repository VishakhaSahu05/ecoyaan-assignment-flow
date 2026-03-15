import Header from "../components/Header";
import StepIndicator from "../components/StepIndicator";
import PaymentClient from "./PaymentClient";

export default function PaymentPage() {
  return (
    <div>
      <Header />
      <div className="max-w-5xl mx-auto px-4 pb-12">
        <StepIndicator current={3} />
        <PaymentClient />
      </div>
    </div>
  );
}
