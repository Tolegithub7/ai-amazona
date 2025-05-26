"use client";
import { useState } from "react";
import AddToCartButton from "./AddToCartButton";

export default function AddToCartWithQuantity({ id, name, price, images, stock }: { id: string; name: string; price: number; images: string[]; stock: number }) {
  const [quantity, setQuantity] = useState(1);
  return (
    <div className="flex items-center gap-2 mt-2">
      <select
        value={quantity}
        onChange={e => setQuantity(Number(e.target.value))}
        className="border rounded px-2 py-1"
      >
        {Array.from({ length: stock }, (_, i) => i + 1).map((n) => (
          <option key={n} value={n}>{n}</option>
        ))}
      </select>
      <AddToCartButton id={id} name={name} price={price} images={images} disabled={stock === 0} quantity={quantity} />
    </div>
  );
} 