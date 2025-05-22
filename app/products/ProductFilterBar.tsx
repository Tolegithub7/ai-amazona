"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Category } from "@/lib/generated/prisma";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export default function ProductFilterBar({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initial values from URL
  const initialCategory = searchParams.get("category") || "";
  const initialMinPrice = Number(searchParams.get("minPrice")) || 0;
  const initialMaxPrice = Number(searchParams.get("maxPrice")) || 200;
  const initialSort = searchParams.get("sort") || "newest";

  const [category, setCategory] = useState(initialCategory);
  const [price, setPrice] = useState<number[]>([initialMinPrice, initialMaxPrice]);
  const [sort, setSort] = useState(initialSort);

  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (category && category !== "all") params.set("category", category); else params.delete("category");
    params.set("minPrice", price[0].toString());
    params.set("maxPrice", price[1].toString());
    if (sort) params.set("sort", sort); else params.delete("sort");
    params.delete("page"); // Reset to first page on filter
    router.push(`/products?${params.toString()}`);
  };

  const handleReset = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("category");
    params.delete("minPrice");
    params.delete("maxPrice");
    params.delete("sort");
    params.delete("page");
    router.push(`/products?${params.toString()}`);
    setCategory("all");
    setPrice([0, 200]);
    setSort("newest");
  };

  return (
    <div className="w-full flex flex-col gap-4 md:flex-row md:items-end md:gap-6 mb-6">
      {/* Category Dropdown */}
      <div className="w-full md:w-48">
        <label className="block text-sm font-medium mb-1">Category</label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* Price Range Slider */}
      <div className="w-full md:w-64">
        <label className="block text-sm font-medium mb-1">Price Range</label>
        <Slider
          min={0}
          max={200}
          step={1}
          value={price}
          onValueChange={setPrice}
          className="w-full"
        />
        <div className="flex justify-between text-xs mt-1">
          <span>${price[0]}</span>
          <span>${price[1]}</span>
        </div>
      </div>
      {/* Sort Dropdown */}
      <div className="w-full md:w-48">
        <label className="block text-sm font-medium mb-1">Sort by</label>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* Buttons */}
      <div className="flex gap-2 mt-2 md:mt-0">
        <Button onClick={handleApply} variant="default">Apply Filter</Button>
        <Button onClick={handleReset} variant="outline">Reset</Button>
      </div>
    </div>
  );
} 