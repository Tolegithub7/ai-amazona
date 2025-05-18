"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, ShoppingCart, User } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <ShoppingCart className="h-6 w-6 text-primary" />
          <span>ai-amazona</span>
        </Link>
        {/* Navigation */}
        <nav className="hidden md:flex gap-6">
          <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
          <Link href="/about" className="hover:text-primary transition-colors">About</Link>
          <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
        </nav>
        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/account">
              <User className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/signin">Sign In</Link>
          </Button>
        </div>
        {/* Mobile menu */}
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
} 