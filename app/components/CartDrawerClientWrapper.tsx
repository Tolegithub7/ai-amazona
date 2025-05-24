"use client";
import { useEffect, useState } from "react";
import CartDrawer from "@/app/components/CartDrawer";
import { useCartDrawer } from "@/store/cart-drawer-store";

export default function CartDrawerClientWrapper() {
  const isOpen = useCartDrawer((s) => s.isOpen);
  const close = useCartDrawer((s) => s.close);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <CartDrawer open={isOpen} onClose={close} />;
} 