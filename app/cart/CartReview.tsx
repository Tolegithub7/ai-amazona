"use client";
import { useCart } from "@/store/cart-store";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function CartReview({ onCheckout }: { onCheckout?: () => void }) {
  const { items, removeItem, updateQuantity, clearCart } = useCart();
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const router = useRouter();

  const handleCheckout = () => {
    if (onCheckout) {
      onCheckout();
      return;
    }
    
    setIsCheckingOut(true);
    // Simulate a small delay for UX
    setTimeout(() => {
      router.push("/checkout");
    }, 500);
  };

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
          <div key={item.id} className="flex gap-4 items-center border-b pb-4">
            <Image src={item.image} alt={item.name} width={64} height={64} className="w-16 h-16 object-contain rounded bg-muted" />
            <div className="flex-1">
              <div className="font-semibold truncate">{item.name}</div>
              <div className="text-sm text-primary">${item.price.toFixed(2)}</div>
              <div className="flex items-center gap-2 mt-1">
                <button 
                  onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} 
                  className="w-8 h-8 flex items-center justify-center rounded-full border text-sm"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                  className="w-8 h-8 flex items-center justify-center rounded-full border text-sm"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>
            <div className="text-lg font-semibold">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
            <button 
              onClick={() => removeItem(item.id)} 
              className="text-red-500 hover:text-red-700 transition-colors"
              aria-label="Remove item"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </button>
          </div>
        ))}
      </div>
      
      <div className="space-y-4 border-t pt-4">
        <div className="flex justify-between items-center font-semibold text-lg">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>Shipping, taxes, and discounts calculated at checkout</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            onClick={handleCheckout}
            className="w-full sm:flex-1"
            disabled={items.length === 0 || isCheckingOut}
          >
            {isCheckingOut ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Proceed to Checkout"
            )}
          </Button>
          <Button 
            variant="outline" 
            className="w-full sm:w-auto" 
            onClick={clearCart}
          >
            Clear Cart
          </Button>
        </div>
      </div>
    </div>
  );
}