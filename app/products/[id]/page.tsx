import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductImageGallery from "./ProductImageGallery";
import ProductCard from "../ProductCard";
import VariationArrow from "./VariationArrow";
import AddToCartWithQuantity from "./AddToCartWithQuantity";

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
  // For navigation, create a list of product IDs (current + related)
  const allProductIds = [product.id, ...relatedProducts.map(p => p.id)];
  const currentIndex = allProductIds.indexOf(product.id);
  const prevId = currentIndex > 0 ? allProductIds[currentIndex - 1] : null;
  const nextId = currentIndex < allProductIds.length - 1 ? allProductIds[currentIndex + 1] : null;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row gap-8 items-center">
        {/* Left Arrow */}
        <VariationArrow direction="left" targetId={prevId} />
        {/* Image Gallery */}
        <div className="md:w-1/2">
          <ProductImageGallery images={product.images} name={product.name} />
        </div>
        {/* Product Info */}
        <div className="md:w-1/2 flex flex-col gap-4">
          {/* Star Rating */}
          <div className="flex items-center gap-2">
            {(() => {
              const reviews = product.reviews || [];
              const avg = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
              return (
                <>
                  {[1,2,3,4,5].map((n) => (
                    <svg key={n} width="20" height="20" fill={n <= Math.round(avg) ? '#facc15' : 'none'} stroke="#facc15" strokeWidth="1.5" viewBox="0 0 24 24"><polygon points="12 2 15 8.5 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 9 8.5 12 2"/></svg>
                  ))}
                  <span className="text-sm text-muted-foreground ml-1">{avg.toFixed(1)} ({reviews.length})</span>
                </>
              );
            })()}
          </div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <div className="text-lg text-primary font-semibold">${product.price.toFixed(2)}</div>
          <div className="text-sm text-muted-foreground">Category: {product.category?.name}</div>
          <div className="text-sm">{product.description}</div>
          <div className="text-sm">Stock: {product.stock > 0 ? product.stock : <span className="text-red-500">Out of stock</span>}</div>
          {/* Add to cart with quantity dropdown */}
          {product.stock > 0 && (
            <AddToCartWithQuantity id={product.id} name={product.name} price={product.price} images={product.images} stock={product.stock} />
          )}
        </div>
        {/* Right Arrow */}
        <VariationArrow direction="right" targetId={nextId} />
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