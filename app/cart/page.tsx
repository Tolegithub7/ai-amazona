import dynamic from "next/dynamic";

const CartReview = dynamic(() => import("./CartReview"), { ssr: false });

export default function CartPage() {
  return <CartReview />;
} 