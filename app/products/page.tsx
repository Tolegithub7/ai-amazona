import { prisma } from "@/lib/prisma";
import ProductSidebar from "./product-sidebar";
import ProductGrid from "./product-grid";
import Pagination from "./pagination";
import { Product, Category, Prisma } from "@/lib/generated/prisma";
import { Suspense } from "react";
import ProductFilterBar from "./ProductFilterBar";

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
  sort = "newest",
}: {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  pageSize?: number;
  sort?: string;
}): Promise<{ products: ProductWithCategory[]; total: number }> {
  try {
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
    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
    if (sort === "price-asc") orderBy = { price: "asc" };
    else if (sort === "price-desc") orderBy = { price: "desc" };
    else if (sort === "newest") orderBy = { createdAt: "desc" };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { category: true },
      }),
      prisma.product.count({ where }),
    ]);
    return { products, total };
  } catch (error) {
    console.error("Error in getProducts:", error);
    throw error;
  }
}

export default async function ProductsPage({ searchParams }: { searchParams?: Record<string, string | string[]> }) {
  const categories = await getCategories();
  const category = typeof searchParams?.category === "string" ? searchParams.category : undefined;
  const search = typeof searchParams?.search === "string" ? searchParams.search : undefined;
  const minPrice = searchParams?.minPrice ? Number(searchParams.minPrice) : undefined;
  const maxPrice = searchParams?.maxPrice ? Number(searchParams.maxPrice) : undefined;
  const sort = typeof searchParams?.sort === "string" ? searchParams.sort : "newest";
  const page = searchParams?.page ? Number(searchParams.page) : 1;
  const pageSize = 12;
  const { products, total } = await getProducts({ category, search, minPrice, maxPrice, page, pageSize, sort });
  const totalPages = Math.ceil(total / pageSize); 

  return (
    <div className="flex gap-8 max-w-7xl mx-auto">
      <ProductSidebar categories={categories} />
      <main className="flex-1 py-8">
        <ProductFilterBar categories={categories} />
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