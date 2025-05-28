import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container max-w-5xl py-8 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>
        
        {/* Checkout Progress */}
        <div className="flex items-center text-sm text-muted-foreground mb-8">
          <Link href="/cart" className="hover:text-primary transition-colors">
            Cart
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link href="/checkout" className="hover:text-primary transition-colors">
            Shipping
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link href="/checkout/payment" className="hover:text-primary transition-colors">
            Payment
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span>Confirmation</span>
        </div>
      </div>
      
      <div className="grid md:grid-cols-[1fr_350px] gap-8">
        <div className="bg-card rounded-lg border shadow-sm p-6">
          {children}
        </div>
        
        <div className="order-first md:order-last">
          <CheckoutSummary />
        </div>
      </div>
    </div>
  );
}

// Client component for order summary
function CheckoutSummary() {
  return (
    <div className="bg-card rounded-lg border shadow-sm p-6 sticky top-24">
      <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
      <ClientSummary />
    </div>
  );
}

// This is a separate client component to avoid "React Client Component" errors
"use client";
import { useCart } from "@/store/cart-store";

function ClientSummary() {
  const { items } = useCart();
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 9.99; // Fixed shipping cost
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  return (
    <div>
      {items.length === 0 ? (
        <p className="text-muted-foreground">Your cart is empty</p>
      ) : (
        <>
          <div className="space-y-2 mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.name} × {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          <div className="border-t pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="border-t mt-4 pt-4 flex justify-between font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </>
      )}
    </div>
  );
}