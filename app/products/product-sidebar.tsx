"use client";
import Link from "next/link";
import { Slider } from "@/components/ui/slider";
import { useRouter, useSearchParams } from "next/navigation";
import { Category } from "@/lib/generated/prisma";
import { useState } from "react";

export default function ProductSidebar({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category");
  const minPrice = Number(searchParams.get("minPrice")) || 0;
  const maxPrice = Number(searchParams.get("maxPrice")) || 200;
  const [price, setPrice] = useState([minPrice, maxPrice]);

  const handlePriceChange = (value: number[]) => {
    setPrice(value);
  };

  const handlePriceCommit = (value: number[]) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("minPrice", value[0].toString());
    params.set("maxPrice", value[1].toString());
    router.push(`/products?${params.toString()}`);
  };

  return (
    <aside className="w-64 shrink-0 hidden md:block pt-4">
      <h2 className="font-bold mb-4 text-lg">Categories</h2>
      <ul className="space-y-2 mb-8">
        <li>
          <Link href="/products" className={!selectedCategory ? "font-semibold text-primary" : ""}>All</Link>
        </li>
        {categories.map((cat) => (
          <li key={cat.id}>
            <Link
              href={`/products?category=${cat.id}`}
              className={cat.id === selectedCategory ? "font-semibold text-primary" : ""}
            >
              {cat.name}
            </Link>
          </li>
        ))}
      </ul>
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Price Range</h3>
        <Slider
          min={0}
          max={200}
          step={1}
          value={price}
          onValueChange={handlePriceChange}
          onValueCommit={handlePriceCommit}
          className="w-full"
        />
        <div className="flex justify-between text-xs mt-2">
          <span>${price[0]}</span>
          <span>${price[1]}</span>
        </div>
      </div>
    </aside>
  );
} 