"use client";
import { useCart } from "@/store/cart-store";
import { useState } from "react";
import { toast } from "sonner";

export default function AddToCartButton({ id, name, price, images, disabled }: { id: string; name: string; price: number; images: string[]; disabled?: boolean }) {
  const addItem = useCart((s) => s.addItem);
  const [loading, setLoading] = useState(false);
  const handleAdd = () => {
    setLoading(true);
    addItem({ id, name, price, image: images[0] || "" });
    setLoading(false);
    toast.success("Added to cart", { description: `${name} has been added to your cart.` });
  };
  return (
    <button
      className="btn btn-primary w-fit"
      disabled={disabled || loading}
      onClick={handleAdd}
      type="button"
    >
      {loading ? "Adding..." : "Add to Cart"}
    </button>
  );
} 