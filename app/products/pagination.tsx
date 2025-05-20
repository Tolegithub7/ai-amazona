import Link from "next/link";

export default function Pagination({
  totalPages,
  currentPage,
  category,
  search,
}: {
  totalPages: number;
  currentPage: number;
  category?: string;
  search?: string;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex justify-center mt-8 gap-2">
      {Array.from({ length: totalPages }).map((_, i) => (
        <Link
          key={i}
          href={`/products?${category ? `category=${category}&` : ""}${search ? `search=${search}&` : ""}page=${i + 1}`}
          className={`px-3 py-1 rounded border ${currentPage === i + 1 ? "bg-primary text-white border-primary" : "bg-white text-primary border-gray-300"}`}
        >
          {i + 1}
        </Link>
      ))}
    </div>
  );
} 