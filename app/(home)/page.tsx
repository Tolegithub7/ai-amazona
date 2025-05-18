import { prisma } from "@/lib/prisma";
import BannerCarousel from "./BannerCarousel";
import ProductGrid from "./ProductGrid";
import { Product, Category } from "@/lib/generated/prisma";

type ProductWithCategory = Product & { category: Category | null };

async function getLatestProducts(): Promise<ProductWithCategory[]> {
  return await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 6,
    include: { category: true },
  });
}

export default async function HomePage() {
  const products = await getLatestProducts();

  return (
    <>
      {/* Banner Carousel */}
      <section className="w-full max-w-7xl mx-auto mb-12">
        <BannerCarousel />
      </section>

      {/* Latest Products */}
      <section className="max-w-7xl mx-auto mb-8">
        <h2 className="text-2xl font-bold mb-6">Latest Products</h2>
        <ProductGrid products={products} />
      </section>
    </>
  );
} 