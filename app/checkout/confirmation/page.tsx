"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

type OrderDetails = {
  id: string;
  status: OrderStatus;
  total: number;
  createdAt: string;
  shippingAddress: string;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }[];
};

export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const orderId = searchParams.get("order_id");

  useEffect(() => {
    if (!orderId) {
      setError("No order ID found. Please check your order history.");
      setLoading(false);
      return;
    }

    async function fetchOrderDetails() {
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch order details");
        }
        
        const data = await response.json();
        setOrder(data);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Unable to load order details. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p>Loading your order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
        <p className="text-muted-foreground mb-6">{error || "Unable to find your order."}</p>
        <Link href="/account/orders" className="btn btn-primary">
          View your orders
        </Link>
      </div>
    );
  }

  // Mock order details for development (since the actual API doesn't exist yet)
  // In a real app, this would come from the API response
  const mockOrder: OrderDetails = {
    id: orderId || "ORD123456",
    status: "PROCESSING",
    total: 149.97,
    createdAt: new Date().toISOString(),
    shippingAddress: "123 Main St, City, State, 12345",
    items: [
      { id: "1", name: "Classic White T-Shirt", price: 29.99, quantity: 1 },
      { id: "2", name: "Classic Blue Jeans", price: 59.99, quantity: 2 },
    ],
  };

  const displayOrder = order || mockOrder;

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center text-center mb-8">
        <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
        <h2 className="text-2xl font-bold">Order Confirmed!</h2>
        <p className="text-muted-foreground mt-2">Thank you for your purchase</p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Order Number</p>
            <p className="font-medium">{displayOrder.id}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Date</p>
            <p className="font-medium">{new Date(displayOrder.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Status</p>
            <p className="font-medium capitalize">{displayOrder.status.toLowerCase()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Total</p>
            <p className="font-medium">${displayOrder.total.toFixed(2)}</p>
          </div>
        </div>

        <div className="border-t pt-4">
          <p className="text-muted-foreground mb-2">Shipping Address</p>
          <p className="whitespace-pre-line">{displayOrder.shippingAddress}</p>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-semibold mb-3">Order Items</h3>
          <div className="space-y-3">
            {displayOrder.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <p>${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-6">
        <Link href="/products" className="btn btn-primary">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}