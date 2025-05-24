"use client";
import { useCart } from "@/store/cart-store";
// If shadcn/ui Sheet is available, use it. Otherwise, fallback to a fixed div.

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, removeItem, updateQuantity, clearCart } = useCart();
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      style={{ boxShadow: "-2px 0 8px rgba(0,0,0,0.08)" }}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-bold">Your Cart</h2>
        <button onClick={onClose} className="text-xl">×</button>
      </div>
      <div className="p-4 flex-1 flex flex-col gap-4 overflow-y-auto" style={{ maxHeight: "calc(100vh - 160px)" }}>
        {items.length === 0 ? (
          <div className="text-muted-foreground text-center mt-8">Your cart is empty.</div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex gap-3 items-center border-b pb-2">
              <img src={item.image} alt={item.name} className="w-14 h-14 object-contain rounded bg-muted" />
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
          ))
        )}
      </div>
      <div className="p-4 border-t flex flex-col gap-2">
        <div className="flex justify-between font-semibold">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <button className="btn btn-primary w-full mt-2">Checkout</button>
        <button className="btn btn-outline w-full" onClick={clearCart}>Clear Cart</button>
      </div>
    </div>
  );
} 