import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductImageGallery from "./ProductImageGallery";
import ProductCard from "../ProductCard";

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      category: true,
      reviews: {
        include: { user: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!product) return notFound();

  // Placeholder for related products
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      NOT: { id: product.id },
    },
    take: 8,
  });

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Image Gallery */}
        <div className="md:w-1/2">
          <ProductImageGallery images={product.images} name={product.name} />
        </div>
        {/* Product Info */}
        <div className="md:w-1/2 flex flex-col gap-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <div className="text-lg text-primary font-semibold">${product.price.toFixed(2)}</div>
          <div className="text-sm text-muted-foreground">Category: {product.category?.name}</div>
          <div className="text-sm">{product.description}</div>
          <div className="text-sm">Stock: {product.stock > 0 ? product.stock : <span className="text-red-500">Out of stock</span>}</div>
          {/* TODO: Add to cart button */}
          <button className="btn btn-primary w-fit" disabled={product.stock === 0}>Add to Cart</button>
        </div>
      </div>
      {/* Reviews Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>
        {/* TODO: Reviews list and add review form */}
        <div className="text-muted-foreground">Reviews coming soon...</div>
      </div>
      {/* Related Products Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Related Products</h2>
        <div className="flex gap-4 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory">
          {relatedProducts.map((rp) => (
            <div key={rp.id} className="min-w-[180px] snap-start">
              <ProductCard id={rp.id} name={rp.name} price={rp.price} images={rp.images} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 