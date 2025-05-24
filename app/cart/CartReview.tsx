"use client";
import { useCart } from "@/store/cart-store";
import Link from "next/link";

export default function CartReview({ onCheckout }: { onCheckout?: () => void }) {
  const { items, removeItem, updateQuantity, clearCart } = useCart();
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-2xl font-bold mb-2">Your cart is empty</div>
        <Link href="/products" className="text-primary underline">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      <div className="flex flex-col gap-4 mb-6">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 items-center border-b pb-2">
            <img src={item.image} alt={item.name} className="w-16 h-16 object-contain rounded bg-muted" />
            <div className="flex-1">
              <div className="font-semibold truncate">{item.name}</div>
              <div className="text-sm text-primary">${item.price.toFixed(2)}</div>
              <div className="flex items-center gap-2 mt-1">
                <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="px-2">-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2">+</button>
              </div>
            </div>
            <button onClick={() => removeItem(item.id)} className="text-red-500 ml-2">Remove</button>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center font-semibold text-lg mb-6">
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
      <button
        className="btn btn-primary w-full"
        onClick={onCheckout}
        disabled={items.length === 0}
      >
        Proceed to Checkout
      </button>
      <button className="btn btn-outline w-full mt-2" onClick={clearCart}>Clear Cart</button>
    </div>
  );
} 