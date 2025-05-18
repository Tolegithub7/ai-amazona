"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Product, Category } from "@/lib/generated/prisma";

type ProductWithCategory = Product & { category: Category | null };

export default function ProductGrid({ products }: { products: ProductWithCategory[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/products/${product.id}`}
          className="group border rounded-lg overflow-hidden bg-white shadow hover:shadow-lg transition"
        >
          <div className="relative aspect-[4/3] bg-gray-100">
            <Image
              src={product.images[0] || "/images/placeholder.png"}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-1 truncate">{product.name}</h3>
            <p className="text-sm text-muted-foreground mb-2 truncate">{product.category?.name}</p>
            <div className="font-bold text-primary text-xl mb-1">${product.price.toFixed(2)}</div>
            <Button className="w-full mt-2">Add to Cart</Button>
          </div>
        </Link>
      ))}
    </div>
  );
} 