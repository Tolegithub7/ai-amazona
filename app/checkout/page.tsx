import dynamic from "next/dynamic";
import type { ShippingInfo } from "./ShippingForm";

const ShippingForm = dynamic(() => import("./ShippingForm"), { ssr: false });

export default function CheckoutPage() {
  const handleShippingSubmit = (info: ShippingInfo) => {
    // For now, just log. Next: proceed to payment.
    console.log("Shipping info submitted:", info);
    // TODO: Save to state/localStorage and navigate to payment step
  };
  return <ShippingForm onSubmit={handleShippingSubmit} />;
} 