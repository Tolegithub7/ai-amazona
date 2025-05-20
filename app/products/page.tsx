import { prisma } from "@/lib/prisma";
import ProductSidebar from "./product-sidebar";
import ProductGrid from "./product-grid";
import Pagination from "./pagination";
import { Product, Category, Prisma } from "@/lib/generated/prisma";
import { Suspense } from "react";

// Types
export type ProductWithCategory = Product & { category: Category | null };

type ProductWhere = Prisma.ProductWhereInput;

async function getCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

async function getProducts({
  category,
  search,
  minPrice,
  maxPrice,
  page = 1,
  pageSize = 12,
}: {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  pageSize?: number;
}): Promise<{ products: ProductWithCategory[]; total: number }> {
  const where: ProductWhere = {};
  if (category) where.categoryId = category;
  if (search) where.OR = [
    { name: { contains: search, mode: "insensitive" } },
    { description: { contains: search, mode: "insensitive" } },
  ];
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {} as Prisma.FloatFilter;
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { category: true },
    }),
    prisma.product.count({ where }),
  ]);
  return { products, total };
}

export default async function ProductsPage({ searchParams }: { searchParams?: Record<string, string | string[]> }) {
  const categories = await getCategories();
  const category = typeof searchParams?.category === "string" ? searchParams.category : undefined;
  const search = typeof searchParams?.search === "string" ? searchParams.search : undefined;
  const minPrice = searchParams?.minPrice ? Number(searchParams.minPrice) : undefined;
  const maxPrice = searchParams?.maxPrice ? Number(searchParams.maxPrice) : undefined;
  const page = searchParams?.page ? Number(searchParams.page) : 1;
  const pageSize = 12;
  const { products, total } = await getProducts({ category, search, minPrice, maxPrice, page, pageSize });
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="flex gap-8 max-w-7xl mx-auto">
      <ProductSidebar categories={categories} />
      <main className="flex-1 py-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold mb-1">Products</h1>
            {search && <p className="text-muted-foreground text-sm">Search results for &quot;{search}&quot;</p>}
          </div>
          <div className="text-sm text-muted-foreground">
            Showing {products.length} of {total} products
          </div>
        </div>
        <Suspense fallback={<div>Loading products...</div>}>
          {products.length > 0 ? <ProductGrid products={products} /> : <div className="text-center text-muted-foreground py-12">No products found.</div>}
        </Suspense>
        <Pagination totalPages={totalPages} currentPage={page} category={category} search={search} />
      </main>
    </div>
  );
} 