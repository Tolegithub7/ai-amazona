"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useCart } from "@/store/cart-store";
import { Loader2 } from "lucide-react";
import { PaymentElement, useStripe, useElements, Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { z } from "zod";

// Load stripe outside of component to avoid recreating it on render
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

export default function PaymentPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { items } = useCart();
  const router = useRouter();

  useEffect(() => {
    // Check if we have shipping info and items
    const shippingInfo = localStorage.getItem("shippingInfo");
    if (!shippingInfo) {
      router.push("/checkout");
      return;
    }
    
    if (items.length === 0) {
      router.push("/cart");
      return;
    }

    // Create payment intent with the server
    async function createPaymentIntent() {
      try {
        setLoading(true);
        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            items,
            shippingInfo: JSON.parse(shippingInfo)
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create payment intent");
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (err) {
        console.error("Error creating payment intent:", err);
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    createPaymentIntent();
  }, [items, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p>Preparing payment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-destructive mb-4">{error}</div>
        <button 
          onClick={() => router.push("/checkout")}
          className="btn btn-primary"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-xl font-semibold mb-6">Payment Information</h2>
      
      {clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm />
        </Elements>
      )}
    </>
  );
}

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const router = useRouter();
  const { clearCart } = useCart();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/confirmation`,
        },
        redirect: "if_required",
      });

      if (error) {
        setPaymentError(error.message || "Something went wrong. Please try again.");
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        // Save order details to database and redirect to confirmation
        const response = await fetch("/api/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            paymentIntentId: paymentIntent.id,
            shippingInfo: JSON.parse(localStorage.getItem("shippingInfo") || "{}"),
          }),
        });
        
        if (response.ok) {
          const { orderId } = await response.json();
          clearCart();
          router.push(`/checkout/confirmation?order_id=${orderId}`);
        } else {
          setPaymentError("Your payment was successful, but we couldn't create your order. Please contact support.");
        }
      }
    } catch (err) {
      console.error("Payment error:", err);
      setPaymentError("An unexpected error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      {paymentError && (
        <div className="text-destructive text-sm p-2 bg-destructive/10 rounded">
          {paymentError}
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <button 
          type="button" 
          onClick={() => router.push("/checkout")} 
          className="text-muted-foreground hover:text-foreground transition-colors"
          disabled={isProcessing}
        >
          Back to shipping
        </button>
        
        <button 
          type="submit" 
          className="btn btn-primary min-w-32 relative"
          disabled={!stripe || !elements || isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Processing...
            </>
          ) : (
            "Complete Order"
          )}
        </button>
      </div>
    </form>
  );
}