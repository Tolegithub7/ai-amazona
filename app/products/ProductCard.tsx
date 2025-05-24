import Link from "next/link";
import Image from "next/image";

export default function ProductCard({ id, name, price, images }: { id: string; name: string; price: number; images: string[] }) {
  return (
    <Link href={`/products/${id}`} className="block group bg-card rounded-lg p-2 shadow-sm hover:shadow-md transition-all w-full">
      <div className="aspect-square w-full bg-muted rounded mb-2 flex items-center justify-center overflow-hidden">
        {images && images.length > 0 ? (
          <Image src={images[0]} alt={name} width={180} height={180} className="object-contain rounded group-hover:scale-105 transition-transform" />
        ) : (
          <span className="text-xs text-muted-foreground">No image</span>
        )}
      </div>
      <div className="font-semibold text-center truncate" title={name}>{name}</div>
      <div className="text-sm text-primary text-center">${price.toFixed(2)}</div>
    </Link>
  );
} 