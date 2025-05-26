"use client";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import type { ShippingInfo } from "./ShippingForm";
const ShippingForm = dynamic(() => import("./ShippingForm"), { ssr: false });

export default function ShippingFormClientWrapper() {
  const router = useRouter();
  const handleShippingSubmit = (info: ShippingInfo) => {
    localStorage.setItem("shippingInfo", JSON.stringify(info));
    router.push("/checkout/payment");
  };
  return <ShippingForm onSubmit={handleShippingSubmit} />;
} 