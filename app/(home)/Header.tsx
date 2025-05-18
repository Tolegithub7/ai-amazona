"use client";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, ShoppingCart, User, Search } from "lucide-react";

export default function Header() {
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(search)}`;
    }
  };

  return (
    <header className="w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
      <div className="container flex flex-col gap-2 md:flex-row md:items-center md:justify-between md:h-16 px-4">
        <div className="flex items-center justify-between gap-4 w-full md:w-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <ShoppingCart className="h-6 w-6 text-primary" />
            <span>ai-amazona</span>
          </Link>
          {/* Mobile menu */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex w-full md:w-1/3 max-w-md mx-auto items-center gap-2">
          <Input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className=""
            aria-label="Search products"
          />
          <Button type="submit" variant="secondary" size="icon" aria-label="Search">
            <Search className="h-5 w-5" />
          </Button>
        </form>
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
      </div>
    </header>
  );
} 