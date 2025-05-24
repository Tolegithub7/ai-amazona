"use client";
import { useCart } from "@/store/cart-store";
import { useCartDrawer } from "@/store/cart-drawer-store";

export default function CartIconButton() {
  const { items } = useCart();
  const open = useCartDrawer((s) => s.open);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <button
      onClick={open}
      className="relative p-2 rounded hover:bg-muted transition-colors"
      aria-label="Open cart"
      type="button"
    >
      {/* Simple cart SVG icon */}
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shopping-cart">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center font-bold">
          {itemCount}
        </span>
      )}
    </button>
  );
} 